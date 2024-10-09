import { NextResponse } from "next/server";
import connectMongo from "@/app/api/dbconfigs/mongose";
import Student from "@/app/api/models/student";
import Course from "@/app/api/models/course"; // Assuming you have a Course model

interface AdmissionFee {
  paidDate?: Date;
  amount?: number;
}

interface Fee {
  feesDate: string;
  paidDate?: Date;
  amount?: number;
}

interface StudentData {
  name: string;
  guardianName: string;
  cnic: string;
  phone: string;
  guardianPhone: string;
  course: string;
  instructor: string;
  courseStartDate: Date;
  classStartTime: string;
  courseDuration: number;
  admissionFee: AdmissionFee;
  fees: Fee[];
}

interface Filters {
  cnic?: string;
  phone?: string;
  course?: string;
  instructor?: string;
  feeDue?: boolean;
}

export const POST = async (request: Request) => {
  await connectMongo();
  const { action, ...data } = (await request.json()) as {
    action: string;
    filters?: Filters;
  } & Partial<StudentData>;

  try {
    if (action === "addStudent") {
      const newStudent = new Student(data as StudentData);
      await newStudent.save();

      // Add the student to the course's students array by course ID
      await Course.findByIdAndUpdate(data.course, {
        $push: { students: newStudent._id },
      });

      return NextResponse.json({ message: "Student added successfully" });
    } else if (action === "updateStudent") {
      const { id, ...updateData } = data as {
        id: string;
      } & Partial<StudentData>;
      const updatedStudent = await Student.findByIdAndUpdate(id, updateData, {
        new: true,
      });

      // If course is updated, ensure the student is in the correct course
      if (updateData.course) {
        await Course.findOneAndUpdate(
          { students: id },
          { $pull: { students: id } }
        );

        await Course.findByIdAndUpdate(updateData.course, {
          $push: { students: id },
        });
      }

      return NextResponse.json({ message: "Student updated successfully" });
    } else if (action === "deleteStudent") {
      const { id } = data as { id: string };

      // Remove the student from the course's students array
      await Course.findOneAndUpdate(
        { students: id },
        { $pull: { students: id } }
      );

      await Student.findByIdAndDelete(id);
      return NextResponse.json({ message: "Student deleted successfully" });
    } else if (action === "fetchStudents") {
      const { filters } = data;
      let query: any = {};

      if (filters) {
        if (filters.cnic) query["cnic"] = filters.cnic;
        if (filters.phone) query["phone"] = filters.phone;
        if (filters.course) query["course"] = filters.course;
        if (filters.instructor) query["instructor"] = filters.instructor;
      }

      let students = await Student.find(query);

      // Sort students by name (example sorting, adjust as needed)
      students = students.sort((a, b) => a.name.localeCompare(b.name));

      // Apply additional filter for feeDue if requested
      if (filters && filters.feeDue) {
        students = students.filter((student) =>
          student.fees.some(
            (fee: any) => !fee.paidDate && new Date(fee.feesDate) < new Date()
          )
        );
      }

      return NextResponse.json({ students });
    } else if (action === "updateFees") {
      const { id, fees } = data as { id: string; fees: Fee[] };
      await Student.findByIdAndUpdate(id, { fees });
      return NextResponse.json({ message: "Fees updated successfully" });
    } else {
      return NextResponse.json({ message: "Invalid action" }, { status: 400 });
    }
  } catch (error: any) {
    console.error("Error handling request:", error);
    return NextResponse.json(
      { message: "Error handling request", error },
      { status: 500 }
    );
  }
};
