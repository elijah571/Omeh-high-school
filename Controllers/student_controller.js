import mongoose from 'mongoose';
import { Student } from '../Models/student_model.js';


// Create Student
export const createStudent = async (req, res) => {
    const { fullName, gender, parent, email, phone, DOB, address } = req.fields;
    const image = req.files?.image ? req.files.image.path : null;

    // Ensure teachers is properly parsed and converted into an array of ObjectIds
    let teachersArray = [];
    if (req.fields.teachers) {
        if (Array.isArray(req.fields.teachers)) {
            // If teachers is already an array, map directly
            teachersArray = req.fields.teachers.map(id => new mongoose.Types.ObjectId(id.trim()));
        } else if (typeof req.fields.teachers === "string") { 
            // If it's a string, split and convert to ObjectId
            teachersArray = req.fields.teachers.split(",").map(id => new mongoose.Types.ObjectId(id.trim()));
        }
    }

    try {
        if (!fullName || !gender || !parent || !email || !phone || !DOB || !address || teachersArray.length === 0 || !image) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const existingStudent = await Student.findOne({ email }).select('_id');
        if (existingStudent) {
            return res.status(400).json({ message: "Email already in use" });
        }

        const student = new Student({
            fullName,
            gender,
            parent,
            email,
            phone,
            DOB,
            address,
            teachers: teachersArray,
            image
        });

        await student.save();

        res.status(201).json({ student });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server Error", error: error.message });
    }
};


// Get All Students
export const getAllStudents = async (req, res) => {
    try {
        const students = await Student.find().populate("teachers");
        res.status(200).json(students);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

// Get Student by ID
export const getStudentById = async (req, res) => {
    try {
        const student = await Student.findById(req.params.id).populate("teachers");
        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }
        res.status(200).json(student);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

// Delete Student
export const deleteStudent = async (req, res) => {
    try {
        const student = await Student.findByIdAndDelete(req.params.id);
        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }
        res.status(200).json({ message: "Student deleted successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

// Update Student
export const updateStudent = async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);
        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }

        if (req.body.fullName) student.fullName = req.body.fullName;
        if (req.body.gender) student.gender = req.body.gender;
        if (req.body.parent) student.parent = req.body.parent;
        if (req.body.email) student.email = req.body.email;
        if (req.body.phone) student.phone = req.body.phone;
        if (req.body.DOB) student.DOB = req.body.DOB;
        if (req.body.address) student.address = req.body.address;
        if (req.body.teachers) student.teachers = req.body.teachers;
        if (req.body.image) student.image = req.body.image;

        await student.save();

        return res.status(200).json({
            message: "Profile updated successfully",
            student
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};
