"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Button,
  Label,
  TextInput,
  Table,
  Select,
  Spinner,
  Alert,
  Modal,
} from "flowbite-react";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";

const StudentManagementPage = () => {
  const [students, setStudents] = useState([]);
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

      setInstructors(
        instructorsResponse.data.filter((user) => user.type === "instructor")
      );
      setCourses(coursesResponse.data.courses || []);
      console.log(coursesResponse.data.courses);
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
      setLoading(false);
    } catch (error) {
      setError("Error fetching students.");
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };
  useEffect(() => {
    fetchStudents();
  }, [filters]);

  const handleInstructorChange = (e) => {
    const selectedInstructor = e.currentTarget.value;
    setFormData({ ...formData, instructor: selectedInstructor });
    setFilteredCourses(
      courses.filter((course) => {
        console.log(course.instructor._id, selectedInstructor);

        if (
          course.instructor._id === selectedInstructor &&
          course.status === "ongoing"
        ) {
          console.log(course);
          return course;
        }
      })
    );
  };

  const handleCourseDurationChange = (e) => {
    const courseDuration = e.target.value;
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
  };

  const updateFees = async (id, updatedFees) => {
    try {
      await axios.post("/api/staff", {
        action: "updateFees",
        id,
        fees: updatedFees,
      });
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
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Student Management</h1>

      {error && (
        <Alert color="failure" className="mb-4">
          {error}
        </Alert>
      )}

      <div className="mb-4 flex space-x-4">
        <TextInput
          placeholder="Search by CNIC"
          name="cnic"
          value={filters.cnic}
          onChange={handleFilterChange}
        />
        <TextInput
          placeholder="Search by Phone"
          name="phone"
          value={filters.phone}
          onChange={handleFilterChange}
        />
        <Select
          name="course"
          value={filters.course}
          onChange={handleFilterChange}
        >
          <option value="">All Courses</option>

          {filters.instructor
            ? courses.map((course, index) => {
                if (course.instructor._id == filters.instructor) {
                  return (
                    <option key={course._id} value={course._id}>
                      {course.courseName}--
                      {course.courseStartTime}
                    </option>
                  );
                } else {
                  return (
                    <h1 key={index}>
                      {course.instructor._id},{filters.instructor}
                    </h1>
                  );
                }
              })
            : courses.map((course) => (
                <option key={course._id} value={course._id}>
                  {course.courseName}
                </option>
              ))}
        </Select>
        <Select
          name="instructor"
          value={filters.instructor}
          onChange={(e) => {
            filters.course = "";
            handleFilterChange(e);
          }}
        >
          <option value="">All Instructors</option>
          {instructors.map((instructor) => (
            <option key={instructor._id} value={instructor._id}>
              {instructor.name}
            </option>
          ))}
        </Select>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={filters.feeDue}
            onChange={handleFeeDueChange}
          />
          <span>Fee Due</span>
        </label>
        <Button onClick={fetchStudents}>
          {loading ? <Spinner size="sm" /> : "Search"}
        </Button>
      </div>

      {loading ? (
        <Spinner size="lg" />
      ) : (
        <Table hoverable={true}>
          <Table.Head>
            <Table.HeadCell>Student Name</Table.HeadCell>
            <Table.HeadCell>CNIC</Table.HeadCell>
            <Table.HeadCell>Phone</Table.HeadCell>
            <Table.HeadCell>Course</Table.HeadCell>
            <Table.HeadCell>Instructor</Table.HeadCell>
            <Table.HeadCell>Actions</Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {students.map((student) => (
              <Table.Row key={student._id} className="bg-white">
                <Table.Cell>{student.name}</Table.Cell>
                <Table.Cell>{student.cnic}</Table.Cell>
                <Table.Cell>{student.phone}</Table.Cell>
                <Table.Cell>
                  {courses.map((course) => {
                    if (student.course === course._id) return course.courseName;
                  })}
                </Table.Cell>
                <Table.Cell>
                  {" "}
                  {instructors.map((instructor) => {
                    if (student.instructor === instructor._id)
                      return instructor.name;
                  })}
                </Table.Cell>
                <Table.Cell>
                  <Button
                    onClick={() => handleEditStudent(student)}
                    className="mr-2 bg-blue-600 hover:bg-blue-500 text-white"
                  >
                    Edit
                  </Button>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      )}

      <Button
        className="fixed bottom-4 right-4 bg-green-600 hover:bg-green-500 text-white"
        onClick={handleAddStudent}
      >
        Add Student
      </Button>

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
                required
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
                required
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
                required
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
                required
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
                required
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
                required
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
                required
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
    </div>
  );
};
export default StudentManagementPage;
