import express from 'express';
import validator from 'validator';
import bcrypt from 'bcrypt';
import { createUserWithEmail, createUserWithProvider, loginWithEmail } from '../db';
import { createToken, verifyToken } from '../auth';

const router = express.Router();
const salt = 10;
const providers = ['email', 'google'];

router.post('/register', async (req, res) => {
    const body = req.body;
    const { email, password, provider } = body;

    // validate request
    if (!providers.includes(provider)) {
        res.status(400).json({error: "Provider not supported"});
        return;
    }
    if (!validator.isEmail(email)) {
        res.status(400).json({error: "Invalid email"});
        return;
    }

    // store user on google cloud
    if (provider === 'email') {
        bcrypt.hash(password, salt).then(async (hash) => {
            res.send(await createUserWithEmail(email, hash));
        }).catch((e: Error) => {
            res.status(400).json({error: e.message});
        });
    } else {
        res.send(await createUserWithProvider(email, provider));
    }
});

router.post('/login', async (req, res) => {
    const body = req.body;
    const { email, password, provider } = body;

    let user;
    try {
        if (provider === 'email') {
            user = await loginWithEmail(email, password);
        } else {
            user = null;
        }
    } catch(e) {
        res.status(400).send(e.message);
    }

    const token = createToken(user.id); // TODO: figure out how to correctly get id of a user
    res.json({'access_token': token});
});

router.get('/:id', (req, res) => {
    const bearerHeader = req.headers.authorization;
    if (bearerHeader == null) {
        res.status(401).json({error: 'Authorization required'});
        return;
    }
    const token = bearerHeader.split(' ')[1];
    res.send(verifyToken(token));
});

export default router;