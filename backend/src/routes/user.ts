import express from 'express';
import validator from 'validator';
import bcrypt from 'bcrypt';
import * as User from '../models/User';
import { createToken, handleAuthentication, verifyToken } from '../auth';
import { asyncHandler } from '../util';
import { BoxdropError } from '../models/BoxdropError';

const router = express.Router();
const salt = 10;
const providers = ['email', 'google'];

router.post('/register', asyncHandler(async (req, res) => {
    const body = req.body;
    const { email, password, provider } = body;

    // validate request
    if (!providers.includes(provider)) {
        return res.status(400).json({error: "Provider not supported"});
    }
    if (!validator.isEmail(email)) {
        return res.status(400).json({error: "Invalid email"});
    }

    // store user on google cloud
    if (provider === 'email') {
        const hash = await bcrypt.hash(password, salt);
        return res.send(await User.createWithEmail(email, hash));
    } else {
        return res.send(await User.createWithProvider(email, provider));
    }
}));

router.post('/login', asyncHandler(async (req, res) => {
    const body = req.body;
    const { email, password, provider } = body;

    let user;
    if (provider === 'email') {
        user = await User.loginWithEmail(email, password);
    } else {
        user = null;  // TODO
    }

    const token = createToken(user.id);
    return res.json({'access_token': token});
}));

router.get('/me', asyncHandler(async (req, res) => {
    const id = handleAuthentication(req.headers.authorization);

    const user = await User.get(id);
    if (user === undefined) {
        throw new BoxdropError('Requested user does not exist', 404);
    }
    return res.send(user);
}));

export default router;