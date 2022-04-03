export abstract class CustomError extends Error {
  abstract statusCode: number;
  isOperational = true;
  constructor(message: string) {
    super(message);

    Object.setPrototypeOf(this, CustomError.prototype);
    // Error.captureStackTrace(this, this.constructor);
  }
  abstract serializeErrors(): { message: string; field?: string }[];
}
