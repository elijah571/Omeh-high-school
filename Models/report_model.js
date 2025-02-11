import mongoose from "mongoose";

const reportSchema = new mongoose.Schema({
    student: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Student", 
        required: true 
    },
    classroom: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Classroom", 
        required: true 
    },
    year: { 
        type: Number, 
        required: true 
    },
    firstCA: {
        subjects: [
            {
                subjectName: { 
                    type: String, 
                    required: true 
                },
                score: { 
                    type: Number, 
                    required: true 
                },
                grade: { 
                    type: String, 
                    enum: ["A", "B", "C", "D"], 
                    required: true 
                },
                teacherComments: { 
                    type: String, 
                    default: "" 
                }
            }
        ]
    },
    secondCA: {
        subjects: [
            {
                subjectName: { 
                    type: String, 
                    required: true 
                },
                score: { 
                    type: Number, 
                    required: true 
                },
                grade: { 
                    type: String, 
                    enum: ["A", "B", "C", "D"], 
                    required: true 
                },
                teacherComments: { 
                    type: String, 
                    default: "" 
                }
            }
        ]
    },
    exam: {
        subjects: [
            {
                subjectName: { 
                    type: String, 
                    required: true 
                },
                score: { 
                    type: Number, 
                    required: true 
                },
                grade: { 
                    type: String, 
                    enum: ["A", "B", "C", "D"], 
                    required: true 
                },
                teacherComments: { 
                    type: String, 
                    default: "" 
                }
            }
        ]
    },
    total: { 
        type: String, 
        required: true 
    },
    teacherRemarks: { 
        type: String, 
        default: "" 
    }
}, { timestamps: true });

export const Report = mongoose.model("Report", reportSchema);
