export class AppError extends Error {
  constructor(
    public readonly statusCode: number,
    message: string,
    public readonly details?: unknown,
    options?: ErrorOptions,
  ) {
    super(message, options);
    this.name = 'AppError';
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Resource not found', options?: ErrorOptions) {
    super(404, message, undefined, options);
    this.name = 'NotFoundError';
  }
}

export class ValidationError extends AppError {
  constructor(
    message = 'Validation failed',
    details?: unknown,
    options?: ErrorOptions,
  ) {
    super(400, message, details, options);
    this.name = 'ValidationError';
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized', options?: ErrorOptions) {
    super(401, message, undefined, options);
    this.name = 'UnauthorizedError';
  }
}

export class ConflictError extends AppError {
  constructor(message = 'Conflict', options?: ErrorOptions) {
    super(409, message, undefined, options);
    this.name = 'ConflictError';
  }
}
