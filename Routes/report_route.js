import express from 'express';
import { createReport, deleteAllReports, deleteStudentReport, getAllReports, getStudentReportById, updateAllReports, updateStudentReport } from '../Controllers/report_controller.js';

export const reportRoute = express.Router()

//create report

reportRoute.post('/', createReport);
//get all report
reportRoute.get('/', getAllReports);
//get a student report
reportRoute.get('/:studentId', getStudentReportById)
//Update all reports
reportRoute.put('/', updateAllReports);
reportRoute.put('/:studentId', updateStudentReport)
//Delete all report
reportRoute.delete('/', deleteAllReports)
//Delete a student report
reportRoute.delete('/:studentId', deleteStudentReport)