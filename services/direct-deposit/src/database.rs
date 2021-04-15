use std::env;
use std::time::Duration;

use futures::StreamExt;
use mongodb::bson::{doc, document::Document, oid::ObjectId};
use mongodb::options::{AuthMechanism, Credential, StreamAddress};
use mongodb::{options::ClientOptions, Client, Collection};
use opentelemetry::{global, trace::Tracer};

use crate::error;
use crate::error::Error::*;
use crate::service::directdeposit::DirectDeposit;

const DATABASE_NAME: &str = "pay";
const COLLECTION: &str = "direct_deposits";

type Result<T> = std::result::Result<T, error::Error>;

#[derive(Debug, Clone)]
pub struct DirectDepositDb {
    pub client: Client,
}

impl DirectDepositDb {
    pub async fn initialize() -> Result<Self> {
        let db_user = env::var("DATABASE_USER").expect("DATABASE_USER must be set");
        let db_user_password =
            env::var("DATABASE_USER_PASSWORD").expect("DATABASE_USER_PASSWORD must be set");
        let db_host =
            env::var("DATABASE_SERVER_HOSTNAME").expect("DATABASE_SERVER_HOSTNAME must be set");
        let connection_timeout = 5_u64;

        let credential = Credential::builder()
            .username(Some(db_user))
            .password(Some(db_user_password))
            .source(Some("admin".into()))
            .mechanism(Some(AuthMechanism::ScramSha1))
            .mechanism_properties(None)
            .build();

        let client_options = ClientOptions::builder()
            .hosts(vec![StreamAddress {
                hostname: db_host,
                port: Some(27017),
            }])
            .app_name(Some("direct-deposit-service".into()))
            .credential(Some(credential))
            .server_selection_timeout(Some(Duration::from_secs(connection_timeout)))
            .build();

        let client: Client = Client::with_options(client_options)?;

        Ok(Self { client })
    }

    pub async fn get_all_direct_deposits(&self) -> Result<Vec<DirectDeposit>> {
        let tracer = global::tracer("database-tracer");
        let _span = tracer.start("get_all_direct_deposits");

        let mut cursor = self.get_collection().find(None, None).await?;
        let mut direct_deposits: Vec<DirectDeposit> = Vec::new();
        while let Some(item) = cursor.next().await {
            let document = item?;
            let direct_deposit = model_mapper(document)?;
            direct_deposits.push(direct_deposit);
        }

        Ok(direct_deposits)
    }

    pub async fn get_direct_deposit(&self, direct_deposit_id: &str) -> Result<DirectDeposit> {
        let tracer = global::tracer("database-tracer");
        let _span = tracer.start("get_deposit");

        let id = ObjectId::with_string(direct_deposit_id)?;
        let filter = doc! {
            "_id": id,
        };

        let mut cursor = self.get_collection().find(filter, None).await?;
        let result = cursor.next().await.unwrap();
        match result {
            Ok(document) => {
                let direct_deposit = model_mapper(document)?;
                Ok(direct_deposit)
            }
            Err(e) => Err(MongoQueryError(e)),
        }
    }

    pub async fn get_employee_direct_deposits(
        &self,
        employee_id: &str,
    ) -> Result<Vec<DirectDeposit>> {
        let tracer = global::tracer("database-tracer");
        let _span = tracer.start("get_employee_direct_deposits");

        let filter = doc! {
            "employee_id": employee_id,
        };

        let mut cursor = self.get_collection().find(filter, None).await?;
        let mut direct_deposits: Vec<DirectDeposit> = Vec::new();
        while let Some(item) = cursor.next().await {
            let document = item?;
            let direct_deposit = model_mapper(document)?;
            direct_deposits.push(direct_deposit);
        }

        Ok(direct_deposits)
    }

    fn get_collection(&self) -> Collection {
        self.client.database(DATABASE_NAME).collection(COLLECTION)
    }
}

fn model_mapper(document: Document) -> Result<DirectDeposit> {
    let id = document.get_object_id("_id")?;
    let employee_id = document.get_str("employee_id")?;
    let account_type = document.get_str("account_type")?;
    let account_number = document.get_str("account_number")?;
    let routing_number = document.get_str("routing_number")?;
    let prenote = document.get_bool("prenote")?;

    Ok(DirectDeposit {
        id: id.to_hex(),
        employee_id: employee_id.to_owned(),
        account_type: account_type.to_owned(),
        account_number: account_number.to_owned(),
        routing_number: routing_number.to_owned(),
        prenote,
    })
}
