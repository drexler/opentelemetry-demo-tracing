#[macro_use]
extern crate diesel;

pub mod database;
pub mod models;
pub mod schema;
pub mod employee {
    tonic::include_proto!("employee");
}

use models::DbEmployee;
use tonic::{transport::Server, Request, Response, Status};

use employee::employee_service_server::{EmployeeService, EmployeeServiceServer};
use employee::{Employee, GetAllEmployeesResponse, GetEmployeeRequest, GetEmployeeResponse};

use database::create_connection;
use opentelemetry::global;
use opentelemetry::sdk::propagation::TraceContextPropagator;
use opentelemetry::sdk::{trace, Resource};
use opentelemetry::trace::TraceError;
use opentelemetry::{
    propagation::Extractor,
    trace::{Span, Tracer},
    KeyValue,
};

struct MetadataMap<'a>(&'a tonic::metadata::MetadataMap);

impl<'a> Extractor for MetadataMap<'a> {
    /// Get a value for a key from the MetadataMap.  If the value can't be converted to &str, returns None
    fn get(&self, key: &str) -> Option<&str> {
        self.0.get(key).and_then(|metadata| metadata.to_str().ok())
    }

    /// Collect all the keys from the MetadataMap.
    fn keys(&self) -> Vec<&str> {
        self.0
            .keys()
            .map(|key| match key {
                tonic::metadata::KeyRef::Ascii(v) => v.as_str(),
                tonic::metadata::KeyRef::Binary(v) => v.as_str(),
            })
            .collect::<Vec<_>>()
    }
}

#[derive(Default)]
pub struct MyEmployeeService {}

#[tonic::async_trait]
impl EmployeeService for MyEmployeeService {
    async fn get_all_employees(
        &self,
        request: Request<()>,
    ) -> Result<Response<GetAllEmployeesResponse>, Status> {
        let parent_ctx =
            global::get_text_map_propagator(|prop| prop.extract(&MetadataMap(request.metadata())));
        let span = global::tracer("employee-service-tracer")
            .start_with_context("get_all_employees", parent_ctx);
        span.set_attribute(KeyValue::new("request", format!("{:?}", request)));

        let connection = database::create_connection();
        let employees: Vec<Employee> = database::get_employees(&connection)
            .into_iter()
            .map(|db_emp: DbEmployee| Employee {
                id: db_emp.id.to_string(),
                name: db_emp.name,
                address: db_emp.address,
                ssn: db_emp.ssn,
                marital_status: db_emp.marital_status,
            })
            .collect();

        let result = GetAllEmployeesResponse { employees };

        Ok(Response::new(result))
    }

    async fn get_employee(
        &self,
        request: Request<GetEmployeeRequest>,
    ) -> Result<Response<GetEmployeeResponse>, Status> {
        let employee = Employee {
            id: "Test 2".into(),
            name: "Andrew".into(),
            address: "Somewhere".into(),
            ssn: "123-45-6789".into(),
            marital_status: true,
        };

        let _connection = create_connection();

        let result = GetEmployeeResponse {
            employee: Some(employee),
        };

        Ok(Response::new(result))
    }
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error + Send + Sync + 'static>> {
    global::set_text_map_propagator(TraceContextPropagator::new());
    let (_tracer, _uninstall) = opentelemetry_otlp::new_pipeline()
        .with_endpoint("http://otel-collector:4317") //scheme needed
        .with_trace_config(
            trace::config().with_resource(Resource::new(vec![KeyValue::new(
                "service.name",
                "employee-service",
            )])),
        )
        .install()?;

    let address = "[::0]:50052".parse().unwrap();
    let employee_service = MyEmployeeService::default();
    println!("Server listening on {}", address);

    Server::builder()
        .add_service(EmployeeServiceServer::new(employee_service))
        .serve(address)
        .await?;
    Ok(())
}
