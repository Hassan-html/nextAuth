import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/app/models/dbconfig/mongoCon";
import { staffModel } from "@/app/models/schemas/TeacherSchema";
export const POST = async (req: NextRequest) => {
  const body = await req.json();
  const { email, psw, Role, name } = body;
  try {
    await connect();
    const staff = await staffModel.create({
      name: name,
      email: email,
      psw: psw,
      Role: Role,
    });
    const savedStaff = await staff.save();
    console.log(savedStaff);
    return NextResponse.json({
      message: "Account Register wait for admin approval",
    });
  } catch (error) {
    console.log("error while saving user: " + error);
    return NextResponse.json(
      {
        message: "seems like there's an error try again",
      },
      { status: 500 }
    );
  }
};
