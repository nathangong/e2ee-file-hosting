import express from "express";
import { UploadedFile } from "express-fileupload";
import { asyncHandler } from "../util";
import * as File from "../models/File";
import { BoxdropError } from "../models/BoxdropError";
import { Stream } from "stream";
import handleAuth from "../middleware/handleAuth";
import fs from "fs";

const router = express.Router();

router.get(
  "/public/:id",
  asyncHandler(async (req, res) => {
    const id = req.params.id;
    const path = "shared/" + id;

    return res.send(await File.getMetadataFromPath(path));
  })
);

router.get(
  "/public/:id/content",
  asyncHandler(async (req, res) => {
    const id = req.params.id;
    const path = "shared/" + id;
    const buffer = await File.downloadShared(id);
    const metadata = await File.getMetadataFromPath(path);
    const name = metadata.metadata.name;

    const readStream = new Stream.PassThrough();
    readStream.end(buffer);
    res.set("Content-disposition", `attachment; filename="${name}"`);
    res.set("Content-type", metadata.contentType);
    readStream.pipe(res);
  })
);

router.use(handleAuth);

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const id = res.locals.id;

    return res.send(await File.getAll(id));
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
    const ivFile = req.files.iv as UploadedFile;
    const iv = fs.readFileSync(ivFile.tempFilePath);
    // console.log(file.tempFilePath);
    // console.log(iv.tempFilePath);
    // console.log(fs.readFileSync(file.tempFilePath).buffer);
    // console.log(fs.readFileSync(iv.tempFilePath).buffer);

    await File.upload(id, file, iv);

    return res.send("file received!");
  })
);

router.get(
  "/:name",
  asyncHandler(async (req, res) => {
    const id = res.locals.id;
    const name = req.params.name;

    return res.send(await File.getMetadata(id, name));
  })
);

router.get(
  "/:name/content",
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

router.delete(
  "/:name",
  asyncHandler(async (req, res) => {
    const id = res.locals.id;
    const name = req.params.name;

    await File.trash(id, name);
    return res.send("file deleted!");
  })
);

router.post(
  "/share/:name",
  asyncHandler(async (req, res) => {
    const id = res.locals.id;
    const name = req.params.name;

    await File.share(id, name);
    return res.send("file shared!");
  })
);

export default router;
