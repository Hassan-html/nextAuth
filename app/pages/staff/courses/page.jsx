"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Button,
  Table,
  Modal,
  Label,
  TextInput,
  Select,
  Alert,
} from "flowbite-react";
import dayjs from "dayjs";

const CoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [uniqueCourseNames, setUniqueCourseNames] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    courseName: "",
    instructor: "",
    courseStartTime: "",
    courseEndTime: "",
    courseStartDate: "",
    courseEndDate: "",
    status: "ongoing",
    comment: "",
  });
  const [filters, setFilters] = useState({
    instructor: "",
    status: "",
    startDate: "",
    endDate: "",
    courseName: "",
  });
  const [editingCourseId, setEditingCourseId] = useState(null);
  const [error, setError] = useState(null);

  const courseOptions = [
    "Graphic Design",
    "Web Development",
    "Data Science",
    "Machine Learning",
    "Digital Marketing",
    // Add more courses as needed
  ];

  useEffect(() => {
    fetchCourses();
    fetchInstructors();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await axios.post("/api/staff/courses", {
        action: "fetchCourses",
        filters,
      });
      const coursesData = response.data.courses || [];
      setCourses(coursesData);

      // Extract unique course names
      const uniqueNames = [
        ...new Set(coursesData.map((course) => course.courseName)),
      ];
      setUniqueCourseNames(uniqueNames);
    } catch (error) {
      console.error("Error fetching courses", error);
      setError("Failed to fetch courses.");
    }
  };

  const fetchInstructors = async () => {
    try {
      const response = await axios.post("/api/admin", {
        action: "fetch",
      });
      const allUsers = response.data || [];
      const instructors = allUsers.filter((user) => user.type === "instructor");
      setInstructors(instructors);
    } catch (error) {
      console.error("Error fetching instructors", error);
      setError("Failed to fetch instructors.");
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleFilterApply = () => {
    fetchCourses();
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const action = editingCourseId ? "updateCourse" : "addCourse";
      const payload = { action, ...formData };
      if (editingCourseId) {
        payload.id = editingCourseId;
      }
      await axios.post("/api/staff/courses", payload);
      fetchCourses();
      setShowModal(false);
      setEditingCourseId(null);
    } catch (error) {
      console.error(
        `Error ${editingCourseId ? "updating" : "adding"} course`,
        error
      );
      setError(`Failed to ${editingCourseId ? "update" : "add"} course.`);
    }
  };

  const handleUpdateCourse = (course) => {
    setEditingCourseId(course._id);
    setFormData({
      courseName: course.courseName || "",
      instructor: course.instructor?._id || "",
      courseStartTime: course.courseStartTime || "",
      courseEndTime: course.courseEndTime || "",
      courseStartDate: course.courseStartDate
        ? dayjs(course.courseStartDate).format("YYYY-MM-DD")
        : "",
      courseEndDate: course.courseEndDate
        ? dayjs(course.courseEndDate).format("YYYY-MM-DD")
        : "",
      status: course.status || "ongoing",
      comment: course.comment || "",
    });
    setShowModal(true);
  };

  const handleMarkAsOver = async (course) => {
    try {
      await axios.post("/api/staff/courses", {
        action: "updateCourse",
        id: course._id,
        status: "over",
      });
      fetchCourses();
    } catch (error) {
      console.error("Error marking course as over", error);
      setError("Failed to mark course as over.");
    }
  };

  return (
    <div className="p-8">
      {error && <Alert color="failure">{error}</Alert>}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Courses</h1>
        <Button
          className="bg-gray-800 hover:bg-gray-700"
          onClick={() => setShowModal(true)}
        >
          Add Course
        </Button>
      </div>

      <div className="flex space-x-4 mb-4">
        <Select
          name="courseName"
          value={filters.courseName}
          onChange={handleFilterChange}
        >
          <option value="">All Courses</option>
          {uniqueCourseNames.map((courseName, index) => (
            <option key={index} value={courseName}>
              {courseName}
            </option>
          ))}
        </Select>
        <Select
          name="instructor"
          value={filters.instructor}
          onChange={handleFilterChange}
        >
          <option value="">All Instructors</option>
          {instructors.map((instructor) => (
            <option key={instructor._id} value={instructor._id}>
              {instructor.name || "Unnamed Instructor"}
            </option>
          ))}
        </Select>
        <Select
          name="status"
          value={filters.status}
          onChange={handleFilterChange}
        >
          <option value="">All Status</option>
          <option value="ongoing">Ongoing</option>
          <option value="over">Over</option>
        </Select>
        <TextInput
          type="date"
          name="startDate"
          value={filters.startDate || ""}
          onChange={handleFilterChange}
          placeholder="Start Date"
        />
        <TextInput
          type="date"
          name="endDate"
          value={filters.endDate || ""}
          onChange={handleFilterChange}
          placeholder="End Date"
        />
        <Button
          className="bg-gray-800 hover:bg-gray-700"
          onClick={handleFilterApply}
        >
          Apply Filters
        </Button>
      </div>

      <Table hoverable>
        <Table.Head>
          <Table.HeadCell>Course Name</Table.HeadCell>
          <Table.HeadCell>Instructor</Table.HeadCell>
          <Table.HeadCell>Start Time</Table.HeadCell>
          <Table.HeadCell>End Time</Table.HeadCell>
          <Table.HeadCell>Start Date</Table.HeadCell>
          <Table.HeadCell>End Date</Table.HeadCell>
          <Table.HeadCell>Status</Table.HeadCell>
          <Table.HeadCell>Actions</Table.HeadCell>
        </Table.Head>
        <Table.Body className="divide-y">
          {courses.map((course) => (
            <Table.Row key={course._id}>
              <Table.Cell>{course.courseName || "Unnamed Course"}</Table.Cell>
              <Table.Cell>
                {course.instructor?.name || "No Instructor"}
              </Table.Cell>
              <Table.Cell>{course.courseStartTime || "N/A"}</Table.Cell>
              <Table.Cell>{course.courseEndTime || "N/A"}</Table.Cell>
              <Table.Cell>
                {course.courseStartDate
                  ? dayjs(course.courseStartDate).format("DD MMM YYYY")
                  : "N/A"}
              </Table.Cell>
              <Table.Cell>
                {course.courseEndDate
                  ? dayjs(course.courseEndDate).format("DD MMM YYYY")
                  : "N/A"}
              </Table.Cell>
              <Table.Cell>{course.status || "N/A"}</Table.Cell>
              <Table.Cell>
                <Button
                  className="mr-2 bg-blue-800 hover:bg-blue-700"
                  onClick={() => handleUpdateCourse(course)}
                >
                  Update
                </Button>
                <Button
                  className="bg-red-800 hover:bg-red-700"
                  onClick={() => handleMarkAsOver(course)}
                >
                  Mark as Over
                </Button>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>

      <Modal show={showModal} onClose={() => setShowModal(false)}>
        <Modal.Header>
          {editingCourseId ? "Update Course" : "Add Course"}
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <Label htmlFor="courseName" value="Course Name" />
              <Select
                id="courseName"
                name="courseName"
                value={formData.courseName}
                onChange={handleInputChange}
                required
              >
                <option value="" disabled>
                  Select Course
                </option>
                {courseOptions.map((course, index) => (
                  <option key={index} value={course}>
                    {course}
                  </option>
                ))}
              </Select>
            </div>
            <div className="mb-4">
              <Label htmlFor="instructor" value="Instructor" />
              <Select
                id="instructor"
                name="instructor"
                value={formData.instructor}
                onChange={handleInputChange}
                required
              >
                <option value="" disabled>
                  Select Instructor
                </option>
                {instructors.map((instructor) => (
                  <option key={instructor._id} value={instructor._id}>
                    {instructor.name || "Unnamed Instructor"}
                  </option>
                ))}
              </Select>
            </div>
            <div className="mb-4">
              <Label htmlFor="courseStartTime" value="Course Start Time" />
              <TextInput
                id="courseStartTime"
                name="courseStartTime"
                type="time"
                value={formData.courseStartTime || ""}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="mb-4">
              <Label htmlFor="courseEndTime" value="Course End Time" />
              <TextInput
                id="courseEndTime"
                name="courseEndTime"
                type="time"
                value={formData.courseEndTime || ""}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="mb-4">
              <Label htmlFor="courseStartDate" value="Course Start Date" />
              <TextInput
                id="courseStartDate"
                name="courseStartDate"
                type="date"
                value={formData.courseStartDate || ""}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="mb-4">
              <Label htmlFor="courseEndDate" value="Course End Date" />
              <TextInput
                id="courseEndDate"
                name="courseEndDate"
                type="date"
                value={formData.courseEndDate || ""}
                onChange={handleInputChange}
              />
            </div>
            <div className="mb-4">
              <Label htmlFor="comment" value="Comment" />
              <TextInput
                id="comment"
                name="comment"
                value={formData.comment || ""}
                onChange={handleInputChange}
                placeholder="Add a comment (optional)"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-gray-800 hover:bg-gray-700"
            >
              {editingCourseId ? "Update Course" : "Add Course"}
            </Button>
          </form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default CoursesPage;
