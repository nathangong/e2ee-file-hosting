import { Storage } from '@google-cloud/storage'
import { UploadedFile } from "express-fileupload";

const storage = new Storage();
const bucketName = 'boxdrop-backend.appspot.com';

export async function getAll(id: number) {
    const [files] =  await storage.bucket(bucketName).getFiles({ prefix: id.toString() });
    const names = files.map(file => file.metadata);
    return names;
}

export async function download(id: number, name: string) {
    const path = id + '/' + name;
    const [buffer] = await storage.bucket(bucketName).file(path).download();

    return buffer;
}

export async function upload(id: number, file: UploadedFile) {
    const filePath = file.tempFilePath;
    const destFileName = id + "/" + file.name;

    const res = await storage.bucket(bucketName).upload(filePath, {
        destination: destFileName
    });
    return res;
}