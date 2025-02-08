import mongoose from "mongoose";

const teacherSchema = new mongoose.Schema({
    fullName: {type: String, required: true},
    gender: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    phone: {type: String, required: true},
    subject: {type: String, required: true},
    role: {type: String,   default:"Teacher", required: true},
    image:{type: String, required: true}

},{timestamps: true})
export const Teacher = mongoose.model('Teacher', teacherSchema)