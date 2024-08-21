"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Card, Spinner, Table, Select, Alert } from "flowbite-react";
import dayjs from "dayjs";

const AttendanceManagementPage = () => {
  const [step, setStep] = useState(1); // Step 1: Instructor, Step 2: Course, Step 3: Students
  const [instructors, setInstructors] = useState([]);
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedInstructor, setSelectedInstructor] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [topic, setTopic] = useState("");
  const [date, setDate] = useState(dayjs().format("YYYY-MM-DD"));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (step === 1) {
      fetchInstructors();
    } else if (step === 2 && selectedInstructor) {
      fetchCourses();
    } else if (step === 3 && selectedCourse) {
      fetchStudents();
    }
  }, [step, selectedInstructor, selectedCourse]);

  const fetchInstructors = async () => {
    try {
      setLoading(true);
      const response = await axios.post("/api/atnd", {
        action: "fetchInstructors",
      });
      console.log(response);
      if (Array.isArray(response.data.instructors)) {
        setInstructors(response.data.instructors);
      } else {
        throw new Error("Unexpected data format for instructors.");
      }
      setLoading(false);
    } catch (error) {
      setError("Error fetching instructors.");
      setLoading(false);
    }
  };

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await axios.post("/api/atnd", {
        action: "fetchCoursesByInstructor",
        instructorId: selectedInstructor._id,
      });
      if (Array.isArray(response.data.courses)) {
        setCourses(response.data.courses);
      } else {
        throw new Error("Unexpected data format for courses.");
      }
      setLoading(false);
    } catch (error) {
      setError("Error fetching courses.");
      setLoading(false);
    }
  };

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await axios.post("/api/atnd", {
        action: "fetchStudentsByCourse",
        courseId: selectedCourse._id,
      });
      if (Array.isArray(response.data.students)) {
        setStudents(response.data.students);
        setAttendance(
          response.data.students.map((student) => ({
            studentId: student._id,
            status: "P",
          }))
        );
      } else {
        throw new Error("Unexpected data format for students.");
      }
      setLoading(false);
    } catch (error) {
      setError("Error fetching students.");
      setLoading(false);
    }
  };

  const handleAttendanceChange = (index, e) => {
    const updatedAttendance = [...attendance];
    updatedAttendance[index] = {
      ...updatedAttendance[index],
      status: e.target.value,
    };
    setAttendance(updatedAttendance);
  };

  const handleSaveAttendance = async () => {
    try {
      setLoading(true);
      await axios.post("/api/atnd", {
        action: "saveAttendance",
        courseId: selectedCourse._id,
        date,
        topic,
        attendance,
      });
      setLoading(false);
      setStep(1); // Reset to step 1 after saving
      setSelectedInstructor(null);
      setSelectedCourse(null);
    } catch (error) {
      setError("Error saving attendance.");
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Attendance Management</h1>

      {error && (
        <Alert color="failure" className="mb-4">
          {error}
        </Alert>
      )}

      {loading && <Spinner size="lg" className="mb-4" />}

      {step === 1 && (
        <>
          <h2 className="text-xl mb-4">Select Instructor</h2>
          <div className="grid grid-cols-1 gap-4">
            {instructors.map((instructor) => (
              <Card
                key={instructor._id}
                className="cursor-pointer bg-black text-white"
                onClick={() => {
                  setSelectedInstructor(instructor);
                  setStep(2);
                }}
              >
                <h2 className="text-xl">{instructor.name}Has</h2>
              </Card>
            ))}
          </div>
        </>
      )}

      {step === 2 && selectedInstructor && (
        <>
          <h2 className="text-xl mb-4">
            Select Course for {selectedInstructor.name}
          </h2>
          <div className="grid grid-cols-1 gap-4">
            {courses.map((course) => (
              <Card
                key={course._id}
                className="cursor-pointer"
                onClick={() => {
                  setSelectedCourse(course);
                  setStep(3);
                }}
              >
                <h2 className="text-xl">
                  {course.name} - {course.time}
                </h2>
              </Card>
            ))}
          </div>
        </>
      )}

      {step === 3 && selectedCourse && (
        <>
          <h2 className="text-xl mb-4">Attendance for {selectedCourse.name}</h2>
          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium text-gray-900">
              Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="block w-full p-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium text-gray-900">
              Topic
            </label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="block w-full p-2 border rounded"
            />
          </div>
          <Table hoverable={true}>
            <Table.Head>
              <Table.HeadCell>Student Name</Table.HeadCell>
              <Table.HeadCell>Status</Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {students.map((student, index) => (
                <Table.Row key={student._id} className="bg-white">
                  <Table.Cell>{student.name}</Table.Cell>
                  <Table.Cell>
                    <Select
                      value={attendance[index].status}
                      onChange={(e) => handleAttendanceChange(index, e)}
                      className="block w-full p-2 border rounded"
                    >
                      <option value="P">Present</option>
                      <option value="A">Absent</option>
                      <option value="L">Leave</option>
                    </Select>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
          <Button className="mt-4" onClick={handleSaveAttendance}>
            Save Attendance
          </Button>
        </>
      )}
    </div>
  );
};

export default AttendanceManagementPage;
