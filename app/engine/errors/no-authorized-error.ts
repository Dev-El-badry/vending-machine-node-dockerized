import { CustomError } from './custom-error';

export class NoAuthorizedError extends CustomError {
  statusCode: number = 401;
  reason: string = 'not allowed to be here';
  constructor() {
    super('not allowed to be here');

    Object.setPrototypeOf(this, NoAuthorizedError.prototype);
  }

  serializeErrors() {
    return [{ message: this.reason }];
  }
}
