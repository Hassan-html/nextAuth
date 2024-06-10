import mongoose from "mongoose";

const StudentSchema = new mongoose.Schema({
  studentName: { type: String, required: true },
  guardianName: { type: String, required: true },
  contactNumber: { type: String, required: true },
  course: { type: String, required: true },
  courseDuration: { type: Number, required: true }, // In months
  instructor: { type: String, required: true },
  classStartTime: { type: String, required: true },
  admissionDate: { type: Date, required: true },
  admissionFeePaid: { type: Boolean, default: false },
  monthlyFeeDates: { type: [Date], required: true },
  feePaymentDates: { type: [Date], required: true },
});

export const studentModel= mongoose.models.Student ||
  mongoose.model("Student", StudentSchema);
