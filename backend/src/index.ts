import express, { NextFunction } from "express";
import { Request, Response } from "express";
import user from "./routes/user";
import file from "./routes/file";
import dotenv from "dotenv";
import fileUpload from "express-fileupload";
import cors from "cors";
import handleError from "./middleware/handleError";

dotenv.config();

const app = express();
const port = process.env.PORT || 8080;
app.use(express.json());
app.use(cors());
app.use(
  fileUpload({
    limits: {
      fileSize: 2e6, // 2MB max file(s) size
    },
    abortOnLimit: true,
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

app.listen(port, () => {
  console.log(`App is running at port ${port}`);
});

app.use("/user", user);
app.use("/file", file);

app.use(handleError);
