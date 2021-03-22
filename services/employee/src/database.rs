use diesel::prelude::*;
use dotenv::dotenv;
use std::env;
use uuid::Uuid;

use crate::models::{DbEmployee, NewDbEmployee};
use crate::schema::employee;
use crate::schema::employee::dsl::*;

pub fn create_connection() -> PgConnection {
    dotenv().ok();

    let database_url = env::var("DATABASE_URL").expect("DATABASE_URL must be set");
    PgConnection::establish(&database_url)
        .unwrap_or_else(|_| panic!("Error connecting to {}", database_url))
}

pub fn create_employee(
    conn: &PgConnection,
    emp_name: &str,
    emp_address: &str,
    emp_ssn: &str,
    emp_marital_status: bool
) -> QueryResult<DbEmployee> {
    let new_employee = NewDbEmployee {
        name: emp_name,
        address: emp_address,
        ssn: emp_ssn, 
        marital_status:emp_marital_status
    };

    diesel::insert_into(employee::table)
        .values(&new_employee)
        .get_result(conn)
}

pub fn get_employees(conn: &PgConnection) -> Vec<DbEmployee> {
    employee
        .load::<DbEmployee>(conn)
        .expect("Error loading employees")
}

pub fn get_employee(conn: &PgConnection, employee_id: &Uuid) -> Option<DbEmployee> {
    let result = employee.find(employee_id).first(conn);
    result.ok()
}
