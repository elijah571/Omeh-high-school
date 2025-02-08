import mongoose from "mongoose";

const classroomSchema = new mongoose.Schema({
    name: { type: String, required: true },
    gradeLevel: { type: String, required: true },
    department: {type: String, required: true},

    subjects: [
        {
            subjectName: { type: String, required: true },
            teachers:[ { type: mongoose.Schema.Types.ObjectId, ref: "Teacher", required: true },],
            schedule: [
                {
                    day: { type: String, required: true },
                    startTime: { type: String, required: true },
                    endTime: { type: String, required: true }
                }
            ]
        }
    ],
    students: [{ type: mongoose.Schema.Types.ObjectId, ref: "Student" }]  
}, { timestamps: true });

export const Classroom = mongoose.model("Classroom", classroomSchema);
