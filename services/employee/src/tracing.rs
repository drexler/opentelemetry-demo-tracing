use opentelemetry::sdk::{trace, Resource};
use opentelemetry::trace::TraceError;
use opentelemetry::{global, propagation::Extractor, Context, KeyValue};
use opentelemetry_otlp::Uninstall;
use tonic::Request;

pub struct MetadataMap<'a>(pub &'a tonic::metadata::MetadataMap);

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

pub fn get_parent_context<T>(request: &Request<T>) -> Context {
    global::get_text_map_propagator(|prop| prop.extract(&MetadataMap(request.metadata())))
}

pub fn initialize_tracer() -> Result<(trace::Tracer, Uninstall), TraceError> {
    opentelemetry_otlp::new_pipeline()
        .with_endpoint("http://otel-collector:4317") //scheme needed
        .with_trace_config(
            trace::config().with_resource(Resource::new(vec![KeyValue::new(
                "service.name",
                "employee-service",
            )])),
        )
        .install()
}
