import express from "express";
import {  addStudentsToClassroom, assignTeacherToClassroom, createClassroom } from "../Controllers/classRoom_controller.js";
import { authorizeAdmin } from "../Middleware/authourize.js";


export const classRoomRoute = express.Router()
//Creating a classroom
classRoomRoute.post('/create', authorizeAdmin,   createClassroom);
// assign teacher to the class
classRoomRoute.post('/assign-teacher', authorizeAdmin, assignTeacherToClassroom)
classRoomRoute.post('/assign-student', authorizeAdmin, addStudentsToClassroom)