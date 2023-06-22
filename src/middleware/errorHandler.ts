import { NextFunction, Request, Response } from 'express';

export class HttpError extends Error {
  statusCode: number;
  code?: number;
  keyValue?: Record<string, unknown>;
  kind?: string;
  errors?: Record<string, any> | undefined;

  constructor(
    message: string,
    statusCode: number,
    code?: number,
    keyValue?: Record<string, unknown>,
    kind?: string,
    errors?: Record<string, any> | undefined,
  ) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.keyValue = keyValue;
    this.kind = kind;
    this.errors = errors;
  }
}

interface FieldErrors {
  [key: string]: string;
}

export const errorHandler = (error: HttpError, req: Request, res: Response, next: NextFunction) => {
  let status = error.statusCode || 500;
  let message: FieldErrors | string = error.message || 'Internal Server Error';

  // Duplication
  if (error.code === 11000) {
    error.statusCode = 400;

    if (error.keyValue) {
      message = Object.keys(error.keyValue)
        .map((key) => `${key} has to be unique!`)
        .join(', ');
    }
  }

  // ObjectID: not found
  if (error.kind === 'ObjectId') {
    status = 400;
    message = `The ${req.originalUrl} is not found because of wrong ID!`;
  }

  // Validate
  // if (error.errors) {
  //   status = 400;
  //   message = [];

  //   for (let field in error.errors) {
  //     const fieldError = error.errors[field].properties.message;
  //     console.log(field);
  //     message.push(fieldError);
  //   }
  // }

  if (error.errors) {
    status = 400;
    message = {};

    for (let field in error.errors) {
      const fieldError = error.errors[field].properties.message;
      message[field] = fieldError;
    }
  }

  res.status(status).json({ statusText: 'Failed!', message });
};
