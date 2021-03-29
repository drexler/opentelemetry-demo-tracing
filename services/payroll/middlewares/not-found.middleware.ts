import createError from 'http-errors';
import { Request, Response, NextFunction } from 'express';

export const notFoundHandler = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
    next(createError(404, 'The requested route cannot be found'));
};