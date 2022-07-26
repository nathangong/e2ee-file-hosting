import express from "express";
import { UploadedFile } from "express-fileupload";
import { asyncHandler } from "../util";
import * as File from "../models/File";
import { BoxdropError } from "../models/BoxdropError";
import { Stream } from "stream";
import handleAuth from "../middleware/handleAuth.middleware";

const router = express.Router();

router.use(handleAuth);

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const id = res.locals.id;

    return res.send(await File.getAll(id));
  })
);

router.get(
  "/:name",
  asyncHandler(async (req, res) => {
    const id = res.locals.id;

    const name = req.params.name;
    const buffer = await File.download(id, name);
    const metadata = await File.getMetadata(id, name);

    const readStream = new Stream.PassThrough();
    readStream.end(buffer);
    res.set("Content-disposition", `attachment; filename="${name}"`);
    res.set("Content-type", metadata.contentType);
    readStream.pipe(res);
  })
);

router.post(
  "/upload",
  asyncHandler(async (req, res) => {
    const id = res.locals.id;
    if (!req.files || Object.keys(req.files).length === 0) {
      throw new BoxdropError("No files were uploaded", 400);
    }
    const file = req.files.file as UploadedFile;
    await File.upload(id, file);

    return res.send("file recieved!");
  })
);

export default router;
