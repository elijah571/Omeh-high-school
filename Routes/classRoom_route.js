import express from "express";
import { createClassroom } from "../Controllers/classRoom_controller.js";
import { authorizeAdmin } from "../Middleware/authourize.js";


export const classRoomRoute = express.Router()

classRoomRoute.post('/create', authorizeAdmin,   createClassroom)