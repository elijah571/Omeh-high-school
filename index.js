import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import uploadRoute from './Routes/uploadRoute.js';
import { connectDB } from './Database/connectDB.js';
import path from 'path';
//routes
import { adminRoute } from './Routes/administrative_route.js';
import { classRoomRoute } from './Routes/classRoom_route.js';
import { teachers_route } from './Routes/teachers_route.js';
import { student_route } from './Routes/student_route.js';
import { attendanceRoute } from './Routes/attendanve_route.js';

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
app.use("/api/class-room", classRoomRoute);
app.use("/api/teacher", teachers_route);
app.use("/api/student", student_route);
app.use("/api/attendace", attendanceRoute);
app.use("/api/upload", uploadRoute);

const __dirname = path.resolve();
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.listen(PORT, () => {
    console.log('server running on PORT:', PORT);
});
