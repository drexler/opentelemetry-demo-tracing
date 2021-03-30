import express, { NextFunction, Request, Response } from "express";
import { employeeService } from '../remote-services';
import * as api from '@opentelemetry/api';
import createError from 'http-errors';
import { convertGrpcToHttpErrorCode } from "../utils";


export const employeesRouter = express.Router();

const tracer = api.trace.getTracer('payroll-tracer')

/**
 * Generates information for all employeees
 */
employeesRouter.get('/', (_request: Request, response: Response, next: NextFunction) => {
    const span = tracer.startSpan('payroll: getAllEmployees');

    api.context.with(api.setSpan(api.context.active(), span), () => {
        const traceId =  span.context().traceId;
        employeeService.getAllEmployees({}, (err: any, result: any) => {
            span.end();
            if (err) {
                next(createError(...[convertGrpcToHttpErrorCode(err)], {
                    developerMessage: err.message, 
                    traceId
                }));
            }
            response.send(result);

        });
    });
});


/**
 * Gets an employee's data
 */
 employeesRouter.get('/:employee_id', (request: Request, response: Response, next: NextFunction) => {
    const span = tracer.startSpan('payroll: getEmployee');

    let employeeeId = request.params.employee_id;
    
    api.context.with(api.setSpan(api.context.active(), span), () => {
        const traceId =  span.context().traceId;
        employeeService.getEmployee({employee_id: employeeeId}, (err: any, result: any) => {
            span.end();
            if (err) {
                next(createError(...[convertGrpcToHttpErrorCode(err)], {
                    developerMessage: err.message, 
                    traceId
                }));
            }
            response.send(result); 
        });
    });
});


/**
 * Creates an employee
 */
 employeesRouter.post('/', (request: Request, response: Response, next: NextFunction) => {
    const span = tracer.startSpan('payroll: createEmployee');

    const { name, address, ssn, marital_status} = request.body;

    api.context.with(api.setSpan(api.context.active(), span), () => {
        const traceId =  span.context().traceId;
        employeeService.createEmployee({name, address, ssn, marital_status}, (err: any, result: any) => {
            span.end();
            if (err) {
                next(createError(...[convertGrpcToHttpErrorCode(err)], {
                    developerMessage: err.message, 
                    traceId
                }));
            }
            response.send(result);  
        });
    });
});
