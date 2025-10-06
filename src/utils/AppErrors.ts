export class AppError extends Error {
  statusCode: number;
  isOperationable: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperationable = true;
    Error.captureStackTrace(this, this.constructor);
  }
}
