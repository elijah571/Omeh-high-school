import { Report } from "../Models/report_model.js";
import { Student } from "../Models/student_model.js";
import { Classroom } from "../Models/classRoom_model.js";

// Create Termly Report for a Student with auto-calculated total
export const createReport = async (req, res) => {
    try {
        const { studentId, classroomId, term, firstCA, secondCA, exam, teacherRemarks } = req.body;

        // Validate the input fields
        if (!studentId || !classroomId || !term || !firstCA || !secondCA || !exam) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Find the student and classroom to ensure they exist
        const student = await Student.findById(studentId);
        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }

        const classroom = await Classroom.findById(classroomId);
        if (!classroom) {
            return res.status(404).json({ message: "Classroom not found" });
        }

        // Calculate the total score (sum of firstCA, secondCA, and exam scores)
        const totalScore = (firstCA.subjects.reduce((acc, subject) => acc + subject.score, 0) +
                            secondCA.subjects.reduce((acc, subject) => acc + subject.score, 0) +
                            exam.subjects.reduce((acc, subject) => acc + subject.score, 0));

        // Create a new Report
        const report = new Report({
            student: studentId,
            classroom: classroomId,
            term,
            firstCA: firstCA,
            secondCA: secondCA,
            exam: exam,
            total: totalScore.toString(), // Storing the total as a string
            teacherRemarks
        });

        // Save the report
        await report.save();

        res.status(201).json({ message: "Termly report created successfully", report });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// Get All Reports
export const getAllReports = async (req, res) => {
    try {
        const reports = await Report.find()
            .populate('student')
            .populate('classroom');

        if (reports.length === 0) {
            return res.status(404).json({ message: "No reports found" });
        }

        res.status(200).json({ reports });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

// Get Student Report by Student ID
export const getStudentReportById = async (req, res) => {
    try {
        const { studentId } = req.params;

        // Logging to debug and check if the studentId is coming as expected
        console.log("Fetching report for Student ID:", studentId);

        // Querying the report by studentId and populating student and classroom
        const report = await Report.findOne({ student: studentId })
            .populate('student')  // Ensure it's correctly populated
            .populate('classroom'); // Ensure it's correctly populated

        // Log the found report for debugging
        console.log("Found Report:", report);

        // If no report is found, return 404
        if (!report) {
            return res.status(404).json({ message: "Report not found for this student" });
        }

        // Send the found report back in the response
        res.status(200).json({ report });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

// Update All Reports (e.g., update teacher remarks for all reports)
export const updateAllReports = async (req, res) => {
    try {
        const { teacherRemarks } = req.body;

        if (!teacherRemarks) {
            return res.status(400).json({ message: "Teacher remarks are required" });
        }

        const reports = await Report.updateMany({}, { $set: { teacherRemarks } });

        res.status(200).json({ message: `${reports.modifiedCount} reports updated successfully` });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

// Update a Single Student's Report by Student ID
export const updateStudentReport = async (req, res) => {
    try {
        const { studentId } = req.params;
        const { firstCA, secondCA, exam, teacherRemarks } = req.body;

        // Validate that at least one field is provided for update
        if (!firstCA && !secondCA && !exam && !teacherRemarks) {
            return res.status(400).json({ message: "No fields provided to update" });
        }

        
        const report = await Report.findOne({ student: studentId });

        if (!report) {
            return res.status(404).json({ message: "Report not found" });
        }

        // Update report fields
        if (firstCA) report.firstCA = firstCA;
        if (secondCA) report.secondCA = secondCA;
        if (exam) report.exam = exam;
        if (teacherRemarks) report.teacherRemarks = teacherRemarks;

        // Recalculate the total score
        const totalScore = (firstCA.subjects.reduce((acc, subject) => acc + subject.score, 0) +
                            secondCA.subjects.reduce((acc, subject) => acc + subject.score, 0) +
                            exam.subjects.reduce((acc, subject) => acc + subject.score, 0));

        report.total = totalScore.toString(); // Update the total score

        await report.save();

        res.status(200).json({ message: "Student report updated successfully", report });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

// Delete All Reports
export const deleteAllReports = async (req, res) => {
    try {
        // Delete all reports from the database
        const result = await Report.deleteMany({});

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: "No reports found to delete" });
        }

        res.status(200).json({ message: `${result.deletedCount} reports deleted successfully` });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

// Delete a Single Student's Report (only delete the report, not the student)
export const deleteStudentReport = async (req, res) => {
    try {
        const { studentId } = req.params; // Access studentId from route parameters

        console.log("Attempting to delete report for student with ID:", studentId);

        if (!studentId) {
            return res.status(400).json({ message: "Student ID is required" });
        }

        // Find the student by ID to make sure the student exists
        const student = await Student.findById(studentId);

        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }

        // Delete the associated report of the student first
        const report = await Report.findOneAndDelete({ student: studentId });

        if (!report) {
            return res.status(404).json({ message: "Report not found for this student" });
        }

        res.status(200).json({ message: "Student's report successfully deleted" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};
