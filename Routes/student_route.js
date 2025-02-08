import express from 'express';
import ExpressFormidable from 'express-formidable';
import { authorizeAdmin } from '../Middleware/authourize.js';
import { createStudent } from '../Controllers/student_controller.js';

export const student_route = express.Router()

student_route.post('/enroll', ExpressFormidable(), authorizeAdmin, createStudent);