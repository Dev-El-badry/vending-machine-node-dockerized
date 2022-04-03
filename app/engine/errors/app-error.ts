import { CustomError } from './custom-error';

export class AppError extends CustomError {
  statusCode: number = 422;
  reason: string = 'not available at that moment !';
  constructor(reason: string, statusCode: number = 422) {
    super('not available at that moment !');
    this.reason = reason;
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, AppError.prototype);
  }

  serializeErrors() {
    return [{ message: this.reason }];
  }
}
