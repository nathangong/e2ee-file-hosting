import express, { NextFunction } from "express";
import { Request, Response } from "express";
import user from "./routes/user";
import file from "./routes/file";
import dotenv from "dotenv";
import fileUpload from "express-fileupload";
import { BoxdropError } from "./models/BoxdropError";
import cors from "cors";

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

app.get("/", (req: Request, res: Response) => {
  return res.send("Hello world!");
});

app.listen(port, () => {
  console.log(`App is running at port ${port}`);
});

app.use("/user", user);
app.use("/file", file);

// Error handling middleware
app.use((err: Error | BoxdropError, req: Request, res: Response, next: NextFunction) => {
  let customError = err;

  if (!(err instanceof BoxdropError)) {
    customError = new BoxdropError("Internal server error");
  }

  res
    .status((customError as BoxdropError).statusCode)
    .json({ error: err.message });
});
