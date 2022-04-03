import { CustomError } from './custom-error';

export class NotFoundItemError extends CustomError {
  statusCode: number = 404;
  reason: string = 'not available at that moment !';
  constructor(reason: string) {
    super('not available at that moment !');
    this.reason = reason;
    Object.setPrototypeOf(this, NotFoundItemError.prototype);
  }

  serializeErrors() {
    return [{ message: this.reason }];
  }
}
