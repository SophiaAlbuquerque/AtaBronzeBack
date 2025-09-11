import { Request, Response, NextFunction } from 'express';

export interface ValidationErrorField {
  field: string;
  message: string;
}

export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;
  public errors?: ValidationErrorField[];

  constructor(
    message: string,
    statusCode: number = 500,
    errors?: ValidationErrorField[]
  ) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    this.errors = errors;

    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(errors: ValidationErrorField[]) {
    super('Dados de entrada inválidos', 400, errors);
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string = 'Recurso') {
    super(`${resource} não encontrado`, 404);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = 'Não autorizado') {
    super(message, 401);
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = 'Acesso negado') {
    super(message, 403);
  }
}

export class ConflictError extends AppError {
  constructor(message: string = 'Conflito de dados') {
    super(message, 409);
  }
}

// Helper function to create async error handlers
export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
