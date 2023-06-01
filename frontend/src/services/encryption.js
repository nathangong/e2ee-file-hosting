import { SALT } from "../constants";
import { Buffer } from "buffer";

export async function generateMasterKey() {
  const key = await window.crypto.subtle.generateKey(
    {
      name: "AES-CBC",
      length: 256, // Key size in bits
    },
    true, // Extractable
    ["encrypt", "decrypt"] // Key usages
  );
  return key;
}

export async function encryptMasterKey(masterKey, password) {
  const rawMasterKey = await window.crypto.subtle.exportKey("raw", masterKey);

  const passwordKey = await deriveKeyFromPassword(password);
  const { contents, iv } = await encryptSymmetric(rawMasterKey, passwordKey);
  return { encryptedMasterKey: contents, iv };
}

export async function decryptMasterKey(
  encryptedMasterKey,
  password,
  initializationVector
) {
  const passwordKey = await deriveKeyFromPassword(password);
  const rawMasterKey = await decryptSymmetric(
    encryptedMasterKey,
    passwordKey,
    initializationVector
  );
  const masterKey = window.crypto.subtle.importKey(
    "raw",
    rawMasterKey,
    {
      name: "AES-CBC",
    },
    true,
    ["encrypt", "decrypt"]
  );
  return masterKey;
}

export async function exportKey(key) {
  const exportedKey = await window.crypto.subtle.exportKey("jwk", key);
  return JSON.stringify(exportedKey);
}

export async function importKey(key) {
  const parsedKey = await JSON.parse(key);
  const importedKey = await crypto.subtle.importKey(
    "jwk",
    parsedKey,
    {
      name: "AES-CBC",
    },
    true,
    ["encrypt", "decrypt"]
  );
  return importedKey;
}

async function deriveKeyFromPassword(password) {
  const encoder = new TextEncoder();

  const importedKey = await window.crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    { name: "PBKDF2" },
    false,
    ["deriveKey"]
  );

  const key = await window.crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: encoder.encode(SALT),
      iterations: 100000,
      hash: "SHA-256",
    },
    importedKey,
    { name: "AES-CBC", length: 256 },
    true,
    ["encrypt", "decrypt"]
  );
  return key;
}

export async function encryptSymmetric(data, key) {
  const iv = Buffer.from(window.crypto.getRandomValues(new Uint8Array(16)));

  const encryptedContents = await window.crypto.subtle.encrypt(
    {
      name: "AES-CBC",
      iv,
    },
    key,
    data
  );

  return {
    contents: encryptedContents,
    iv: iv,
  };
}

export async function decryptSymmetric(
  encryptedData,
  key,
  initializationVector
) {
  const algorithm = { name: "AES-CBC", iv: initializationVector };
  const decryptedData = await crypto.subtle.decrypt(
    algorithm,
    key,
    encryptedData
  );
  return decryptedData;
}
