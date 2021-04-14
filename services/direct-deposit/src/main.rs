use std::{env, net::SocketAddr};

use opentelemetry::{global, sdk::propagation::TraceContextPropagator};
use tonic::transport::Server;

pub mod database;
pub mod error;
pub mod service;
pub mod tracing;

use service::{
    directdeposit::direct_deposit_service_server::DirectDepositServiceServer,
    MyDirectDepositService,
};

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error + Send + Sync + 'static>> {
    global::set_text_map_propagator(TraceContextPropagator::new());

    let (_tracer, _uninstall) = tracing::initialize_tracer()?;

    let service_port = env::var("SERVICE_PORT").expect("SERVICE_PORT must be set");
    let uri = format!("[::0]:{}", service_port);
    let service_address: SocketAddr = uri.as_str().parse().unwrap();
    let direct_deposit_service = MyDirectDepositService::initialize().await?;
    println!("Server listening on {}", service_address);

    Server::builder()
        .add_service(DirectDepositServiceServer::new(direct_deposit_service))
        .serve(service_address)
        .await?;
    Ok(())
}
