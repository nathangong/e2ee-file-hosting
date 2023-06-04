import { BACKEND_URL } from "../constants";
import { useAuth } from "../contexts/AuthContext";
import { decryptSymmetric, encryptSymmetric } from "../services/encryption";

const url = BACKEND_URL + "/file/";

function useFileActions() {
  const { accessToken, masterKey } = useAuth();

  function requestOptions(method: string, body?: BodyInit) {
    return {
      method,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body,
    };
  }

  return {
    get,
    getShared,
    getSharedMetadata,
    getAllMetadata,
    remove,
    share,
    upload,
  };

  async function get(name: string) {
    const { metadata } = await getMetadata(name);
    const response = await fetch(
      url + name + "/content",
      requestOptions("GET")
    );

    const isPrivate = Boolean(metadata.iv);
    if (isPrivate) {
      const ivArray = metadata.iv.split(",").map(Number);
      const iv = Uint8Array.from(ivArray);

      const encryptedContents = await response.arrayBuffer();
      const decryptedFile = await decryptSymmetric(
        encryptedContents,
        masterKey!,
        iv
      );
      return new Blob([decryptedFile]);
    } else {
      return await response.blob();
    }
  }

  async function getMetadata(name: string) {
    const response = await fetch(url + name, requestOptions("GET"));
    return await response.json();
  }

  async function getAllMetadata() {
    const response = await fetch(url, requestOptions("GET"));
    return await response.json();
  }

  async function getShared(id: string) {
    const response = await fetch(
      url + "public/" + id + "/content",
      requestOptions("GET")
    );
    return await response.blob();
  }

  async function getSharedMetadata(id: string) {
    const response = await fetch(url + "public/" + id, requestOptions("GET"));
    return await response.json();
  }

  async function remove(name: string) {
    return await fetch(url + name, requestOptions("DELETE"));
  }

  async function share(name: string) {
    return await fetch(url + "share/" + name, requestOptions("POST"));
  }

  async function upload(file: File, isPrivate: boolean) {
    const formData = new FormData();

    if (isPrivate) {
      const fileBuffer = await file.arrayBuffer();
      const { encryptedContents, iv } = await encryptSymmetric(
        fileBuffer,
        masterKey!
      );

      const fileBlob = new Blob([encryptedContents]);
      const ivBlob = new Blob([iv]);
      formData.append("file", fileBlob, file.name);
      formData.append("iv", ivBlob);
    } else {
      formData.append("file", file);
    }
    return await fetch(url + "upload", requestOptions("POST", formData));
  }
}

export { useFileActions };
