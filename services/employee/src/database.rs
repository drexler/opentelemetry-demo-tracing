use diesel::prelude::*;
use dotenv::dotenv;
use std::env;
use uuid::Uuid;

use crate::models::{DbEmployee, NewDbEmployee};
use crate::schema::employee;
use crate::schema::employee::dsl::*;

use opentelemetry::{global, trace::Tracer};

fn create_connection() -> PgConnection {
    let tracer = global::tracer("database-tracer");
    let _span = tracer.span_builder("create_connection").start(&tracer);

    dotenv().ok();
    let database_url = env::var("DATABASE_URL").expect("DATABASE_URL must be set");
    PgConnection::establish(&database_url)
        .unwrap_or_else(|_| panic!("Error connecting to {}", database_url))
}

pub fn create_employee(
    emp_name: &str,
    emp_address: &str,
    emp_ssn: &str,
    emp_marital_status: bool,
) -> QueryResult<DbEmployee> {
    let tracer = global::tracer("database-tracer");
    let span = tracer.span_builder("create_employee").start(&tracer);

    let new_employee = NewDbEmployee {
        name: emp_name,
        address: emp_address,
        ssn: emp_ssn,
        marital_status: emp_marital_status,
    };

    let connection = tracer.with_span(span, |_cx| -> PgConnection { create_connection() });
    diesel::insert_into(employee::table)
        .values(&new_employee)
        .get_result(&connection)
}

pub fn get_employees() -> Vec<DbEmployee> {
    let tracer = global::tracer("database-tracer");
    let span = tracer.span_builder("get_employees").start(&tracer);

    let connection = tracer.with_span(span, |_cx| -> PgConnection { create_connection() });
    employee
        .load::<DbEmployee>(&connection)
        .expect("Error loading employees")
}

pub fn get_employee(employee_id: &Uuid) -> Option<DbEmployee> {
    let tracer = global::tracer("database-tracer");
    let span = tracer.span_builder("get_employee").start(&tracer);

    let connection = tracer.with_span(span, |_cx| -> PgConnection { create_connection() });
    let result = employee.find(employee_id).first(&connection);
    result.ok()
}
