import { BACKEND_URL } from "../Constants";
import { useAuth } from "../contexts/AuthContext";

const url = BACKEND_URL + "/file/";

function useFileActions() {
  const { accessToken } = useAuth();

  function requestOptions(method, body) {
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

  async function get(name) {
    const response = await fetch(
      url + name + "/content",
      requestOptions("GET")
    );
    return await response.blob();
  }

  async function getAllMetadata() {
    const response = await fetch(url, requestOptions("GET"));
    return await response.json();
  }

  async function getShared(id) {
    const response = await fetch(
      url + "public/" + id + "/content",
      requestOptions("GET")
    );
    return await response.blob();
  }

  async function getSharedMetadata(id) {
    const response = await fetch(url + "public/" + id, requestOptions("GET"));
    return await response.json();
  }

  async function remove(name) {
    return await fetch(url + name, requestOptions("DELETE"));
  }

  async function share(name) {
    return await fetch(url + "share/" + name, requestOptions("POST"));
  }

  async function upload(file) {
    const data = new FormData();
    data.append("file", file);
    return await fetch(url + "upload", requestOptions("POST", data));
  }
}

export { useFileActions };
