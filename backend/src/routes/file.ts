import express from 'express'
import { UploadedFile } from 'express-fileupload';
import { handleAuthentication } from '../auth';
import { asyncHandler } from '../util';
import * as File from '../models/File';
import { BoxdropError } from '../models/BoxdropError';
import { Stream } from 'stream';

const router = express.Router();

router.get('/', asyncHandler(async (req, res) => {
    const id = handleAuthentication(req.headers.authorization);

    return res.send(await File.getAll(id));
}));

router.get('/:name', asyncHandler(async (req, res) => {
    const id = handleAuthentication(req.headers.authorization);

    const name = req.params.name;
    const buffer = await File.download(id, name);
    const readStream = new Stream.PassThrough();
    readStream.end(buffer)
    res.set('Content-disposition', `attachment; filename="${name}"`);
    readStream.pipe(res);
}));

router.post('/upload', asyncHandler(async (req, res) => {
    const id = handleAuthentication(req.headers.authorization);
    if (!req.files || Object.keys(req.files).length === 0) {
        throw new BoxdropError('No files were uploaded', 400);
    }
    const file = req.files.file as UploadedFile;
    await File.upload(id, file);

    return res.send('file recieved!');
}));

export default router;
