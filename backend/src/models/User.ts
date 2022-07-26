import { Datastore } from "@google-cloud/datastore";
import bcrypt from 'bcrypt';
import { BoxdropError } from "./BoxdropError";

const datastore = new Datastore({
    projectId: 'boxdrop-backend'
});

async function queryEmail(email: string) {
    const query = datastore.createQuery("users").filter('email', email);
    const queryRes = await query.run();
    return queryRes[0];
}

export async function createWithEmail(email: string, password: string) {
    const queryRes = await queryEmail(email);
    if (queryRes.length > 0) {
        throw new BoxdropError(`User with email ${email} already exists`, 400);
    }

    const res = await datastore.save({
        key: datastore.key(['users']),
        data: {
            email,
            password,
            provider: 'email'
        }
    });
    return res;
}

export async function createWithProvider(email: string, provider: string) {
    const queryRes = await queryEmail(email);
    if (queryRes.length > 0) {
        throw new BoxdropError(`User with email ${email} already exists`, 400);
    }

    const res = await datastore.save({
        key: datastore.key(['users']),
        data: {
            email,
            provider
        }
    });
    return res;
}

export async function loginWithEmail(email: string, password: string) {
    const queryRes = await queryEmail(email);
    if (queryRes.length === 0) {
        throw new BoxdropError(`User with ${email} doesn't exist`, 404);
    }
    const user = queryRes[0];
    console.log(user);
    const valid = bcrypt.compare(password, user.password);
    if (!valid) {
        throw new BoxdropError('Invalid password', 400);
    }
    return user[datastore.KEY];
}

export async function get(id: number) {
    const key = datastore.key(['users', datastore.int(id)]);
    const res = await datastore.get(key);
    return res[0];
}
