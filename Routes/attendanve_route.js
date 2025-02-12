import express from 'express';
import { createAttendance, deleteAttendance, getAttendanceWithStudentInfo, getSingleStudentAttendance, updateAttendance } from '../Controllers/attendance_controller.js';
import { authorize } from '../Middleware/authourize.js';


export const attendanceRoute = express.Router();

attendanceRoute.post('/mark-attendance', authorize, createAttendance);
attendanceRoute.put('/:id', authorize, updateAttendance);
//Get all attendace
attendanceRoute.get('/:classroomId', authorize, getAttendanceWithStudentInfo);
//get a student attendence
attendanceRoute.get('/:classroomId/:studentId',  authorize, getSingleStudentAttendance);
//Delete attendace
attendanceRoute.delete('/:classroomId', authorize, deleteAttendance)