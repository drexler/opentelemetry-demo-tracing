use diesel::prelude::*;
use std::{env, time::SystemTime};
use uuid::Uuid;

use crate::models::{DbEmployee, NewDbEmployee};
use crate::schema::employee;
use crate::schema::employee::dsl::*;

use opentelemetry::{
    global,
    trace::{Span, StatusCode, Tracer},
    KeyValue,
};

fn create_connection() -> ConnectionResult<PgConnection> {
    let tracer = global::tracer("database-tracer");
    let span = tracer.span_builder("create_connection").start(&tracer);

    let database_url = env::var("DATABASE_URL").expect("DATABASE_URL must be set");

    let connection = PgConnection::establish(&database_url);

    match connection {
        Ok(conn) => Ok(conn),
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

            Err(e)
        }
    }
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
