import { BACKEND_URL } from "../constants";
import { useAuth } from "../contexts/AuthContext";
import { encryptMasterKey, generateMasterKey } from "../services/encryption";

const url = BACKEND_URL + "/user/";

function useUserActions() {
  const { accessToken } = useAuth();

  function requestOptions(method, body) {
    return {
      method,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-type": "application/json",
      },
      body,
    };
  }

  return {
    getData,
    login,
    register,
  };

  async function getData() {
    const response = await fetch(url + "me", requestOptions("GET"));
    return await response.json();
  }

  async function login(email, password) {
    const body = JSON.stringify({
      email: email,
      password: password,
      provider: "email",
    });
    const response = await fetch(url + "login", requestOptions("POST", body));
    return await response.json();
  }

  async function register(email, password) {
    const masterKey = await generateMasterKey();
    const { encryptedMasterKey, iv } = await encryptMasterKey(
      masterKey,
      password
    );

    const body = JSON.stringify({
      email: email,
      password: password,
      provider: "email",
      masterKey: Array.from(new Uint8Array(encryptedMasterKey)),
      masterKeyIv: Array.from(new Uint8Array(iv)),
    });
    const response = await fetch(
      url + "register",
      requestOptions("POST", body)
    );
    return await response.json();
  }
}

export { useUserActions };
