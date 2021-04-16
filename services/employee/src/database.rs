use std::{env, time::SystemTime};

use diesel::prelude::*;
use opentelemetry::{
    global,
    trace::{Span, StatusCode, Tracer},
    KeyValue,
};
use uuid::Uuid;

use crate::error;
use crate::error::Error::*;
use crate::models::{DbEmployee, NewDbEmployee};
use crate::schema::employee;
use crate::schema::employee::dsl::*;

type Result<T> = std::result::Result<T, error::Error>;

pub struct EmployeeDb {
    connection: PgConnection,
}

impl EmployeeDb {
    pub fn initialize() -> Result<Self> {
        let tracer = global::tracer("database-tracer");
        let span = tracer.span_builder("create_connection").start(&tracer);
        let database_url = env::var("DATABASE_URL").expect("DATABASE_URL must be set");

        let result = PgConnection::establish(&database_url);

        match result {
            Ok(connection) => Ok(Self { connection }),
            Err(e) => {
                let error_message = format!("connection problem: {}", e.to_string());
                span.add_event_with_timestamp(
                    error_message,
                    SystemTime::now(),
                    vec![
                        KeyValue::new("db.system", "postgres"),
                        KeyValue::new("db.connection.string", database_url),
                    ],
                );
                span.set_status(StatusCode::Error, "connection error".into());

                Err(PostgresConnectionError(e))
            }
        }
    }

    pub fn create_employee(&self, new_employee: &NewDbEmployee) -> Result<DbEmployee> {
        let tracer = global::tracer("database-tracer");
        let _span = tracer.span_builder("create_employee").start(&tracer);

        let created_employee = diesel::insert_into(employee::table)
            .values(new_employee)
            .get_result(&self.connection)?;

        Ok(created_employee)
    }

    pub fn get_employees(&self) -> Result<Vec<DbEmployee>> {
        let tracer = global::tracer("database-tracer");
        let _span = tracer.span_builder("get_employees").start(&tracer);

        let employees = employee.load::<DbEmployee>(&self.connection)?;
        Ok(employees)
    }

    pub fn get_employee(&self, employee_id: &Uuid) -> Result<DbEmployee> {
        let tracer = global::tracer("database-tracer");
        let _span = tracer.span_builder("get_employee").start(&tracer);

        let sought_employee = employee.find(employee_id).first(&self.connection)?;
        Ok(sought_employee)
    }
}
