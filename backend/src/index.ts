import express from 'express';
import { Request, Response } from 'express'
import users from './routes/users';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = 8080;
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
    res.send("Hello world!");
});

app.listen(port, () => {
    console.log(`App is running at port ${port}`)
});

app.use('/users', users);