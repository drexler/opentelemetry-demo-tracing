import express, { NextFunction, Request, Response } from "express";
import { employeeService, paycheckService } from '../services';
import * as api from '@opentelemetry/api';
import createError from 'http-errors';
import { convertGrpcToHttpErrorCode, getGrpcErrorMessage, formatResponse } from "../utils";


export const employeesRouter = express.Router();

const tracer = api.trace.getTracer('payroll-tracer')

/**
 * Retrieves information for all employeees
 */
employeesRouter.get('/', (_request: Request, response: Response, next: NextFunction) => {
    const span = tracer.startSpan('payroll: getAllEmployees');

    api.context.with(api.setSpan(api.context.active(), span), async () => {
        const traceId =  span.context().traceId;
        try {
            const results = await employeeService.getAllEmployees({});
            response.send(formatResponse(results.employees));
        } catch (err) {
            next(createError(...[convertGrpcToHttpErrorCode(err)], {
                developerMessage: getGrpcErrorMessage(err.message), 
                traceId
            }));
        } finally {
            span.end();
        }
    });
});


/**
 * Gets an employee's data
 */
 employeesRouter.get('/:employee_id', (request: Request, response: Response, next: NextFunction) => {
    const span = tracer.startSpan('payroll: getEmployee');

    const employeeId = request.params.employee_id;
    api.context.with(api.setSpan(api.context.active(), span), async() => {
        const traceId =  span.context().traceId;
        try {
            const results = await employeeService.getEmployee({employee_id: employeeId});
            response.send(formatResponse(results.employee));
        } catch (err) {
            next(createError(...[convertGrpcToHttpErrorCode(err)], {
                developerMessage: getGrpcErrorMessage(err.message), 
                traceId
            }));
        } finally {
            span.end();
        }
    });
});


/**
 * Creates an employee
 */
 employeesRouter.post('/', (request: Request, response: Response, next: NextFunction) => {
    const span = tracer.startSpan('payroll: createEmployee');

    const { name, address, ssn, marital_status} = request.body;

    api.context.with(api.setSpan(api.context.active(), span), async () => {
        const traceId =  span.context().traceId;
        try {
            const result = await employeeService.createEmployee({
                name, 
                address, 
                ssn, 
                marital_status
            });
            response.send(formatResponse(result.employee));
        } catch (err) {
            next(createError(...[convertGrpcToHttpErrorCode(err)], {
                developerMessage: getGrpcErrorMessage(err.message), 
                traceId
            }));
        } finally {
            span.end();
        }
    });
});

/**
 * Gets an employee's data
 */
 employeesRouter.get('/:employee_id/paychecks', (request: Request, response: Response, next: NextFunction) => {
    const span = tracer.startSpan('payroll: getEmployeePaychecks');

    const employeeId = request.params.employee_id;
    api.context.with(api.setSpan(api.context.active(), span), async() => {
        const traceId =  span.context().traceId;
        try {
            const results = await paycheckService.getEmployeePaychecks({employee_id: employeeId});
            response.send(formatResponse(results.paychecks));
        } catch (err) {
            next(createError(...[convertGrpcToHttpErrorCode(err)], {
                developerMessage: getGrpcErrorMessage(err.message), 
                traceId
            }));
        } finally {
            span.end();
        }
    });
});
