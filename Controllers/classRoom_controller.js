import { Classroom } from "../Models/classRoom_model.js"; 
import { Teacher } from "../Models/teachers_model.js";
import { Student } from "../Models/student_model.js";

// Create a new Classroom
export const createClassroom = async (req, res) => {
    try {
        const { name, gradeLevel, department } = req.body;

        if (!name || !gradeLevel || !department) {
            return res.status(400).json({ message: "Classroom name and grade level are required" });
        }

        const classroom = new Classroom({
            name,
            gradeLevel,
            department,
            subjects: [], 
            students: [] 
        });

        await classroom.save();
        res.status(201).json({ message: "Classroom created successfully", classroom });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

// Assign Teacher to Classroom and Subject
export const assignTeacherToClassroom = async (req, res) => {
    try {
        const { classroomId, subjectName, teacherId, schedule } = req.body;

        if (!classroomId || !subjectName || !teacherId || !schedule) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Check if the classroom exists
        const classroom = await Classroom.findById(classroomId);
        if (!classroom) {
            return res.status(404).json({ message: "Classroom not found" });
        }

        // Check if the teacher exists
        const teacher = await Teacher.findById(teacherId);
        if (!teacher) {
            return res.status(404).json({ message: "Teacher not found" });
        }

        // Check if subject already exists in the classroom
        let subject = classroom.subjects.find(sub => sub.subjectName === subjectName);
        
        if (subject) {
            // If subject exists, just add the teacher to the teachers array and the schedule.
            subject.teachers.push(teacherId);
            subject.schedule = [...subject.schedule, ...schedule]; // Append the new schedule items
        } else {
            // If subject doesn't exist, create a new subject entry
            subject = {
                subjectName,
                teachers: [teacherId],
                schedule
            };
            classroom.subjects.push(subject);
        }

        await classroom.save();

        res.status(200).json({
            message: "Teacher assigned to classroom successfully",
            classroom
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

// Add Students to Classroom
export const addStudentsToClassroom = async (req, res) => {
    try {
        const { classroomId, studentIds } = req.body;  // studentIds is now an array

        if (!classroomId || !studentIds || !Array.isArray(studentIds)) {
            return res.status(400).json({ message: "Both classroom ID and an array of student IDs are required" });
        }

        // Check if the classroom exists
        const classroom = await Classroom.findById(classroomId);
        if (!classroom) {
            return res.status(404).json({ message: "Classroom not found" });
        }

        // Check if all students exist
        const students = await Student.find({ '_id': { $in: studentIds } });
        if (students.length !== studentIds.length) {
            return res.status(404).json({ message: "One or more students not found" });
        }

        // Add students to the classroom's students array (avoid duplicates)
        classroom.students = [...new Set([...classroom.students, ...studentIds])];

        await classroom.save();

        res.status(200).json({
            message: "Students added to classroom successfully",
            classroom
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

// Get all Classrooms with their Students and Teachers
export const getAllClassrooms = async (req, res) => {
    try {
        const classrooms = await Classroom.find()
            .populate('students')  
            .populate('subjects.teachers'); 

        if (classrooms.length === 0) {
            return res.status(404).json({ message: "No classrooms found" });
        }

        res.status(200).json({ classrooms });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};


//Get a classroom
export const getClassroom = async (req, res) => {
    try {
        const { classroomId } = req.params;

        const classroom = await Classroom.findById(classroomId).populate('students').populate('subjects.teachers');

        if (!classroom) {
            return res.status(404).json({ message: "Classroom not found" });
        }

        res.status(200).json({ classroom });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};


// Update Classroom details (including teachers, students, name, grade level)
export const updateClassroom = async (req, res) => {
    try {
        const { classroomId } = req.params;
        const { name, gradeLevel, department, teachers, students } = req.body; // Teachers and Students arrays for update

        // Check if classroom exists
        const classroom = await Classroom.findById(classroomId);
        if (!classroom) {
            return res.status(404).json({ message: "Classroom not found" });
        }

        // Update classroom name and grade level
        if (name) classroom.name = name;
        if(department) classroom.department = department;
        if (gradeLevel) classroom.gradeLevel = gradeLevel;

        // Update Teachers for the subjects
        if (teachers && Array.isArray(teachers)) {
            teachers.forEach(async (teacherInfo) => {
                const { subjectName, teacherId } = teacherInfo;

                // Check if the teacher exists
                const teacher = await Teacher.findById(teacherId);
                if (!teacher) {
                    return res.status(404).json({ message: `Teacher with ID ${teacherId} not found` });
                }

                // Check if the subject already exists in the classroom
                let subject = classroom.subjects.find(sub => sub.subjectName === subjectName);
                
                if (subject) {
                    // If subject exists, add the teacher to the teachers array (avoid duplicates)
                    if (!subject.teachers.includes(teacherId)) {
                        subject.teachers.push(teacherId);
                    }
                } else {
                    // If subject doesn't exist, create a new subject entry
                    subject = {
                        subjectName,
                        teachers: [teacherId],
                        schedule: [] // Empty schedule for now (can be updated later)
                    };
                    classroom.subjects.push(subject);
                }
            });
        }

        // Update Students for the classroom
        if (students && Array.isArray(students)) {
            // Check if all students exist
            const validStudents = await Student.find({ '_id': { $in: students } });
            if (validStudents.length !== students.length) {
                return res.status(404).json({ message: "One or more students not found" });
            }

            // Add students to the classroom's students array (avoid duplicates)
            classroom.students = [...new Set([...classroom.students, ...students])];
        }

        // Save the updated classroom
        await classroom.save();

        res.status(200).json({
            message: "Classroom updated successfully",
            classroom
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};