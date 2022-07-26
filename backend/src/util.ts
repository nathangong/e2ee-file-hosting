import { NextFunction, Request, RequestHandler, Response } from "express";

/**
 * Enables streamlined error handling for asynchronous functions
 */
export const asyncHandler = (fn: RequestHandler) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
