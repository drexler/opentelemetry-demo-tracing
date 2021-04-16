use diesel::{result, ConnectionError};
use thiserror::Error;

#[derive(Error, Debug)]
pub enum Error {
    #[error("error connecting to database")]
    PostgresConnectionError(ConnectionError),
    #[error("error with postgres query: {0}")]
    PostgresQueryError(#[from] result::Error),
}
