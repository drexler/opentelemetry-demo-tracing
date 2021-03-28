import express, { Request, Response } from "express";
import { employeeService } from './remote-services/services';

import * as api from '@opentelemetry/api';

export const employeesRouter = express.Router();

const tracer = api.trace.getTracer('payroll-tracer')

/**
 * Generates information for all employeees
 */
employeesRouter.get('/', (_request: Request, response: Response) => {
    const span = tracer.startSpan('payroll: getAllEmployees');
    api.context.with(api.setSpan(api.context.active(), span), () => {
        employeeService.getAllEmployees({}, (err: any, result: any) => {
            span.end();
            if (err) {
                response.send({error: err.message});
            }
            response.send(result);
        });
    });

    console.log('Sleeping 5 seconds before shutdown to ensure all records are flushed.');
    setTimeout(() => { console.log('Completed.'); }, 5000);
});


/**
 * Gets an employee's data
 */
 employeesRouter.get('/:employee_id', (request: Request, response: Response) => {
    const span = tracer.startSpan('payroll: getEmployee');
    let employeeeId = request.params.employee_id;
    api.context.with(api.setSpan(api.context.active(), span), () => {
        employeeService.getEmployee({employee_id: employeeeId}, (err: any, result: any) => {
            span.end();
            if (err) {
                response.send({error: err.message});
            }
            response.send(result);
        });
    });

    console.log('Sleeping 5 seconds before shutdown to ensure all records are flushed.');
    setTimeout(() => { console.log('Completed.'); }, 5000);
});


/**
 * Creates an employee
 */
 employeesRouter.post('/', (request: Request, response: Response) => {
    const span = tracer.startSpan('payroll: createEmployee');

    const { name, address, ssn, marital_status} = request.body;

    api.context.with(api.setSpan(api.context.active(), span), () => {
        employeeService.createEmployee({name, address, ssn, marital_status}, (err: any, result: any) => {
            span.end();
            if (err) {
                response.send({error: err.message});
            }
            response.send(result);
        });
    });

    console.log('Sleeping 5 seconds before shutdown to ensure all records are flushed.');
    setTimeout(() => { console.log('Completed.'); }, 5000);
});
