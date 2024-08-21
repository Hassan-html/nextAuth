"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "flowbite-react";

const Page = () => {
  const router = useRouter();

  const handleManageCourses = () => {
    router.push("/pages/staff/courses");
  };
  const handleManageStudents = () => {
    router.push("/pages/staff/student");
  };
  const handleManageAttendences = () => {
    router.push("/pages/staff/atnd");
  };
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="space-y-4 text-center">
        <div className="flex gap-2">
          <Button
            onClick={handleManageCourses}
            className="w-64 mx-auto bg-black"
          >
            Manage Courses
          </Button>
          <Button
            onClick={handleManageStudents}
            className="w-64 mx-auto bg-black"
          >
            Manage Students
          </Button>
          <Button
            onClick={handleManageAttendences}
            className="w-64 mx-auto bg-black"
          >
            Manage attendences
          </Button>
        </div>
        Staff Options
      </div>
    </div>
  );
};

export default Page;
