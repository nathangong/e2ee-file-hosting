import { Storage } from "@google-cloud/storage";
import { UploadedFile } from "express-fileupload";
import uniqid from "uniqid";

const storage = new Storage();
const bucketName = "boxdrop-backend.appspot.com";
const bucket = storage.bucket(bucketName);

/**
 * Query a list of metadata for all of a user's files
 * @param id the user's id
 * @returns the metadata list
 */
export async function getAll(id: number) {
  const [files] = await bucket.getFiles({ prefix: id.toString() });
  const names = files.map((file) => file.metadata);
  return names;
}

/**
 * Query metadata for a specified file
 * @param id the user's id
 * @param name the file name
 * @returns the metadata
 */
export async function getMetadata(id: number, name: string) {
  const path = id + "/" + name;
  const [metadata] = await bucket.file(path).getMetadata();

  return metadata;
}

/**
 * Query metadata for a specified file
 * @param path the path of the file
 */
export async function getMetadataFromPath(path: string) {
  const [metadata] = await bucket.file(path).getMetadata();

  return metadata;
}

/**
 * Download a specified file as a buffer
 * @param id the user's id
 * @param name the file name
 * @returns the file buffer
 */
export async function download(id: number, name: string) {
  const path = id + "/" + name;
  const [buffer] = await bucket.file(path).download();

  return buffer;
}

/**
 * Download a specified shared file as a buffer
 * @param fileId the shared file's id
 * @returns the file buffer
 */
export async function downloadShared(fileId: string) {
  const path = "shared/" + fileId;
  const [buffer] = await bucket.file(path).download();

  return buffer;
}

/**
 * Upload a file to Google Cloud Storage
 * @param id the user's id
 * @param file the encrypted file to upload
 * @param iv the initialization vector for the file
 * @returns the upload response from Google Cloud Storage
 */
export async function upload(id: number, file: UploadedFile, iv: Buffer) {
  const filePath = file.tempFilePath;
  const fileId = uniqid();
  const destFileName = id + "/" + file.name;

  const res = await bucket.upload(filePath, {
    destination: destFileName,
    metadata: {
      metadata: {
        id: fileId,
        iv: iv.toJSON().data.toString(),
      },
    },
  });
  return res;
}

/**
 * Delete a file from Google Cloud Storage. If the file was shared,
 * it will also be deleted from the shared folder.
 * @param id the user's id
 * @param name the file name
 * @returns the upload response from Google Cloud Storage
 */
export async function trash(id: number, name: string) {
  const destFileName = id + "/" + name;
  const fileId = (await getMetadata(id, name)).metadata.id;
  const res = await bucket.file(destFileName).delete();

  const destShared = "shared/" + fileId;
  await bucket.file(destShared).delete();

  return res;
}

/**
 * Copies specified file to shared folder on Google Cloud Storage
 * @param id the user's id
 * @param name the file name
 * @returns the copy response from Google Cloud Storage
 */

export async function share(id: number, name: string) {
  const destFileName = id + "/" + name;

  const metadata = await getMetadata(id, name);
  const destShared = "shared/" + metadata.metadata.id;

  const res = await bucket.file(destFileName).copy(destShared);
  await bucket.file(destShared).setMetadata({
    metadata: {
      name,
    },
  });
  return res;
}
