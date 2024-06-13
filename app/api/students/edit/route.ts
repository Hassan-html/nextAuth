import { connect } from "@/app/models/dbconfig/mongoCon";
import { studentModel } from "@/app/api/students/add/studentModel";
import { NextResponse, NextRequest } from "next/server";

export async function POST(req: NextRequest) {
 
    const body=await req.json();

    const {studentName,guardianName,contactNumber,course,courseDuration,instructor,classStartTime,admissionDate,admissionFeePaid,monthlyFeeDates,feePaymentDates}=body
    const data = {
      studentName,
      guardianName,
      contactNumber,
      course,
      courseDuration,
      instructor,
      classStartTime,
      admissionDate,
      admissionFeePaid,
      monthlyFeeDates,
      feePaymentDates,
    };

    console.log(
      body._id,
      data
    );
  try {
    await connect();
    const students = await studentModel.findByIdAndUpdate(body._id, body, {
      new: true,
      runValidators: true,
    });

    console.log(students);
    return NextResponse.json({ data: students }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Error" }, { status: 400 });
  }
}
