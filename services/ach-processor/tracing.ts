import { NodeTracerProvider } from '@opentelemetry/node';
import { SimpleSpanProcessor, BatchSpanProcessor } from '@opentelemetry/tracing';
import { CollectorTraceExporter } from '@opentelemetry/exporter-collector';
import { registerInstrumentations } from '@opentelemetry/instrumentation'

const SERVICE_NAME: string = 'ach-processor'


const provider = new NodeTracerProvider();
registerInstrumentations({
  instrumentations: [
    {
      plugins: {
        https: {
          enabled: true, 
          path: '@opentelemetry/plugin-https'
        }, 
        http: {
          enabled: true,
          path: '@opentelemetry/plugin-http',
        },
        express: {
            enabled: true,
            path: '@opentelemetry/plugin-express'
        },
        '@grpc/grpc-js': {
            enabled: false,  //TODO: known issue: https://github.com/open-telemetry/opentelemetry-js/issues/1705
            path: '@opentelemetry/plugin-grpc-js',
          }
      }
    }
  ],
  tracerProvider: provider,
});
  
const exporter = new CollectorTraceExporter({ serviceName: SERVICE_NAME, url: 'http://otel-collector:55681/v1/trace' });
provider.addSpanProcessor(new SimpleSpanProcessor(exporter));

provider.register();

console.log('Tracing Initialized');


