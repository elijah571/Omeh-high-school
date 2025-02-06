import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import exp from 'constants';
import { connectDB } from './Database/connectDB.js';
 
dotenv.config()
const PORT = process.env.PORT || 3000;
const app = express();
//middleware
app.use(express.json());
app.use(cookieParser());
connectDB();

app.listen(PORT, () => {
    console.log('server running on PORT:', PORT)
})