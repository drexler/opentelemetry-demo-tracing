'use strict';

import { NodeTracerProvider } from '@opentelemetry/node';
import { BatchSpanProcessor } from '@opentelemetry/tracing';
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
  
provider.register();

const exporter = new CollectorTraceExporter({serviceName: SERVICE_NAME});
provider.addSpanProcessor(new BatchSpanProcessor(exporter));


console.log('Tracing Initialized');


