import { Storage } from '@google-cloud/storage'
import { UploadedFile } from "express-fileupload";

const storage = new Storage();
const bucketName = 'boxdrop-backend.appspot.com';
const bucket = storage.bucket(bucketName);

/**
 * Returns a list of metadata for all of a user's files
 * @param id the user's id
 * @returns the metadata list
 */
export async function getAll(id: number) {
    const [files] =  await bucket.getFiles({ prefix: id.toString() });
    const names = files.map(file => file.metadata);
    return names;
}

/**
 * Returns the metadata for a specified file
 * @param id the user's id
 * @param name the file name
 * @returns the metadata
 */
export async function getMetadata(id: number, name: string) {
    const path = id + '/' + name;
    const [metadata] = await bucket.file(path).getMetadata();

    return metadata;
}

/**
 * Downloads a specified file as a buffer
 * @param id the user's id
 * @param name the file name
 * @returns the file buffer
 */
export async function download(id: number, name: string) {
    const path = id + '/' + name;
    const [buffer] = await bucket.file(path).download();

    return buffer;
}

/**
 * Uploads a file to Google Cloud Storage
 * @param id the user's id
 * @param file the file to upload
 * @returns the upload response from Google Cloud Storage
 */
export async function upload(id: number, file: UploadedFile) {
    const filePath = file.tempFilePath;
    const destFileName = id + "/" + file.name;

    const res = await bucket.upload(filePath, {
        destination: destFileName
    });
    return res;
}