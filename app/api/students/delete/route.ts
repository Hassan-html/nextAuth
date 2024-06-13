import { connect } from "@/app/models/dbconfig/mongoCon";
import { studentModel } from "@/app/api/students/add/studentModel";
import { NextResponse, NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();


  console.log(body);
  try {
    await connect();

    const students = await studentModel.findByIdAndDelete({_id:body._id});

    console.log(students);
    return NextResponse.json({ data: students }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Error" }, { status: 400 });
  }
}
