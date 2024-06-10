"use client"
import { useState, useEffect } from "react";
import axios from "axios";
import { Modal, Button } from "flowbite-react";
import Link from "next/link";

const StudentsTable = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [isOpen, setIsOpen] = useState(false);
  const [currentStudent, setCurrentStudent] = useState(null);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios.post("/api/students",{});
        setStudents(response.data.data);
        setFilteredStudents(response.data.data);
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    };
    fetchStudents();
  }, []);

  useEffect(() => {
    let updatedStudents = [...students];

    if (searchQuery) {
      updatedStudents = updatedStudents.filter(
        (student) =>
          student.studentName
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          student.contactNumber
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
      );
    }

    if (sortField) {
      updatedStudents.sort((a, b) => {
        const aValue = a[sortField];
        const bValue = b[sortField];

        if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
        if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
        return 0;
      });
    }

    setFilteredStudents(updatedStudents);
  }, [students, searchQuery, sortField, sortOrder]);

  const handleSort = (field) => {
    const order = field === sortField && sortOrder === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortOrder(order);
  };

  const openModal = (student) => {
    setCurrentStudent(student);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setCurrentStudent(null);
  };

  const handleDelete = async (studentId) => {
    try {
      await axios.delete(`/api/deleteStudent/${studentId}`);
      setStudents(students.filter((student) => student._id !== studentId));
    } catch (error) {
      console.error("Error deleting student:", error);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/api/editStudent/${currentStudent._id}`, currentStudent);
      setStudents(
        students.map((student) =>
          student._id === currentStudent._id ? currentStudent : student
        )
      );
      closeModal();
    } catch (error) {
      console.error("Error updating student:", error);
    }
  };

  return (
    <div className="p-2 overflow-auto">
      <div className="m-[20px]">

      <Link href="/pages/Teacher/students/add" className="text-2xl font-bold bg-black     mb-4 text-white px-4 py-2 rounded-lg">Add Students</Link>
      </div>
      <input
        type="text"
        placeholder="Search by name or contact number"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="mb-4 p-2 border rounded"
      />
      <table className="min-w-full w- bg-white border border-gray-200">
        <thead>
          <tr>
            <th
              onClick={() => handleSort("studentName")}
              className="py-2 px-4 border-b cursor-pointer"
            >
              Student Name
            </th>
            <th
              onClick={() => handleSort("guardianName")}
              className="py-2 px-4 border-b cursor-pointer"
            >
              Guardian Name
            </th>
            <th
              onClick={() => handleSort("contactNumber")}
              className="py-2 px-4 border-b cursor-pointer"
            >
              Contact Number
            </th>
            <th
              onClick={() => handleSort("course")}
              className="py-2 px-4 border-b cursor-pointer"
            >
              Course
            </th>
            <th
              onClick={() => handleSort("courseDuration")}
              className="py-2 px-4 border-b cursor-pointer"
            >
              Course Duration
            </th>
            <th
              onClick={() => handleSort("instructor")}
              className="py-2 px-4 border-b cursor-pointer"
            >
              Instructor
            </th>
            <th
              onClick={() => handleSort("classStartTime")}
              className="py-2 px-4 border-b cursor-pointer"
            >
              Class Start Time
            </th>
            <th
              onClick={() => handleSort("admissionDate")}
              className="py-2 px-4 border-b cursor-pointer"
            >
              Admission Date
            </th>
            <th className="py-2 px-4 border-b">Monthly Fee Dates</th>
            <th className="py-2 px-4 border-b">Fee Payment Dates</th>
            <th className="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredStudents.map((student) => (
            <tr key={student._id}>
              <td className="py-2 px-4 border-b">{student.studentName}</td>
              <td className="py-2 px-4 border-b">{student.guardianName}</td>
              <td className="py-2 px-4 border-b">{student.contactNumber}</td>
              <td className="py-2 px-4 border-b">{student.course}</td>
              <td className="py-2 px-4 border-b">{student.courseDuration}</td>
              <td className="py-2 px-4 border-b">{student.instructor}</td>
              <td className="py-2 px-4 border-b">{student.classStartTime}</td>
              <td className="py-2 px-4 border-b">
                {new Date(student.admissionDate).toLocaleDateString()}
              </td>
              <td className="py-2 px-4 border-b">
                <ul>
                  {student.monthlyFeeDates &&
                    student.monthlyFeeDates.map((date, index) => (
                      <li key={index}>{new Date(date).toLocaleDateString()}</li>
                    ))}
                </ul>
              </td>
              <td className="py-2 px-4 border-b">
                <ul>
                  {student.feePaymentDates &&
                    student.feePaymentDates.map((date, index) => (
                      <li key={index}>
                        {date
                          ? new Date(date).toLocaleDateString()
                          : "Not Paid"}
                      </li>
                    ))}
                </ul>
              </td>
              <td className="py-2 px-4 border-b">
                <button
                  onClick={() => openModal(student)}
                  className="bg-blue-500 text-white px-2 py-1 rounded mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(student._id)}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal show={isOpen} onClose={closeModal}>
        <Modal.Header>Edit Student</Modal.Header>
        <Modal.Body>
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Student Name
              </label>
              <input
                type="text"
                value={currentStudent?.studentName || ""}
                onChange={(e) =>
                  setCurrentStudent({
                    ...currentStudent,
                    studentName: e.target.value,
                  })
                }
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Guardian Name
              </label>
              <input
                type="text"
                value={currentStudent?.guardianName || ""}
                onChange={(e) =>
                  setCurrentStudent({
                    ...currentStudent,
                    guardianName: e.target.value,
                  })
                }
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Contact Number
              </label>
              <input
                type="text"
                value={currentStudent?.contactNumber || ""}
                onChange={(e) =>
                  setCurrentStudent({
                    ...currentStudent,
                    contactNumber: e.target.value,
                  })
                }
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            {/* Add other fields as necessary */}
            <div className="flex items-center justify-end space-x-4">
              <Button type="button" onClick={closeModal}>
                Cancel
              </Button>
              <Button type="submit">Save</Button>
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default StudentsTable;

