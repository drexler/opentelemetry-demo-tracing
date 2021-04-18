import express, { NextFunction, Request, Response } from "express";
import { employeeService, paycheckService, directDepositService } from '../services';
import * as api from '@opentelemetry/api';
import createError from 'http-errors';
import { convertGrpcToHttpErrorCode, getGrpcErrorMessage, formatResponse } from "../utils";
import { HttpError} from '../models';


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
            const formattedResponse = formatResponse(results.employees);
            const httpStatusCode = formattedResponse ? 200 : 204;
            response.status(httpStatusCode).send(formattedResponse);
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
            // TODO: use a validator library for this...
            if (!name || !address || !ssn) {
               next(createError(...[new HttpError(400, "Invalid input parameters")], {
                   traceId,
               }));
            } else {
                const result = await employeeService.createEmployee({
                    name, 
                    address, 
                    ssn, 
                    marital_status
                });
                response.send(formatResponse(result.employee));
            }
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
 * Gets an employee's paychecks
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

/**
 * Gets an employee's direct deposits
 */
employeesRouter.get('/:employee_id/direct-deposits', (request: Request, response: Response, next: NextFunction) => {
    const span = tracer.startSpan('payroll: getEmployeeDirectDeposits');

    const employeeId = request.params.employee_id;
    api.context.with(api.setSpan(api.context.active(), span), async() => {
        const traceId =  span.context().traceId;
        try {
            const results = await directDepositService.getEmployeeDirectDeposits({employee_id: employeeId});
            const formattedResponse = formatResponse(results.direct_deposits);
            const httpStatusCode = formattedResponse ? 200 : 204;
            response.status(httpStatusCode).send(formattedResponse);
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



