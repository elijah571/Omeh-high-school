import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import uploadRoute from './Routes/uploadRoute.js';
import { connectDB } from './Database/connectDB.js';
import path from 'path';
import { adminRoute } from './Routes/administrative_route.js';

dotenv.config();
const PORT = process.env.PORT || 3000;

connectDB();
const app = express();

//middleware
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: "*" })); 
//api
app.use("/api/admin", adminRoute);
app.use("/api/upload", uploadRoute);

const __dirname = path.resolve();
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.listen(PORT, () => {
    console.log('server running on PORT:', PORT);
});
