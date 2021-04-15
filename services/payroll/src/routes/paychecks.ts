import express, { NextFunction, Request, Response } from "express";
import { paycheckService } from '../services';
import * as api from '@opentelemetry/api';
import createError from 'http-errors';
import { convertGrpcToHttpErrorCode, getGrpcErrorMessage, formatResponse } from "../utils";

export const paychecksRouter = express.Router();

const tracer = api.trace.getTracer('payroll-tracer')

/**
 * Gets information for all paychecks
 */
 paychecksRouter.get('/', (_request: Request, response: Response, next: NextFunction) => {
    const span = tracer.startSpan('payroll: getAllPaychecks');
    api.context.with(api.setSpan(api.context.active(), span), async () => {
        const traceId =  span.context().traceId;
        try {
            const results = await paycheckService.getAllPaychecks({});
            const formattedResponse = formatResponse(results.paychecks);
            const httpStatusCode = formattedResponse ? 200 : 204;
            response.status(httpStatusCode).send(formattedResponse);
        } catch(err) {
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
 * Get a paycheck
 */
 paychecksRouter.get('/:paycheck_id', (request: Request, response: Response, next: NextFunction) => {
    const span = tracer.startSpan('payroll: getPaycheck');
    const paycheckId = request.params.paycheck_id;

    api.context.with(api.setSpan(api.context.active(), span), async () => {
        const traceId =  span.context().traceId;
        try {
            const results = await paycheckService.getPaycheck({paycheck_id: paycheckId});
            response.send(formatResponse(results.paycheck));
        } catch(err) {
            next(createError(...[convertGrpcToHttpErrorCode(err)], {
                developerMessage: getGrpcErrorMessage(err.message), 
                traceId
            }));

        } finally {
            span.end();
        }
    });
});





