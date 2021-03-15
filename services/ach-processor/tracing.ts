import { NodeTracerProvider } from '@opentelemetry/node';
import { BatchSpanProcessor } from '@opentelemetry/tracing';
import { CollectorTraceExporter } from '@opentelemetry/exporter-collector';
import { registerInstrumentations } from '@opentelemetry/instrumentation'
import { HttpInstrumentation } from '@opentelemetry/instrumentation-http'
import { GrpcInstrumentation } from '@opentelemetry/instrumentation-grpc'

const SERVICE_NAME: string = 'ach-processor'

const provider = new NodeTracerProvider();
registerInstrumentations({
  tracerProvider: provider,
  instrumentations: [
    new HttpInstrumentation({}),
    new GrpcInstrumentation({}),
    {
        plugins: {
            http: { enabled: false, path: '@opentelemetry/plugin-http' },
            https: { enabled: false, path: '@opentelemetry/plugin-https' },
            '@grpc/grpc-js': { enabled: false, path: '@opentelemetry/plugin-grpc-js' },
        }
    }
  ],
});

const exporter = new CollectorTraceExporter({ 
    serviceName: SERVICE_NAME, 
    url: 'http://otel-collector:55681/v1/trace' 
});
provider.addSpanProcessor(new BatchSpanProcessor(exporter));
provider.register();

console.log('Tracing Initialized');


