import { Classroom } from "../Models/classRoom_model.js";
import { Student } from "../Models/student_model.js";
import Attendance from "../Models/attendance_model.js";  

// Create Attendance for a Classroom on a specific date
export const createAttendance = async (req, res) => {
    try {
        const { classroomId, date, checkIn, checkOut, attendanceStatus } = req.body;

        // Check if classroom exists
        const classroom = await Classroom.findById(classroomId).populate('students');
        if (!classroom) {
            return res.status(404).json({ message: "Classroom not found" });
        }

        // Check if all student IDs in attendanceStatus exist in the classroom's students list
        const studentIds = classroom.students.map(student => student._id.toString());
        const invalidStudents = attendanceStatus.filter(status => !studentIds.includes(status.student.toString()));

        if (invalidStudents.length > 0) {
            return res.status(400).json({ message: "One or more students not found in this classroom" });
        }

        // Create a new attendance record
        const attendance = new Attendance({
            students: classroom.students,
            date,
            checkIn,
            checkOut,
            attendanceStatus,
        });

        // Save the attendance
        await attendance.save();

        res.status(201).json({
            message: "Attendance created successfully",
            attendance,
            classroom,  // Include classroom info in the response
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

// Update Attendance for a specific date and classroom
export const updateAttendance = async (req, res) => {
    try {
        const { attendanceId } = req.params;
        const { attendanceStatus, checkIn, checkOut } = req.body;

        // Find the existing attendance record by ID
        const attendance = await Attendance.findById(attendanceId);
        if (!attendance) {
            return res.status(404).json({ message: "Attendance record not found" });
        }

        // Update the attendance status and checkIn/checkOut times
        if (attendanceStatus) {
            attendance.attendanceStatus = attendanceStatus;
        }
        if (checkIn) {
            attendance.checkIn = checkIn;
        }
        if (checkOut) {
            attendance.checkOut = checkOut;
        }

        // Save the updated attendance record
        await attendance.save();

        res.status(200).json({
            message: "Attendance updated successfully",
            attendance
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};
// Get Attendance for a specific Classroom on a given date
export const getAttendanceByClassroomAndDate = async (req, res) => {
    try {
        const { classroomId, date } = req.params;

        // Find the attendance record by classroom and date
        const attendance = await Attendance.findOne({ classroomId, date }).populate('students');
        
        if (!attendance) {
            return res.status(404).json({ message: "Attendance not found for this date" });
        }

        res.status(200).json({
            message: "Attendance records retrieved successfully",
            attendance
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};
// Get Attendance for a specific Student in a specific Classroom on a given date
export const getStudentAttendance = async (req, res) => {
    try {
        const { classroomId, studentId, date } = req.params;

        // Find the attendance record for the specific classroom and date
        const attendance = await Attendance.findOne({ classroomId, date })
            .populate({
                path: 'students',
                match: { _id: studentId }  // Filter by studentId
            });

        if (!attendance) {
            return res.status(404).json({ message: "Attendance not found for this student on this date" });
        }

        // Check if the student is in the attendance record
        const studentAttendance = attendance.students.find(student => student._id.toString() === studentId);

        if (!studentAttendance) {
            return res.status(404).json({ message: "Student not found in the attendance record" });
        }

        res.status(200).json({
            message: "Student's attendance retrieved successfully",
            studentAttendance
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};
