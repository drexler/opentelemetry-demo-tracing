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

// pub fn create_employee(conn: &PgConnection, name: &str, address: &str) -> DbEmployee {
//     let new_employee = NewDbEmployee { name, address };

//     diesel::insert_into(employee::table)
//         .values(&new_employee)
//         .get_result(conn)
//         .expect("Error saving new employee")
// }

pub fn get_employees(conn: &PgConnection) -> Vec<DbEmployee> {
    employee
        .load::<DbEmployee>(conn)
        .expect("Error loading employees")
}

pub fn get_employee(conn: &PgConnection, employee_id: &Uuid) -> Option<DbEmployee> {
    let result = employee.find(employee_id).first(conn);
    result.ok()
}
