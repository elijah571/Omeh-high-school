import mongoose from "mongoose";

// Define the attendance schema
const attendanceSchema = new mongoose.Schema({
  students: [
    { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Student", 
      required: true 
    }
  ],
  date: {
    type: Date,
    required: true,
  },
  checkIn: {
    type: String, 
    required: true,
  },
  checkOut: {
    type: String,
    required: true,
  },
  attendanceStatus: [
    {
      student: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Student",
        required: true
      },
      status: {
        type: String, 
        enum: ['present', 'absent', 'late'], // Ensuring valid values for status
        required: true
      }
    }
  ]
}, { 
  timestamps: true 
});

const Attendance = mongoose.model('Attendance', attendanceSchema);

export default Attendance;
