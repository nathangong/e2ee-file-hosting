import jwt, { JwtPayload } from 'jsonwebtoken';
import dotenv from 'dotenv'
import { BoxdropError } from './models/BoxdropError';
dotenv.config();

const secretKey = process.env.SECRET_KEY;

export function createToken(id: string) {
    return jwt.sign({ id }, secretKey, { expiresIn: '30m' });
}

export function verifyToken(token: string) {
    return jwt.verify(token, secretKey);
}

export function handleAuthentication(bearerHeader: string) {
    if (bearerHeader == null) {
        throw new BoxdropError('Authorization required', 401);
    }
    const token = bearerHeader.split(' ')[1];
    const verification = verifyToken(token) as JwtPayload;
    return verification.id;
}
