import { NextFunction, Request, Response } from "express";
import { BoxdropError } from "../models/BoxdropError";

export default function handleError(
  err: Error | BoxdropError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  let customError = err;

  if (!(err instanceof BoxdropError)) {
    customError = new BoxdropError("Internal server error");
  }

  res
    .status((customError as BoxdropError).statusCode)
    .json({ error: err.message });
}
