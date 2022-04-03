import { CustomError } from './custom-error';

export class NotFoundError extends CustomError {
  statusCode: number = 404;
  reason: string = 'not available at that moment !';
  constructor() {
    super('not available at that moment !');

    Object.setPrototypeOf(this, NotFoundError.prototype);
  }

  serializeErrors() {
    return [{ message: this.reason }];
  }
}
