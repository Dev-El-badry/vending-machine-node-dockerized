import { CustomError } from './custom-error';
import { ValidationError } from 'express-validator';

export class RequestValidationError extends CustomError {
  statusCode: number = 422;
  constructor(public error: ValidationError[]) {
    super('invalid request param !');

    Object.setPrototypeOf(this, RequestValidationError.prototype);
  }

  serializeErrors() {
    const formattedError = this.error.map((error) => {
      return { message: error.msg, field: error.param };
    });

    return formattedError;
  }
}
