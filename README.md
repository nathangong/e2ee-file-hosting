# e2ee file hosting (GongDrive)

An end-to-end encrypted file hosting service built with a React.js + TailwindCSS frontend, an Express.js backend, and Google Cloud Storage.

Frontend deployed with Netlify, backend hosted on Google Cloud Run.

Features:

- Securely upload, store, download, and delete files (less than 2 MB) on a personal cloud drive; multiple devices supported
- Share files publicly with generated url
- Authentication implemented through bcrypt password hashing and temporary access tokens
- End-to-end file encryption via [Subtle Crypto](https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto)

Please note that this is just a personal project I developed for learning purposes, and should not be used for sensitive or production-grade data storage.

## End-To-End Encryption

Files are encrypted and decrypted on the user's device, ensuring that data remains secure throughout the entire journey between the user and server. This project's implementation takes advantage of AES (Advanced Encryption Standard), a symmetric encryption algorithm.

A master key for encrypting/decrypting files is generated during the creation of a user account. To support a user logging in on multiple devices, the master key is encrypted using the user's password with a key derivation function (PBKDF2) and uploaded to the server. As such, the master key can only be decrypted by clients who have logged in. Even if server data is compromised, the master key cannot be decrypted because passwords are not directly stored on the server.
