export class HttpError extends Error {
    statusCode: number;
    message: string;
    developerMessage: string | undefined;
    traceId: string | undefined;
    error: string | undefined;
  
    constructor(statusCode: number, message: string, error?: string) {
      super(message);
  
      this.statusCode = statusCode;
      this.message = message;
      this.error = error || undefined;
    }  
}