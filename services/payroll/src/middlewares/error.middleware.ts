
import {HttpError} from '../models/HttpError';
import {Response, NextFunction } from 'express';

export const errorHandler = (
  error: HttpError,
  request: any,
  response: Response,
  next: NextFunction
) => {
  const status = error.statusCode || 500;
  const message = error.message || "Entschuldigung, wo ist der Artz?";
  const developerMessage = error.developerMessage || message;
  const requestId = error.traceId;

  response.status(status).json({
      statusCode: status,
      message,
      developerMessage,
      requestId,
  })
};