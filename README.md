# boxdrop (GongDrive)

A Google Drive / Dropbox clone built with a React.js + TailwindCSS frontend, an Express.js backend, and Google Cloud's database.

Frontend deployed with Netlify, backend hosted on Google Cloud Run.

Features:

- Upload, store, download, and delete files (less than 2 MB) on a personal cloud drive
- Share files publicly with generated url
- Authentication implemented through bcrypt password encryption and temporary access tokens
- Files stored securely on Google Cloud Drive

## Installation

- Download or clone the repository
- Run `yarn install` in both the backend and frontend folders
- Run `yarn start` in each folder to host the backend and frontend respectively
- The app should be viewable at [http://localhost:3000](http://localhost:3000), backend will be accessible at [http://localhost:8080](http://localhost:8080)
