import mongoose from "mongoose";

const FeeSchema = new mongoose.Schema({
  feesDate: { type: String, required: true }, // The expected date for the fee
  paidDate: { type: Date, default: null }, // The date when the fee was actually paid
  amount: { type: Number, default: null }, // The amount paid
});

const AdmissionFeeSchema = new mongoose.Schema({
  paidDate: { type: Date, default: null }, // The date when the admission fee was paid
  amount: { type: Number, default: null }, // The amount paid for admission
});

const AttendanceSchema = new mongoose.Schema({
  date: { type: Date }, // The date of the attendance record
  status: {
    type: String,
    enum: ["P", "A", "L"], // P: Present, A: Absent, L: Leave
  },
  topic: { type: String, default: "" }, // The topic covered on that date
});

const StudentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    guardianName: { type: String, required: true },
    cnic: { type: String, required: true },
    phone: { type: String, required: true },
    guardianPhone: { type: String, required: true },
    course: { type: String, required: true },
    instructor: { type: String, required: true },
    courseStartDate: { type: Date, required: true }, // Course start date
    classStartTime: { type: String, required: true }, // Class start time (e.g., "10:00 AM")
    courseDuration: { type: Number, required: true }, // Duration in months
    admissionFee: AdmissionFeeSchema, // Single admission fee with date and amount
    fees: [FeeSchema], // Array of monthly fees
    attendance: [AttendanceSchema], // Array of attendance records
  },
  { timestamps: true }
);

export default mongoose.models.student ||
  mongoose.model("student", StudentSchema);
