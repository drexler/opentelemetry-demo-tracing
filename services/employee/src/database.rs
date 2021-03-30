use diesel::prelude::*;
use dotenv::dotenv;
use std::env;
use uuid::Uuid;

use crate::models::{DbEmployee, NewDbEmployee};
use crate::schema::employee;
use crate::schema::employee::dsl::*;

use opentelemetry::{global, trace::Tracer};

fn create_connection() -> ConnectionResult<PgConnection> {
    let tracer = global::tracer("database-tracer");
    let _span = tracer.span_builder("create_connection").start(&tracer);

    dotenv().ok();
    let database_url = env::var("DATABASE_URL").expect("DATABASE_URL must be set");
    PgConnection::establish(&database_url)
}

pub fn create_employee(
    new_employee: &NewDbEmployee,
) -> Result<DbEmployee, Box<dyn std::error::Error + 'static>> {
    let tracer = global::tracer("database-tracer");
    let span = tracer.span_builder("create_employee").start(&tracer);

    let connection = tracer.with_span(span, |_cx| -> ConnectionResult<PgConnection> {
        create_connection()
    });
    match connection {
        Ok(conn) => {
            let created_employee = diesel::insert_into(employee::table)
                .values(new_employee)
                .get_result(&conn);

            match created_employee {
                Ok(emp) => Ok(emp),
                Err(e) => Err(Box::new(e)),
            }
        }
        Err(e) => Err(Box::new(e)),
    }
}

pub fn get_employees() -> Result<Vec<DbEmployee>, Box<dyn std::error::Error + 'static>> {
    let tracer = global::tracer("database-tracer");
    let span = tracer.span_builder("get_employees").start(&tracer);

    let connection = tracer.with_span(span, |_cx| -> ConnectionResult<PgConnection> {
        create_connection()
    });
    match connection {
        Ok(conn) => match employee.load::<DbEmployee>(&conn) {
            Ok(employees) => Ok(employees),
            Err(e) => Err(Box::new(e)),
        },
        Err(e) => Err(Box::new(e)),
    }
}

pub fn get_employee(
    employee_id: &Uuid,
) -> Result<DbEmployee, Box<dyn std::error::Error + 'static>> {
    let tracer = global::tracer("database-tracer");
    let span = tracer.span_builder("get_employee").start(&tracer);

    let connection = tracer.with_span(span, |_cx| -> ConnectionResult<PgConnection> {
        create_connection()
    });
    match connection {
        Ok(conn) => match employee.find(employee_id).first(&conn) {
            Ok(e) => Ok(e),
            Err(e) => Err(Box::new(e)),
        },
        Err(e) => Err(Box::new(e)),
    }
}
