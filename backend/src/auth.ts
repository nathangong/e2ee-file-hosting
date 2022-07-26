import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const secretKey = process.env.SECRET_KEY;

/**
 * Sign the user's id into a JSON Web Token string
 * @param id the user's id
 * @returns the JSON Web Token string
 */
export function createToken(id: string) {
  return jwt.sign({ id }, secretKey, { expiresIn: "2h" });
}

/**
 * Verify auth token and decode user id
 * @param token the token
 * @returns the decoded user id
 */
export function verifyToken(token: string) {
  return jwt.verify(token, secretKey);
}
