"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "flowbite-react";

const AdminPage = () => {
  const router = useRouter();

  const handleManageInstructors = () => {
    router.push("/pages/admin/Accounts");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="space-y-4 text-center">
        <Button
          onClick={handleManageInstructors}
          className="w-64 mx-auto bg-black"
        >
          Manage Instructors
        </Button>
        Admin options
      </div>
    </div>
  );
};

export default AdminPage;
