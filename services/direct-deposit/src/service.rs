use tonic::{Request, Response, Status};
pub mod directdeposit {
    tonic::include_proto!("directdeposit");
}

use directdeposit::direct_deposit_service_server::DirectDepositService;
use directdeposit::{
    GetAllDirectDepositsResponse, GetDirectDepositRequest, GetDirectDepositResponse,
    GetEmployeeDirectDepositsRequest, GetEmployeeDirectDepositsResponse,
};

use crate::database::DirectDepositDb;
use crate::error;

#[derive(Clone, Debug)]
pub struct MyDirectDepositService {
    db_client: DirectDepositDb,
}

impl MyDirectDepositService {
    pub async fn initialize() -> Result<Self, error::Error> {
        Ok(Self {
            db_client: DirectDepositDb::initialize().await?,
        })
    }
}

#[tonic::async_trait]
impl DirectDepositService for MyDirectDepositService {
    async fn get_all_direct_deposits(
        &self,
        _request: Request<()>,
    ) -> Result<Response<GetAllDirectDepositsResponse>, Status> {
        match self.db_client.get_all_direct_deposits().await {
            Ok(direct_deposits) => {
                let result = GetAllDirectDepositsResponse { direct_deposits };
                Ok(Response::new(result))
            }
            Err(_) => Err(Status::unknown(
                "unable to load direct deposits".to_string(),
            )),
        }
    }

    async fn get_direct_deposit(
        &self,
        request: Request<GetDirectDepositRequest>,
    ) -> Result<Response<GetDirectDepositResponse>, Status> {
        let direct_deposit_id = request.into_inner().direct_deposit_id;
        let direct_deposit = self.db_client.get_direct_deposit(&direct_deposit_id).await;
        let direct_deposit = direct_deposit.ok();

        match direct_deposit {
            Some(_) => {
                let result = GetDirectDepositResponse { direct_deposit };
                Ok(Response::new(result))
            }
            None => Err(Status::not_found(format!(
                "direct deposit with id: {id} not found",
                id = direct_deposit_id
            ))),
        }
    }

    async fn get_employee_direct_deposits(
        &self,
        request: Request<GetEmployeeDirectDepositsRequest>,
    ) -> Result<Response<GetEmployeeDirectDepositsResponse>, Status> {
        let employee_id = request.into_inner().employee_id;

        match self
            .db_client
            .get_employee_direct_deposits(&employee_id)
            .await
        {
            Ok(direct_deposits) => {
                let result = GetEmployeeDirectDepositsResponse { direct_deposits };
                Ok(Response::new(result))
            }
            Err(_) => Err(Status::unknown(
                "unable to load employee's direct deposits".to_string(),
            )),
        }
    }
}
