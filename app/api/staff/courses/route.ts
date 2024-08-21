import { NextResponse } from "next/server";
import connectMongo from "@/app/api/dbconfigs/mongose";
import Course from "@/app/api/models/course";
import User from "@/app/api/models/user";

type QueryType = {
  instructor?: string;
  status?: string;
  courseStartDate?: { $gte: Date };
  courseEndDate?: { $lte: Date };
};

export const POST = async (request: Request) => {
  await connectMongo();
  const { action, ...data } = await request.json();

  try {
    if (action === "addCourse") {
      const newCourse = new Course(data);
      await newCourse.save();
      return NextResponse.json({ message: "Course added successfully" });
    } else if (action === "updateCourse") {
      const { id, ...updateData } = data;
      await Course.findByIdAndUpdate(id, updateData);
      return NextResponse.json({ message: "Course updated successfully" });
    } else if (action === "fetchCourses") {
      const { filters } = data;
      const query: QueryType = {};

      if (filters) {
        if (filters.instructor) query["instructor"] = filters.instructor;
        if (filters.status) query["status"] = filters.status;
        if (filters.startDate)
          query["courseStartDate"] = { $gte: new Date(filters.startDate) };
        if (filters.endDate)
          query["courseEndDate"] = { $lte: new Date(filters.endDate) };
      }

      const courses = await Course.find(query)
        .populate("instructor")
        .populate("students");
      return NextResponse.json({ courses });
    } else {
      return NextResponse.json({ message: "Invalid action" }, { status: 400 });
    }
  } catch (error: any) {
    console.log(error);
    return NextResponse.json(
      { message: "Error handling request", error },
      { status: 500 }
    );
  }
};
