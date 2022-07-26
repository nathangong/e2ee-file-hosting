import { Datastore } from "@google-cloud/datastore";
import bcrypt from 'bcrypt';
import { BoxdropError } from "./BoxdropError";

const datastore = new Datastore({
    projectId: 'boxdrop-backend'
});

/**
 * Query user based on email. Since emails must be unique, the output should always
 * be of length 1 if a user with the specified email exists, or 0 otherwise.
 * @param email the email
 * @returns a list of users with the email
 */
async function queryEmail(email: string) {
    const query = datastore.createQuery("users").filter('email', email);
    const queryRes = await query.run();
    return queryRes[0];
}

/**
 * Get user with a given id
 * @param id the id
 * @returns the user data
 */
 export async function get(id: number) {
    const key = datastore.key(['users', datastore.int(id)]);
    const res = await datastore.get(key);
    return res[0];
}

/**
 * Create a user using email and password authentication. Passwords are encrypted before
 * they are stored in the database.
 * @param email the user's email
 * @param password the user's password
 * @returns the save response from datastore
 */
export async function createWithEmail(email: string, password: string) {
    const queryRes = await queryEmail(email);
    if (queryRes.length > 0) {
        throw new BoxdropError(`User with email ${email} already exists`, 400);
    }

    const salt = 10;
    const hash = await bcrypt.hash(password, salt);
    const res = await datastore.save({
        key: datastore.key(['users']),
        data: {
            email,
            hash,
            provider: 'email'
        }
    });
    return res;
}

/**
 * Work in progress: create a user using third-party authentication
 * @param email the email
 * @param provider the name of the auth provider
 * @returns the save response from datastore
 */
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

/**
 * User login through email and password authentication.
 * @param email the user's email
 * @param password the user's password
 * @returns the user data
 */
export async function loginWithEmail(email: string, password: string) {
    const queryRes = await queryEmail(email);
    if (queryRes.length === 0) {
        throw new BoxdropError(`User with ${email} doesn't exist`, 404);
    }
    const user = queryRes[0];
    const valid = bcrypt.compare(password, user.password);
    if (!valid) {
        throw new BoxdropError('Invalid password', 400);
    }
    return user[datastore.KEY];
}
