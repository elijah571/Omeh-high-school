import { Classroom } from "../Models/classRoom_model.js";
import { Student } from "../Models/student_model.js";
import {Attendance} from "../Models/attendance_model.js";  

// Create attendance

export const createAttendance = async (req, res) => {
    try {
        const { classroomId, attendanceStatus } = req.body;

        console.log('Creating attendance for classroomId:', classroomId);

        const classroom = await Classroom.findById(classroomId).populate('students');
        if (!classroom) {
            return res.status(404).json({ message: "Classroom not found" });
        }

        // Check if attendance for the given classroom already exists
        const existingAttendance = await Attendance.findOne({ classroomId });
        if (existingAttendance) {
            return res.status(400).json({ message: "Attendance for this classroom already exists" });
        }

        // Ensure all students in attendanceStatus exist in classroom
        const studentIds = classroom.students.map(student => student._id.toString());
        const invalidStudents = attendanceStatus.filter(status => !studentIds.includes(status.student.toString()));

        if (invalidStudents.length > 0) {
            return res.status(400).json({ message: "One or more students not found in this classroom" });
        }

        // Create a new attendance record
        const attendance = new Attendance({
            classroomId,  // Include the classroomId
            attendanceStatus,
            date: new Date()  // Use the current date
        });

        console.log('Attendance object to save:', attendance);

        // Save the attendance record
        await attendance.save();

        // Return classroom and student details along with the attendance status
        const populatedAttendance = await Attendance.findById(attendance._id)
            .populate('classroomId', 'name')  // Populate classroom details
            .populate({
                path: 'attendanceStatus.student',
            });

        res.status(201).json({
            message: "Attendance created successfully",
            populatedAttendance
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};


// Update Attendance for a specific classroom
export const updateAttendance = async (req, res) => {
    try {
        const { attendanceId } = req.params;
        const { attendanceStatus, checkIn, checkOut } = req.body;

        // Find the existing attendance record by ID
        const attendance = await Attendance.findById(attendanceId);
        if (!attendance) {
            return res.status(404).json({ message: "Attendance record not found" });
        }

        // Update attendance status for specific students (handle it carefully if it's an array)
        if (attendanceStatus) {
            attendanceStatus.forEach(status => {
                const existingStudent = attendance.attendanceStatus.find(att => att.student.toString() === status.student.toString());
                if (existingStudent) {
                    existingStudent.status = status.status;  // Update status
                } else {
                    attendance.attendanceStatus.push(status);  // Add new status if not existing
                }
            });
        }

        if (checkIn) {
            attendance.checkIn = checkIn;
        }
        if (checkOut) {
            attendance.checkOut = checkOut;
        }

        // Save the updated attendance record
        await attendance.save();

        // Return classroom and student details along with the updated attendance status
        const populatedAttendance = await Attendance.findById(attendance._id)
            .populate('classroomId', 'name')  // Populate classroom details
            .populate({
                path: 'attendanceStatus.student',
                select: 'name rollNo'  // Populate student details (customize as needed)
            });

        res.status(200).json({
            message: "Attendance updated successfully",
            populatedAttendance
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

// Get Attendance for a specific classroom with student info
export const getAttendanceWithStudentInfo = async (req, res) => {
    try {
        const { classroomId } = req.params;

        console.log('Getting attendance for classroomId:', classroomId);

        // Find the attendance for the given classroom and populate both classroom and student details
        const attendance = await Attendance.findOne({ classroomId })
            .populate('classroomId', 'name')  // Populate classroom details
            .populate({
                path: 'attendanceStatus.student'
                
            })
            .populate({
                path: 'classroomId.students', // Populate the students of the classroom as well
                select: 'name rollNo'  // Customize the fields you want to include from the student
            });

        if (!attendance) {
            return res.status(404).json({ message: `No attendance record found for classroom ID: ${classroomId}` });
        }

        res.status(200).json({
            message: "Attendance fetched successfully",
            attendance
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};


// Get Attendance for a specific student in a classroom
export const getSingleStudentAttendance = async (req, res) => {
    try {
        const { classroomId, studentId } = req.params;

        // Find the attendance record for the given classroomId and studentId
        const attendance = await Attendance.findOne({
            classroomId: classroomId,
            'attendanceStatus.student': studentId // Match student ID in attendance status
        }).populate({
            path: 'attendanceStatus.student', // Populate the student details in attendanceStatus
          
        })
        .populate('classroomId', 'name')  // Populate classroom details
        .populate({
            path: 'classroomId.students', // Populate the students of the classroom
            select: 'name rollNo'  // Customize the fields you want to include from the student
        });

        // Log the attendance data to check if it's correct
        console.log("Attendance record:", attendance);

        if (!attendance) {
            return res.status(404).json({ message: `No attendance record found for student ID: ${studentId} in classroom ID: ${classroomId}` });
        }

        // Now, we need to find the specific student's attendance from the attendanceStatus array
        const studentAttendance = attendance.attendanceStatus.find(status => status.student._id.toString() === studentId);

        if (!studentAttendance) {
            return res.status(404).json({ message: `No attendance status found for student ID: ${studentId}` });
        }

        // Send the student attendance as a response
        res.status(200).json({
            message: "Student attendance fetched successfully",
            studentAttendance
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};



// Delete Attendance for a specific classroom
export const deleteAttendance = async (req, res) => {
    try {
        const { classroomId } = req.params;

        // Find and delete the attendance for the given classroom
        const deletedAttendance = await Attendance.findOneAndDelete({
            classroomId,
        });

        if (!deletedAttendance) {
            return res.status(404).json({ message: "No attendance found to delete for this classroom" });
        }

        res.status(200).json({
            message: "Attendance deleted successfully",
            deletedAttendance
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};
