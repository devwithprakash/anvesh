import type { NextFunction, Request, Response } from 'express';
import multer from 'multer';
import { ZodError } from 'zod';
import { AppError } from '../types/app-error.js';
import { getZodFieldErrors } from '../utils/zod-error.js';
import logger from '../utils/logger.js';

export function errorHandler(
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      error: error.message,
      ...(error.details ? { details: error.details } : {}),
    });
    return;
  }

  if (error instanceof ZodError) {
    res.status(400).json({
      error: 'Validation failed',
      details: getZodFieldErrors(error),
    });
    return;
  }

  if (error instanceof multer.MulterError) {
    res.status(400).json({
      error: error.message,
    });
    return;
  }

  if (
    error instanceof Error &&
    error.message === 'Only PDF files are allowed'
  ) {
    res.status(400).json({
      error: error.message,
    });
    return;
  }

  const cloudinaryError = error as {
    name?: unknown;
    http_code?: unknown;
  };

  if (
    cloudinaryError.name === 'UnexpectedResponse' &&
    cloudinaryError.http_code === 403
  ) {
    res.status(400).json({
      error:
        'Cloudinary upload rejected: your API key is missing Upload (create) permission.',
    });
    return;
  }

  logger.error('Unhandled error', {
    error: error instanceof Error ? error.message : error,
    stack: error instanceof Error ? error.stack : undefined,
  });

  res.status(500).json({
    error: 'Internal server error',
  });
}
