import {connect} from "@/app/models/dbconfig/mongoCon";
import {studentModel} from "./studentModel";
import { NextResponse,NextRequest } from "next/server";

export  async function POST(req:NextRequest) {
    const body = await req.json();
    console.log(body)
   try {
    await connect();
     const newStudent = new studentModel(body);

     const saved=await newStudent.save();
     console.log(saved)
     return NextResponse.json({ message: "added" }, { status: 200 });
   } catch (error) {
     return NextResponse.json({ message: "Error" }, { status: 400 });
   }
}
