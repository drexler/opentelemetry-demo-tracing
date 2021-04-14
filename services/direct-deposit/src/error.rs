use mongodb::bson;
use thiserror::Error;

#[derive(Error, Debug)]
pub enum Error {
    #[error("mongodb error: {0}")]
    MongoError(#[from] mongodb::error::Error),
    #[error("error with mongodb query: {0}")]
    MongoQueryError(mongodb::error::Error),
    #[error("error accessing field in document: {0}")]
    MongoDataError(#[from] bson::document::ValueAccessError),
    #[error("Invalid id type: {0}")]
    InvalidIdTypeError(#[from] bson::oid::Error),
}
