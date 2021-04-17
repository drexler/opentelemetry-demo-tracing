use std::vec;

use tonic::{Request, Response, Status};

use opentelemetry::{
    global,
    trace::{Span, Tracer},
};
use uuid::Uuid;
pub mod employee {
    tonic::include_proto!("employee");
}
use employee::employee_service_server::EmployeeService;
use employee::{
    CreateEmployeeRequest, CreateEmployeeResponse, Employee, GetAllEmployeesResponse,
    GetEmployeeRequest, GetEmployeeResponse,
};

use crate::database::EmployeeDb;
use crate::error;
use crate::error::Error::*;

use crate::models::{DbEmployee, NewDbEmployee};
use crate::tracing;

//Note: Diesel::PgConnection doesn't implement the Sync marker trait as these connections by design are meant
// to run on a single thread. This means we can't use it as a shared reference within MyEmployeeService since the
// EmployeeService trait requires it. That is:
// pub trait EmployeeService: Send + Sync + 'static

#[derive(Default)]
pub struct MyEmployeeService {}

#[tonic::async_trait]
impl EmployeeService for MyEmployeeService {
    async fn get_all_employees(
        &self,
        request: Request<()>,
    ) -> Result<Response<GetAllEmployeesResponse>, Status> {
        let parent_ctx = tracing::get_parent_context(&request);
        let tracer = global::tracer("employee-service");
        let span = tracer.start_with_context("get_all_employees", parent_ctx);

        let db_result = tracer.with_span(span, |_cx| -> Result<Vec<Employee>, error::Error> {
            let db_client = EmployeeDb::initialize()?;
            db_client
                .get_employees()
                .map(|employees| employees.into_iter().map(model_mapper).collect())
        });

        match db_result {
            Ok(employees) => Ok(Response::new(GetAllEmployeesResponse { employees })),
            Err(_) => Err(Status::unknown("unable to load all employees")),
        }
    }

    async fn get_employee(
        &self,
        request: Request<GetEmployeeRequest>,
    ) -> Result<Response<GetEmployeeResponse>, Status> {
        let parent_ctx = tracing::get_parent_context(&request);
        let tracer = global::tracer("employee-service");
        let span = tracer.start_with_context("get_employee", parent_ctx);

        let request_employee_id = request.into_inner().employee_id;
        let employee_id = Uuid::parse_str(&request_employee_id);
        if employee_id.is_err() {
            let error_message = format!(
                "Invalid employee id: {}. Id must be a UUID",
                request_employee_id
            );
            span.add_event(error_message.clone(), vec![]);
            return Err(Status::invalid_argument(error_message));
        }

        let employee_id = employee_id.unwrap();

        let db_result = tracer.with_span(span, |_cx| -> Result<Employee, error::Error> {
            let db_client = EmployeeDb::initialize()?;
            db_client.get_employee(&employee_id).map(model_mapper)
        });

        match db_result {
            Ok(employee) => {
                let result = GetEmployeeResponse {
                    employee: Some(employee),
                };
                Ok(Response::new(result))
            }
            Err(e) => match e {
                PostgresConnectionError(_) => Err(Status::internal("")),
                _ => {
                    let message = format!("Employee with id: {} not found", employee_id);
                    Err(Status::unknown(message))
                }
            },
        }
    }

    async fn create_employee(
        &self,
        request: Request<CreateEmployeeRequest>,
    ) -> Result<Response<CreateEmployeeResponse>, Status> {
        let parent_ctx = tracing::get_parent_context(&request);
        let tracer = global::tracer("employee-service");
        let span = tracer.start_with_context("create_employee", parent_ctx);

        let params = request.into_inner();
        let new_employee = NewDbEmployee {
            address: &params.address,
            name: &params.name,
            ssn: &params.ssn,
            marital_status: params.marital_status,
        };

        let db_result = tracer.with_span(span, |_cx| -> Result<Employee, error::Error> {
            let db_client = EmployeeDb::initialize()?;
            db_client.create_employee(&new_employee).map(model_mapper)
        });

        match db_result {
            Ok(employee) => {
                let result = CreateEmployeeResponse {
                    employee: Some(employee),
                };
                Ok(Response::new(result))
            }
            Err(e) => match e {
                PostgresConnectionError(_) => Err(Status::internal("")),
                _ => Err(Status::unknown("Unable to create employee")),
            },
        }
    }
}

fn model_mapper(db_employee: DbEmployee) -> Employee {
    Employee {
        id: db_employee.id.to_string(),
        name: db_employee.name,
        address: db_employee.address,
        ssn: db_employee.ssn,
        marital_status: db_employee.marital_status,
    }
}
