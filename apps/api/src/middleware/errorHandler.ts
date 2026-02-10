import { Request, Response, NextFunction } from 'express';
import { ErrorResponse } from '@app/shared';

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  console.error('Error:', err);

  const errorResponse: ErrorResponse = {
    error: {
      code: err.code || 'INTERNAL_ERROR',
      message: err.message || 'An unexpected error occurred',
      details: err.details || undefined,
    },
  };

  const statusCode = err.statusCode || 500;
  res.status(statusCode).json(errorResponse);
};
