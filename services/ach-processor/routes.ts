import express, { Request, Response } from "express";
import { employeeService } from './remote-services/services';

import * as api from '@opentelemetry/api';

export const employeesRouter = express.Router();

const tracer = api.trace.getTracer('ach-processor-tracer')

/**
 * Generates information for all employeees
 */
employeesRouter.get('/', (_request: Request, response: Response) => {
    console.log('calling into employee service'); 
    const span = tracer.startSpan('ach-processor: getAllEmployees');
    api.context.with(api.setSpan(api.context.active(), span), () => {
        employeeService.getAllEmployees({}, (err: any, result: any) => {
            span.end();
            if (err) {
                throw err;
            }
            response.send(result);
        });
    });

    console.log('Sleeping 5 seconds before shutdown to ensure all records are flushed.');
    setTimeout(() => { console.log('Completed.'); }, 5000);
});
