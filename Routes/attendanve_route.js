import express from 'express';
import { createAttendance, getAttendanceByClassroomAndDate, getStudentAttendance, updateAttendance } from '../Controllers/attendance_controller.js';


export const attendanceRoute = express.Router();

attendanceRoute.post('/mark-attendance', createAttendance);
attendanceRoute.put('/:id', updateAttendance);
attendanceRoute.get('/', getAttendanceByClassroomAndDate);
attendanceRoute.get('/:id', getStudentAttendance);