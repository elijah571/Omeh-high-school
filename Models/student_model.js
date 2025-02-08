import mongoose from "mongoose";
const studentSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    gender: { type: String, required: true },
    role: {type: String, default: 'Student', required: true},
    parent: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    DOB: { type: Date, required: true },
    address: { type: String, required: true },
               teachers:[ { type: mongoose.Schema.Types.ObjectId, ref: "Teacher", required: true },],
    image: {type: String, required: true}
}, { timestamps: true });

export const Student = mongoose.model("Student", studentSchema);
