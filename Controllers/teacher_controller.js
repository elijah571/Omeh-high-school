import bcryptjs from 'bcryptjs';
import { Teacher } from '../Models/teachers_model.js';
import { generateToken } from '../Utils/generateToken.js';

// Create Teacher
export const createTeacher = async (req, res) => {
    const {fullName, gender, email, password, phone, subject,} = req.fields;
    const image = req.files?.image ? req.files.image.path : null;

    try {
        if (!fullName || !gender || !email || !password || !phone || !subject  || !image) {
            return res.status(400).json({ message: "All fields are required to be filled" });
        }

        const existingTeacher = await Teacher.findOne({ email }).select('_id');
        if (existingTeacher) {
            return res.status(400).json({ message: "Email already in use" });
        }

        const hashPassword = await bcryptjs.hash(password, 10);

        const teacher = new Teacher({
            fullName,
            gender,
            email,
            password: hashPassword,
            phone,
            subject,
            image
        });

        await teacher.save();

        res.status(201).json({ teacher });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// Get All Teachers
export const getAllTeachers = async (req, res) => {
    try {
        const teachers = await Teacher.find();
        res.status(200).json(teachers);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

// Get Teacher by ID
export const getTeacherById = async (req, res) => {
    try {
        const teacher = await Teacher.findById(req.params.id);
        if (!teacher) {
            return res.status(404).json({ message: "Teacher not found" });
        }
        res.status(200).json(teacher);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

// Delete Teacher
export const deleteTeacher = async (req, res) => {
    try {
        const teacher = await Teacher.findByIdAndDelete(req.params.id);
        if (!teacher) {
            return res.status(404).json({ message: "Teacher not found" });
        }
        res.status(200).json({ message: "Teacher deleted successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

// Teacher Login
export const teacherLogin = async (req, res) => {
    const { email, password } = req.body;

    try {
        const teacher = await Teacher.findOne({ email });
        if (!teacher) {
            return res.status(400).json({ message: "Invalid email" });
        }

        const isCorrectPassword = await bcryptjs.compare(password, teacher.password);
        if (!isCorrectPassword) {
            return res.status(400).json({ message: "Invalid password" });
        }

        generateToken(res, { id: teacher._id });

        return res.status(200).json({
            message: "Login successful",
            teacher: {
                id: teacher._id,
                email: teacher.email,
                fullName: teacher.fullName
            }
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// Logout Teacher
export const logoutTeacher = async (req, res) => {
    res.clearCookie('token');
    return res.status(200).json({ message: "Teacher logged out successfully" });
};

// Update Teacher
export const updateTeacher = async (req, res) => {
    try {
        const teacher = await Teacher.findById(req.params.id);
        if (!teacher) {
            return res.status(404).json({ message: "Teacher not found" });
        }

        if (req.body.fullName) teacher.fullName = req.body.fullName;
        if (req.body.gender) teacher.gender = req.body.gender;
        if (req.body.email) teacher.email = req.body.email;
        if (req.body.phone) teacher.phone = req.body.phone;
        if (req.body.subject) teacher.subject = req.body.subject;
        if (req.body.image) teacher.image = req.body.image;

        await teacher.save();

        return res.status(200).json({
            message: "Profile updated successfully",
            teacher: {
                id: teacher._id,
                fullName: teacher.fullName,
                email: teacher.email,
                gender: teacher.gender,
                phone: teacher.phone,
                subject: teacher.subject,
                assignment: teacher.assignment,
                image: teacher.image || null
            }
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};
