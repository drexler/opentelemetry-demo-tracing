#[macro_use]
extern crate diesel;

pub mod database;
pub mod models;
pub mod schema;
pub mod tracing;
pub mod employee {
    tonic::include_proto!("employee");
}
use models::DbEmployee;
use tonic::{transport::Server, Request, Response, Status};

use employee::employee_service_server::{EmployeeService, EmployeeServiceServer};
use employee::{
    CreateEmployeeRequest, CreateEmployeeResponse, Employee, GetAllEmployeesResponse,
    GetEmployeeRequest, GetEmployeeResponse,
};

use opentelemetry::sdk::propagation::TraceContextPropagator;
use opentelemetry::{global, trace::Tracer};

use uuid::Uuid;

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

        let employees = tracer.with_span(span, |_cx| -> Vec<Employee> {
            database::get_employees()
                .into_iter()
                .map(model_mapper)
                .collect()
        });
        let result = GetAllEmployeesResponse { employees };

        Ok(Response::new(result))
    }

    async fn get_employee(
        &self,
        request: Request<GetEmployeeRequest>,
    ) -> Result<Response<GetEmployeeResponse>, Status> {
        let parent_ctx = tracing::get_parent_context(&request);
        let tracer = global::tracer("employee-service");
        let span = tracer.start_with_context("get_employee", parent_ctx);

        let employee_id = request.into_inner().employee_id;
        let employee_id = Uuid::parse_str(&employee_id).unwrap();

        let employee = tracer.with_span(span, |_cx| -> Option<Employee> {
            database::get_employee(&employee_id).map(model_mapper)
        });

        let result = GetEmployeeResponse { employee };

        Ok(Response::new(result))
    }

    async fn create_employee(
        &self,
        request: Request<CreateEmployeeRequest>,
    ) -> Result<Response<CreateEmployeeResponse>, Status> {
        let parent_ctx = tracing::get_parent_context(&request);
        let tracer = global::tracer("employee-service");
        let span = tracer.start_with_context("create_employee", parent_ctx);

        let params = request.into_inner();
        let address = params.address;
        let name = params.name;
        let ssn = params.ssn;
        let marital_status = params.marital_status;

        let employee = tracer.with_span(span, |_cx| -> Option<Employee> {
            database::create_employee(&name, &address, &ssn, marital_status)
                .ok()
                .map(model_mapper)
        });

        let result = CreateEmployeeResponse { employee };

        Ok(Response::new(result))
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

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error + Send + Sync + 'static>> {
    global::set_text_map_propagator(TraceContextPropagator::new());

    let (_tracer, _uninstall) = tracing::initialize_tracer()?;

    let address = "[::0]:50052".parse().unwrap();
    let employee_service = MyEmployeeService::default();
    println!("Server listening on {}", address);

    Server::builder()
        .add_service(EmployeeServiceServer::new(employee_service))
        .serve(address)
        .await?;
    Ok(())
}
