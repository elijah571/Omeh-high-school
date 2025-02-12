import express from 'express';
import ExpressFormidable from 'express-formidable';
import { authorize, authorizeAdmin } from '../Middleware/authourize.js';
import { createStudent, getAllStudents, getStudentById, updateStudent } from '../Controllers/student_controller.js';

export const student_route = express.Router()
//Enroll student
student_route.post('/enroll', ExpressFormidable(), authorizeAdmin, createStudent);
//Get all student
student_route.get('/', authorize, getAllStudents),
//Get a single student
student_route.get('/:id', authorize, getStudentById);
//update a student
student_route.put('/:id', authorizeAdmin, updateStudent)