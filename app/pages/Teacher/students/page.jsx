"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Table, Dropdown, Button, Modal } from "flowbite-react";
import '../styles/style.css';
const StudentsTable = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [searchName, setSearchName] = useState("");
  const [searchContact, setSearchContact] = useState("");
  const [searchTeacher, setSearchTeacher] = useState("");
  const [showOnlyDue, setShowOnlyDue] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editStudent, setEditStudent] = useState(null);

  useEffect(() => {
    axios.post("/api/students",[]).then((response) => {
      setStudents(response.data.data);
      setFilteredStudents(response.data.data);
      console.log(response.data.data)
    });
  }, []);

  const handleFilter = () => {
    let filtered = students;

    if (searchName) {
      filtered = filtered.filter((student) =>
        student.studentName.toLowerCase().includes(searchName.toLowerCase())
      );
    }

    if (searchContact) {
      filtered = filtered.filter((student) =>
        student.contactNumber.includes(searchContact)
      );
    }

    if (searchTeacher) {
      filtered = filtered.filter((student) =>
        student.instructor.toLowerCase().includes(searchTeacher.toLowerCase())
      );
    }

    if (showOnlyDue) {
      const currentDate = new Date();
      filtered = filtered.filter((student) =>
        student.monthlyFeeDates.some((feeDate, index) => {
          const dueDate = new Date(feeDate);
          return (
            dueDate < currentDate &&
            (!student.feePaymentDates || !student.feePaymentDates[index])
          );
        })
      );
    }

    setFilteredStudents(filtered);
  };

  useEffect(() => {
    handleFilter();
  }, [searchName, searchContact, searchTeacher, showOnlyDue, students]);

  const openEditModal = (student) => {
    setEditStudent({ ...student });
    setEditModalOpen(true);
  };

  const closeEditModal = () => {
    setEditModalOpen(false);
    setEditStudent(null);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`/api/students/edit`, editStudent);
      setStudents((prev) =>
        prev.map((student) =>
          student._id === editStudent._id ? editStudent : student
        )
      );
      closeEditModal();
    } catch (error) {
      console.error("Error updating student:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditStudent((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="container mx-auto py-4">
      <div className="mb-4 flex flex-col md:flex-row gap-4">
        <input
          type="text"
          placeholder="Search by Name"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          className="w-full md:w-1/4 p-2 border border-gray-300 rounded-md"
        />
        <input
          type="text"
          placeholder="Search by Contact"
          value={searchContact}
          onChange={(e) => setSearchContact(e.target.value)}
          className="w-full md:w-1/4 p-2 border border-gray-300 rounded-md"
        />
        <input
          type="text"
          placeholder="Search by Teacher"
          value={searchTeacher}
          onChange={(e) => setSearchTeacher(e.target.value)}
          className="w-full md:w-1/4 p-2 border border-gray-300 rounded-md"
        />
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={showOnlyDue}
            onChange={(e) => setShowOnlyDue(e.target.checked)}
          />
          <span>Show Only Due Fees</span>
        </label>
      </div>

      <Table>
        <Table.Head>
          <Table.HeadCell>Name</Table.HeadCell>
          <Table.HeadCell>Contact</Table.HeadCell>
          <Table.HeadCell>Teacher</Table.HeadCell>
          <Table.HeadCell>Admission Date</Table.HeadCell>
          <Table.HeadCell>Fees</Table.HeadCell>
          <Table.HeadCell>Actions</Table.HeadCell>
        </Table.Head>
        <Table.Body>
          {filteredStudents.map((student) => (
            <Table.Row
              key={student._id}
              className={
                student.monthlyFeeDates.some(
                  (feeDate, index) =>
                    new Date(feeDate) < new Date() &&
                    (!student.feePaymentDates ||
                      !student.feePaymentDates[index])
                )
                  ? "bg-red-600 text-white"
                  : " text-black"
              }
            >
              <Table.Cell>{student.studentName}</Table.Cell>
              <Table.Cell>{student.contactNumber}</Table.Cell>
              <Table.Cell>{student.instructor}</Table.Cell>
              <Table.Cell>
                {new Date(student.admissionDate).toLocaleDateString()}
              </Table.Cell>
              <Table.Cell
                className={
                  student.monthlyFeeDates.some(
                    (feeDate, index) =>
                      new Date(feeDate) < new Date() &&
                      (!student.feePaymentDates ||
                        !student.feePaymentDates[index])
                  )
                    ? ""
                    : " custom"
                }
              >
                <Dropdown label="View Fees">
                  {student.monthlyFeeDates.map((feeDate, index) => (
                    <Dropdown.Item key={index}>
                      <div className="flex justify-between items-center">
                        <span>{new Date(feeDate).toLocaleDateString()}</span>
                        <span>
                          {student.feePaymentDates &&
                          student.feePaymentDates[index]
                            ? `: Paid on = ${new Date(
                                student.feePaymentDates[index]
                              ).toLocaleDateString()}`
                            : ": Due"}
                        </span>
                      </div>
                    </Dropdown.Item>
                  ))}
                </Dropdown>
              </Table.Cell>
              <Table.Cell>
                <Button
                  className={
                    student.monthlyFeeDates.some(
                      (feeDate, index) =>
                        new Date(feeDate) < new Date() &&
                        (!student.feePaymentDates ||
                          !student.feePaymentDates[index])
                    )
                      ? "bg-red-600 text-white"
                      : " text-black"
                  }
                  onClick={() => openEditModal(student)}
                >
                  Edit
                </Button>
                <Button
                  className={
                    student.monthlyFeeDates.some(
                      (feeDate, index) =>
                        new Date(feeDate) < new Date() &&
                        (!student.feePaymentDates ||
                          !student.feePaymentDates[index])
                    )
                      ? "bg-red-600 text-white"
                      : " text-black"
                  }
                  onClick={async () => {
                    await axios.post(`/api/students/delete`,student);
                    setStudents(students.filter((s) => s._id !== student._id));
                  }}
                >
                  Delete
                </Button>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>

      {editStudent && (
        <Modal show={editModalOpen} onClose={closeEditModal}>
          <Modal.Header>Edit Student</Modal.Header>
          <Modal.Body>
            <form onSubmit={handleEditSubmit}>
              <div>
                <label>Name</label>
                <input
                  type="text"
                  name="studentName"
                  value={editStudent.studentName}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label>Contact</label>
                <input
                  type="text"
                  name="contactNumber"
                  value={editStudent.contactNumber}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label>Guardian Name</label>
                <input
                  type="text"
                  name="guardianName"
                  value={editStudent.guardianName}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label>Course</label>
                <input
                  type="text"
                  name="course"
                  value={editStudent.course}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label>Course Duration</label>
                <input
                  type="text"
                  name="courseDuration"
                  value={editStudent.courseDuration}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label>Instructor</label>
                <input
                  type="text"
                  name="instructor"
                  value={editStudent.instructor}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label>Class Start Time</label>
                <input
                  type="text"
                  name="classStartTime"
                  value={editStudent.classStartTime}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label>Admission Date</label>
                <input
                  type="date"
                  name="admissionDate"
                  value={
                    new Date(editStudent.admissionDate)
                      .toISOString()
                      .split("T")[0]
                  }
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="custom">
                <label>Monthly Fee Dates</label>
                <Dropdown label="Edit Fees">
                  {editStudent.monthlyFeeDates.map((feeDate, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center my-2"
                    >
                      <span>{new Date(feeDate).toLocaleDateString()}</span>
                      <input
                        type="date"
                        value={new Date(feeDate).toISOString().split("T")[0]}
                        onChange={(e) => {
                          const newFeeDates = [...editStudent.monthlyFeeDates];
                          newFeeDates[index] = new Date(
                            e.target.value
                          ).toISOString();
                          setEditStudent((prev) => ({
                            ...prev,
                            monthlyFeeDates: newFeeDates,
                          }));
                        }}
                        className="ml-2 p-2 border border-gray-300 rounded-md"
                      />
                      <input
                        type="date"
                        value={
                          editStudent.feePaymentDates &&
                          editStudent.feePaymentDates[index]
                            ? new Date(editStudent.feePaymentDates[index])
                                .toISOString()
                                .split("T")[0]
                            : ""
                        }
                        onChange={(e) => {
                          const newPaymentDates = editStudent.feePaymentDates
                            ? [...editStudent.feePaymentDates]
                            : [];
                          newPaymentDates[index] = new Date(
                            e.target.value
                          ).toISOString();
                          setEditStudent((prev) => ({
                            ...prev,
                            feePaymentDates: newPaymentDates,
                          }));
                        }}
                        className="ml-2 p-2 border border-gray-800 rounded-md"
                      />
                    </div>
                  ))}
                </Dropdown>
              </div>
              <div className="flex justify-end space-x-4 mt-4">
                <Button
                  className="bg-red-700"
                  type="button"
                  onClick={closeEditModal}
                >
                  Cancel
                </Button>
                <Button className="bg-blue-700" type="submit">
                  Save
                </Button>
              </div>
            </form>
          </Modal.Body>
        </Modal>
      )}
    </div>
  );
};

export default StudentsTable;
