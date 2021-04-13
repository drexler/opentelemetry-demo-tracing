import { NodeTracerProvider } from '@opentelemetry/node';
import { BatchSpanProcessor } from '@opentelemetry/tracing';
import { CollectorTraceExporter } from '@opentelemetry/exporter-collector-grpc';
import { registerInstrumentations } from '@opentelemetry/instrumentation'
import { HttpInstrumentation } from '@opentelemetry/instrumentation-http'
import { GrpcInstrumentation } from '@opentelemetry/instrumentation-grpc'
import { context, trace } from '@opentelemetry/api';
import { AsyncHooksContextManager } from '@opentelemetry/context-async-hooks';

const SERVICE_NAME: string = 'payroll-service';
const OTEL_COLLECTOR_URI = process.env.OTEL_COLLECTOR_URI

const contextManager = new AsyncHooksContextManager();
contextManager.enable();

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
    url: OTEL_COLLECTOR_URI
});

provider.addSpanProcessor(new BatchSpanProcessor(exporter));
provider.register({ contextManager });

context.setGlobalContextManager(contextManager);
trace.setGlobalTracerProvider(provider);


console.log('Tracing Initialized');

