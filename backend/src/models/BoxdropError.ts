export class BoxdropError extends Error {
    statusCode: number;

    constructor(message: string, status: number = 500) {
        super(message);

        this.message = message;
        this.statusCode = status;

        Error.captureStackTrace(this, this.constructor);
    }
}