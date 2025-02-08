import express from "express";
import { authorizeAdmin } from "../Middleware/authourize.js";
import ExpressFormidable from "express-formidable";
import { createTeacher } from "../Controllers/teacher_controller.js";

export const teachers_route = express.Router()

teachers_route.post('/create', ExpressFormidable(), authorizeAdmin, createTeacher)