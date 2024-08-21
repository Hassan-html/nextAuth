import mongoose from "mongoose";

const CourseSchema = new mongoose.Schema(
  {
    courseName: { type: String, required: true },
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    }, // Reference to the User model (Instructor)
    students: [{ type: mongoose.Schema.Types.ObjectId }], // Array of students (can be added later)
    courseStartTime: { type: String, required: true }, // Start time in 12-hour format (e.g., "10:00 AM")
    courseEndTime: { type: String, required: true }, // End time in 12-hour format (e.g., "12:00 PM")
    courseStartDate: { type: Date, required: true }, // Start date of the course
    courseEndDate: { type: Date }, // End date of the course
    status: { type: String, enum: ["ongoing", "over"], default: "ongoing" }, // Course status
    comment: { type: String, default: "" }, // Optional comment field
  },
  { timestamps: true }
);

export default mongoose.models.Course || mongoose.model("Course", CourseSchema);
