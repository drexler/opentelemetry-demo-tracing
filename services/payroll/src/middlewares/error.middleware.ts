
import {HttpError} from '../models/HttpError';
import {Response, NextFunction } from 'express';

export const errorHandler = (
  error: HttpError,
  request: any,
  response: Response,
  next: NextFunction
) => {
  console.log('in error middleware');
  console.log(`${JSON.stringify(error)}`);
  const status = error.statusCode || 500;
  const message = error.message || "Entschuldigung, wo ist der Artz?";
  const developerMessage = error.developerMessage || undefined;
  const traceId = error.traceId;

  response.status(status).json({
      statusCode: status,
      message,
      developerMessage,
      traceId,
  })
};