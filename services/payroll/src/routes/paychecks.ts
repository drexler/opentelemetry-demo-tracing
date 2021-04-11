import express, { NextFunction, Request, Response } from "express";
import { paycheckService } from '../services';
import * as api from '@opentelemetry/api';
import createError from 'http-errors';
import { convertGrpcToHttpErrorCode } from "../utils";


export const paychecksRouter = express.Router();

const tracer = api.trace.getTracer('payroll-tracer')

/**
 * Generates information for all paychecks
 */
paychecksRouter.get('/', (_request: Request, response: Response, next: NextFunction) => {
    const span = tracer.startSpan('payroll: getAllPaychecks');

    api.context.with(api.setSpan(api.context.active(), span), () => {
        const traceId =  span.context().traceId;
        paycheckService.getAllPaychecks({}, (err: any, result: any) => {
            span.end();
            if (err) {
                next(createError(...[convertGrpcToHttpErrorCode(err)], {
                    developerMessage: err.message, 
                    traceId
                }));
            } else {
                response.send(result);
            }


        });
    });
});





