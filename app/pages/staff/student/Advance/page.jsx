"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { Button, TextInput } from "flowbite-react";
import { Label, Table, Select, Spinner, Alert, Modal } from "flowbite-react";
const StudentManagementPage = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [filters, setFilters] = useState({
    cnic: "",
    phone: "",
    course: "",
    instructor: "",
    feeDue: false,
  });
  const [instructors, setInstructors] = useState([]);
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    guardianName: "",
    cnic: "",
    phone: "",
    guardianPhone: "",
    course: "",
    instructor: "",
    courseStartDate: "",
    classStartTime: "",
    courseDuration: "",
    admissionFee: {
      paidDate: "",
      amount: "",
    },
    fees: [],
  });
  const [editingStudentId, setEditingStudentId] = useState(null);
  const router = useRouter();

  useEffect(() => {
    fetchInstructorsAndCourses();
    fetchStudents();
  }, []);

  const fetchInstructorsAndCourses = async () => {
    try {
      setLoading(true);
      const instructorsResponse = await axios.post("/api/admin", {
        action: "fetch",
      });
      const coursesResponse = await axios.post("/api/staff/courses", {
        action: "fetchCourses",
      });

      instructorsResponse.data.filter((user) => user.type === "instructor");
      setCourses(coursesResponse.data.courses || []);
      setLoading(false);
    } catch (error) {
      setError("Error fetching instructors and courses.");
      setLoading(false);
    }
  };

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await axios.post("/api/staff", {
        action: "fetchStudents",
        filters,
      });
      setStudents(response.data.students || []);
      setFilteredStudents(response.data.students || []);
      setLoading(false);
    } catch (error) {
      setError("Error fetching students.");
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;
    const updatedFilters = {
      ...filters,
      [name]: type === "checkbox" ? checked : value,
    };
    setFilters(updatedFilters);
    filterStudents(updatedFilters);
  };

  const filterStudents = (filters) => {
    let filteredStudents = students;

    if (filters.cnic.trim() !== "") {
      filteredStudents = filteredStudents.filter((student) =>
        student.cnic.includes(filters.cnic.trim())
      );
    }

    if (filters.phone.trim() !== "") {
      filteredStudents = filteredStudents.filter((student) =>
        student.phone.includes(filters.phone.trim())
      );
    }

    if (filters.course !== "") {
      filteredStudents = filteredStudents.filter(
        (student) => student.course === filters.course
      );
    }

    if (filters.instructor !== "") {
      filteredStudents = filteredStudents.filter(
        (student) => student.instructor === filters.instructor
      );
    }

    if (filters.feeDue) {
      filteredStudents = filteredStudents.filter((student) => {
        const unpaidFees = student.fees.some((fee) => !fee.paidDate);
        return unpaidFees;
      });
    }

    setFilteredStudents(filteredStudents);
  };

  const handleInstructorChange = (e) => {
    const selectedInstructor = e.currentTarget.value;
    setFormData({ ...formData, instructor: selectedInstructor });
    setFilteredCourses(
      courses.filter(
        (course) =>
          course.instructor === selectedInstructor &&
          course.status === "ongoing"
      )
    );
  };

  const handleCourseDurationChange = (e) => {
    const courseDuration = parseInt(e.target.value);
    const fees = generateFees(formData.courseStartDate, courseDuration);

    setFormData({
      ...formData,
      courseDuration: courseDuration,
      fees: fees,
    });
  };

  const handleCourseChange = (e) => {
    const selectedCourse = courses.find(
      (course) => course._id === e.target.value
    );

    if (selectedCourse) {
      const fees = generateFees(
        selectedCourse.courseStartDate,
        formData.courseDuration || selectedCourse.courseDuration
      );

      setFormData({
        ...formData,
        course: selectedCourse._id,
        courseStartDate: dayjs(selectedCourse.courseStartDate).format(
          "YYYY-MM-DD"
        ),
        classStartTime: selectedCourse.courseStartTime,
        courseDuration:
          formData.courseDuration || selectedCourse.courseDuration,
        fees: fees,
      });
    }
  };

  const generateFees = (startDate, duration) => {
    const fees = [];
    for (let i = 0; i < duration; i++) {
      const feeDate = dayjs(startDate).add(i, "month").format("YYYY-MM-DD");
      fees.push({
        feesDate: feeDate,
        paidDate: null,
        amount: 0,
      });
    }
    return fees;
  };

  const handleFeeDueChange = () => {
    setFilters({ ...filters, feeDue: !filters.feeDue });
    filterStudents({ ...filters, feeDue: !filters.feeDue });
  };

  const updateFees = async (id, updatedFees) => {
    try {
      await axios.put(`/api/students/${id}/fees`, { fees: updatedFees });
      fetchStudents();
    } catch (error) {
      setError("Error updating fees.");
    }
  };

  const handleAddStudent = () => {
    setFormData({
      name: "",
      guardianName: "",
      cnic: "",
      phone: "",
      guardianPhone: "",
      course: "",
      instructor: "",
      courseStartDate: "",
      classStartTime: "",
      courseDuration: "",
      admissionFee: {
        paidDate: "",
        amount: "",
      },
      fees: [],
    });
    setEditingStudentId(null);
    setShowModal(true);
  };

  const handleEditStudent = (student) => {
    const selectedCourse = courses.find(
      (course) => course._id === student.course
    );

    setFormData({
      name: student.name,
      guardianName: student.guardianName,
      cnic: student.cnic,
      phone: student.phone,
      guardianPhone: student.guardianPhone,
      course: student.course,
      instructor: student.instructor,
      courseStartDate: dayjs(student.courseStartDate).format("YYYY-MM-DD"),
      classStartTime: student.classStartTime,
      courseDuration: student.courseDuration,
      admissionFee: student.admissionFee,
      fees: student.fees,
    });

    setFilteredCourses(
      courses.filter((course) => course.instructor === student.instructor)
    );

    setEditingStudentId(student._id);
    setShowModal(true);
  };

  const handleCourseStartDateChange = (e) => {
    const courseStartDate = e.target.value;
    const fees = generateFees(courseStartDate, formData.courseDuration);

    setFormData({
      ...formData,
      courseStartDate: courseStartDate,
      fees: fees,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const action = editingStudentId ? "updateStudent" : "addStudent";
      const payload = { action, ...formData };
      if (editingStudentId) {
        payload.id = editingStudentId;
      }
      await axios.post("/api/staff", payload);
      fetchStudents();
      setShowModal(false);
    } catch (error) {
      setError(`Failed to ${editingStudentId ? "update" : "add"} student.`);
    }
  };

  const handleFeeChange = (index, e) => {
    const newFees = [...formData.fees];
    newFees[index][e.target.name] = e.target.value;
    setFormData({ ...formData, fees: newFees });
  };

  const handleAdmissionFeeChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      admissionFee: { ...formData.admissionFee, [name]: value },
    });
  };

  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold my-4">Student Management</h1>

      {/* Filters */}
      <div className="flex space-x-4 my-4">
        <input
          type="text"
          name="cnic"
          value={filters.cnic}
          onChange={handleFilterChange}
          placeholder="CNIC"
          className="border border-gray-300 rounded px-2 py-1 w-48"
        />
        <input
          type="text"
          name="phone"
          value={filters.phone}
          onChange={handleFilterChange}
          placeholder="Phone"
          className="border border-gray-300 rounded px-2 py-1 w-48"
        />
        <select
          name="course"
          value={filters.course}
          onChange={handleFilterChange}
          className="border border-gray-300 rounded px-2 py-1 w-48"
        >
          <option value="">All Courses</option>
          {courses.map((course) => (
            <option key={course._id} value={course._id}>
              {course.courseName}
            </option>
          ))}
        </select>
        <select
          name="instructor"
          value={filters.instructor}
          onChange={handleFilterChange}
          className="border border-gray-300 rounded px-2 py-1 w-48"
        >
          <option value="">All Instructors</option>
          {instructors.map((instructor) => (
            <option key={instructor._id} value={instructor._id}>
              {instructor.name}
            </option>
          ))}
        </select>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="feeDue"
            checked={filters.feeDue}
            onChange={handleFeeDueChange}
            className="form-checkbox h-5 w-5 text-blue-600"
          />
          <span className="text-gray-700">Fee Due</span>
        </label>
      </div>

      {/* Student List */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-100 border-b border-gray-300">
              <th className="border-r border-gray-300 px-4 py-2">Name</th>
              <th className="border-r border-gray-300 px-4 py-2">CNIC</th>
              <th className="border-r border-gray-300 px-4 py-2">Phone</th>
              <th className="border-r border-gray-300 px-4 py-2">Course</th>
              <th className="border-r border-gray-300 px-4 py-2">Instructor</th>
              <th className="border-r border-gray-300 px-4 py-2">Fee Status</th>
              <th className="border-gray-300 px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((student) => (
              <tr key={student._id}>
                <td className="border-r border-gray-300 px-4 py-2">
                  {student.name}
                </td>
                <td className="border-r border-gray-300 px-4 py-2">
                  {student.cnic}
                </td>
                <td className="border-r border-gray-300 px-4 py-2">
                  {student.phone}
                </td>
                <td className="border-r border-gray-300 px-4 py-2">
                  {student.course}
                </td>
                <td className="border-r border-gray-300 px-4 py-2">
                  {student.instructor}
                </td>
                <td className="border-r border-gray-300 px-4 py-2">
                  {student.fees.some((fee) => !fee.paidDate) ? "Due" : "Paid"}
                </td>
                <td className="px-4 py-2">
                  <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded mr-2"
                    onClick={() => handleEditStudent(student)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                    onClick={() => handleDeleteStudent(student._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Student Button */}
      <div className="mt-4">
        <button
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          onClick={handleAddStudent}
        >
          Add Student
        </button>
      </div>

      {/* Modal for adding/editing student */}
      <Modal show={showModal} onClose={() => setShowModal(false)}>
        <Modal.Header>
          {editingStudentId ? "Update Student" : "Add Student"}
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <Label htmlFor="name" value="Student Name" />
              <TextInput
                id="name"
                type="text"
                name="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Student Name"
              />
            </div>
            <div className="mb-4">
              <Label htmlFor="guardianName" value="Guardian Name" />
              <TextInput
                id="guardianName"
                type="text"
                name="guardianName"
                value={formData.guardianName}
                onChange={(e) =>
                  setFormData({ ...formData, guardianName: e.target.value })
                }
                placeholder="Guardian Name"
              />
            </div>
            <div className="mb-4">
              <Label htmlFor="cnic" value="CNIC" />
              <TextInput
                id="cnic"
                type="text"
                name="cnic"
                value={formData.cnic}
                onChange={(e) =>
                  setFormData({ ...formData, cnic: e.target.value })
                }
                placeholder="CNIC"
              />
            </div>
            <div className="mb-4">
              <Label htmlFor="phone" value="Phone" />
              <TextInput
                id="phone"
                type="text"
                name="phone"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                placeholder="Phone"
              />
            </div>
            <div className="mb-4">
              <Label htmlFor="guardianPhone" value="Guardian Phone" />
              <TextInput
                id="guardianPhone"
                type="text"
                name="guardianPhone"
                value={formData.guardianPhone}
                onChange={(e) =>
                  setFormData({ ...formData, guardianPhone: e.target.value })
                }
                placeholder="Guardian Phone"
              />
            </div>
            <div className="mb-4">
              <Label htmlFor="instructor" value="Instructor" />
              <Select
                id="instructor"
                name="instructor"
                value={formData.instructor}
                onChange={handleInstructorChange}
              >
                <option value="" disabled>
                  Select Instructor
                </option>
                {instructors.map((instructor) => (
                  <option key={instructor._id} value={instructor._id}>
                    {instructor.name}
                  </option>
                ))}
              </Select>
            </div>

            <div className="mb-4">
              <Label htmlFor="course" value="Course" />

              <Select
                id="course"
                name="course"
                value={formData.course}
                onChange={handleCourseChange}
              >
                <option value="" disabled>
                  Select Course
                </option>
                {filteredCourses.map((course) => (
                  <option key={course._id} value={course._id}>
                    {course.courseName} - {course.courseStartTime} -{" "}
                    {dayjs(course.courseStartDate).format("DD MMM YYYY")}
                  </option>
                ))}
              </Select>
            </div>
            <div className="mb-4">
              <Label htmlFor="courseStartDate" value="Course Start Date" />

              <TextInput
                id="courseStartDate"
                type="date"
                name="courseStartDate"
                value={formData.courseStartDate}
                onChange={handleCourseStartDateChange}
              />
            </div>
            <div className="mb-4">
              <Label htmlFor="classStartTime" value="Class Start Time" />
              <TextInput
                id="classStartTime"
                type="string"
                name="classStartTime"
                value={formData.classStartTime}
                onChange={(e) =>
                  setFormData({ ...formData, classStartTime: e.target.value })
                }
              />
            </div>
            <div className="mb-4">
              <Label
                htmlFor="courseDuration"
                value="Course Duration (Months)"
              />
              <TextInput
                id="courseDuration"
                type="number"
                name="courseDuration"
                value={formData.courseDuration}
                onChange={handleCourseDurationChange}
                placeholder="Course Duration in Months"
              />
            </div>
            {/* Admission Fee Section */}
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2">Admission Fee</h3>
              <div className="flex items-center mb-2">
                <Label htmlFor="admissionPaidDate" value="Paid Date" />
                <TextInput
                  id="admissionPaidDate"
                  type="date"
                  name="paidDate"
                  value={formData.admissionFee.paidDate}
                  onChange={handleAdmissionFeeChange}
                />
              </div>
              <div className="flex items-center mb-2">
                <Label htmlFor="admissionAmount" value="Amount" />
                <TextInput
                  id="admissionAmount"
                  type="number"
                  name="amount"
                  value={formData.admissionFee.amount}
                  onChange={handleAdmissionFeeChange}
                  placeholder="Admission Fee Amount"
                />
              </div>
            </div>
            {/* Monthly Fees Section */}
            {formData.fees.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Monthly Fees</h3>
                {formData.fees.map((fee, index) => (
                  <div key={index} className="grid grid-cols-3 gap-4 mb-2">
                    <div>
                      <Label value="Fees Date" />
                      <TextInput
                        type="text"
                        value={fee.feesDate}
                        readOnly
                        className="bg-gray-200"
                      />
                    </div>
                    <div>
                      <Label value="Paid Date" />
                      <TextInput
                        type="date"
                        name="paidDate"
                        value={fee.paidDate}
                        onChange={(e) => handleFeeChange(index, e)}
                      />
                    </div>
                    <div>
                      <Label value="Amount" />
                      <TextInput
                        type="number"
                        name="amount"
                        value={fee.amount}
                        onChange={(e) => handleFeeChange(index, e)}
                        placeholder="Amount Paid"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
            <Button type="submit" className="w-full bg-black">
              {editingStudentId ? "Update Student" : "Add Student"}
            </Button>
          </form>
        </Modal.Body>
      </Modal>

      {/* Error Message */}
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
};

export default StudentManagementPage;
