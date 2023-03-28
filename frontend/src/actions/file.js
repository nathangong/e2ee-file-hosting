import { BACKEND_URL } from "../Constants";
import { useAuth } from "../contexts/AuthContext";

const url = BACKEND_URL + "/file/";

function useFileActions() {
  const { accessToken } = useAuth();

  function requestOptions(method, body) {
    return {
      method,
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        ...(method === 'GET' && {'Content-type': 'application/json'}),
      },
      body,
    }
  }

  return {
    get,
    getAll,
    remove,
    upload,
  };

  async function get(fileName) {
    const response = await fetch(url + fileName, requestOptions('GET'));
    return await response.blob();
  }

  async function getAll() {
    const response = await fetch(url, requestOptions('GET'));
    return await response.json();
  }

  async function remove(name) {
    return await fetch(url + name, requestOptions('DELETE'));
  }

  async function upload(file) {
    const data = new FormData();
    data.append('file', file);
    return await fetch(url + 'upload', requestOptions('POST', data));
  }
}

export { useFileActions };