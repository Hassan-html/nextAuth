import { NextResponse } from "next/server";
import connectMongo from "@/app/api/dbconfigs/mongose";
import Student from "@/app/api/models/student";

export const POST = async (request: Request) => {
  await connectMongo();
  const { action, instructorId, courseId, date, topic, attendance } =
    await request.json();

  try {
    if (action === "fetchInstructors") {
      const instructors = await Student.distinct("instructor");
      return NextResponse.json({ instructors });
    } else if (action === "fetchCoursesByInstructor") {
      const courses = await Student.find({ instructor: instructorId }).distinct(
        "course"
      );
      return NextResponse.json({ courses });
    } else if (action === "fetchStudentsByCourse") {
      const students = await Student.find({ course: courseId });
      return NextResponse.json({ students });
    } else if (action === "saveAttendance") {
      const updates = attendance.map((record: any) => {
        return Student.updateOne(
          { _id: record.studentId },
          {
            $push: {
              attendance: {
                date: new Date(date),
                status: record.status,
                topic,
              },
            },
          }
        );
      });
      await Promise.all(updates);
      return NextResponse.json({ message: "Attendance saved successfully" });
    } else {
      return NextResponse.json({ message: "Invalid action" }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json(
      { message: "Error handling request", error },
      { status: 500 }
    );
  }
};
