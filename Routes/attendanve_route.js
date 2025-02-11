import express from 'express';
import { createAttendance, deleteAttendance, getAttendanceWithStudentInfo, getSingleStudentAttendance, updateAttendance } from '../Controllers/attendance_controller.js';


export const attendanceRoute = express.Router();

attendanceRoute.post('/mark-attendance', createAttendance);
attendanceRoute.put('/:id', updateAttendance);
//Get all attendace
attendanceRoute.get('/:classroomId', getAttendanceWithStudentInfo);
//get a student attendence
attendanceRoute.get('/:classroomId/:studentId', getSingleStudentAttendance);
//Delete attendace
attendanceRoute.delete('/:classroomId', deleteAttendance)