import { Datastore, Entity } from "@google-cloud/datastore";
import bcrypt from 'bcrypt';

const datastore = new Datastore({
    projectId: 'boxdrop-backend'
});

async function queryEmail(email: string) {
    const query = datastore.createQuery("users").filter('email', email);
    const queryRes = await query.run();
    return queryRes[0];
}

export async function createUserWithEmail(email: string, password: string) {
    const queryRes = await queryEmail(email);
    if (queryRes.length > 0) {
        throw new Error(`User with email ${email} already exists`);
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

export async function createUserWithProvider(email: string, provider: string) {
    const queryRes = await queryEmail(email);
    if (queryRes.length > 0) {
        throw new Error(`User with email ${email} already exists`);
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
        throw new Error(`User with ${email} doesn't exist`);
    }
    const user = queryRes[0];
    
    const valid = bcrypt.compare(password, user.password);
    if (!valid) {
        throw new Error('Invalid password');
    }
    return user[datastore.KEY];
}
