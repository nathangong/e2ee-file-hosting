import jwt from 'jsonwebtoken';
import dotenv from 'dotenv'
dotenv.config();

const secretKey = process.env.SECRET_KEY;

function createToken(id: string) {
    return jwt.sign({ id }, secretKey, { expiresIn: '1s' });
}

function verifyToken(token: string) {
    return jwt.verify(token, secretKey);
}

export { createToken, verifyToken };