import { Classroom } from "../Models/classRoom_model.js"; 
import { Teacher } from "../Models/teachers_model.js";


// Create a new Classroom
export const createClassroom = async (req, res) => {
    try {
        const { name, gradeLevel } = req.body;

        if (!name || !gradeLevel) {
            return res.status(400).json({ message: "Classroom name and grade level are required" });
        }

        const classroom = new Classroom({
            name,
            gradeLevel,
            subjects: [], // Empty initially
            students: [] // Empty initially
        });

        await classroom.save();
        res.status(201).json({ message: "Classroom created successfully", classroom });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};
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

        // Assign teacher to the subject in the classroom
        classroom.subjects.push({
            subjectName,
            teacher: teacherId,
            schedule
        });

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
