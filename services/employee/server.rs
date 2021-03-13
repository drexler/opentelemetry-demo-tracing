use employee::employee_service_server::{EmployeeService, EmployeeServiceServer};
use employee::{Employee, GetAllEmployeesResponse, GetEmployeeRequest, GetEmployeeResponse};
use tonic::{transport::Server, Request, Response, Status};

pub mod employee {
    tonic::include_proto!("otel.demo.proto.employee.v1");
}

// defining a struct for our service
#[derive(Default)]
pub struct MyEmployeeService {}

#[tonic::async_trait]
impl EmployeeService for MyEmployeeService {
    async fn get_all_employees(&self, _request: Request<()>) -> Result<Response<GetAllEmployeesResponse>, Status> {
        let employee = Employee {
            id: "Test Andrew".into(),
            name: "Name".into(),
            address: "Somewhere".into(),
            ssn: "123-45-6789".into(),
            marital_status: "M".into(),
        };

        let result = GetAllEmployeesResponse {
            employees: vec![employee],
        };

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
            marital_status: "M".into(),
        };

        let result = GetEmployeeResponse { employee: Some(employee) };

        Ok(Response::new(result))
    }
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let address = "[::1]:50051".parse().unwrap();

    let employee_service = MyEmployeeService::default();
    println!("Server listening on {}", address);
    // adding our service to our server.
    Server::builder()
        .add_service(EmployeeServiceServer::new(employee_service))
        .serve(address)
        .await?;
    Ok(())
}
