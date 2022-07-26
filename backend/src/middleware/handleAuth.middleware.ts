import { NextFunction, Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import { verifyToken } from "../auth";
import { BoxdropError } from "../models/BoxdropError";

/**
 * Verify auth token from a request and pass decoded user id to router functions
 */
export default function handleAuth(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const bearerHeader = req.headers.authorization;
  if (bearerHeader == null) {
    throw new BoxdropError("Authorization required", 401);
  }
  const token = bearerHeader.split(" ")[1];
  const verification = verifyToken(token) as JwtPayload;
  res.locals.id = verification.id;

  next();
}
