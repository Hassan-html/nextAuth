"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Label,
  TextInput,
  Button,
  Select,
  Table,
  Modal,
  Spinner,
} from "flowbite-react";

const AccountsPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    type: "staff",
    phone: "",
  });
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [message, setMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editUserId, setEditUserId] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setFetching(true);
      const response = await axios.post("/api/admin", { action: "fetch" });
      setUsers(response.data);
      console.log(users);
      console.log(response);
      setFetching(false);
    } catch (error) {
      console.error("Error fetching users", error);
      setFetching(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const action = editMode ? "update" : "create";
      const response = await axios.post("/api/admin", {
        ...formData,
        action,
        id: editUserId,
      });
      setMessage(response.data.message);
      fetchUsers();
      setFormData({
        name: "",
        email: "",
        password: "",
        type: "staff",
        phone: "",
      });
      setShowModal(false);
      setEditMode(false);
    } catch (error) {
      setMessage("Error saving user");
    }

    setLoading(false);
  };

  const handleUpdate = (user) => {
    setFormData({
      name: user.name,
      email: user.email,
      password: "",
      type: user.type,
      phone: user.phone,
    });
    setEditUserId(user._id);
    setEditMode(true);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    setLoading(true);

    try {
      const response = await axios.post("/api/users", { action: "delete", id });
      setMessage(response.data.message);
      fetchUsers();
    } catch (error) {
      setMessage("Error deleting user");
    }

    setLoading(false);
  };

  const openModal = () => {
    setFormData({
      name: "",
      email: "",
      password: "",
      type: "staff",
      phone: "",
    });
    setEditMode(false);
    setShowModal(true);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <Button
        onClick={openModal}
        className="mb-6 bg-gray-800 hover:bg-gray-700 text-white"
      >
        Add New User
      </Button>

      {fetching ? (
        <div className="flex items-center justify-center w-full">
          <Spinner size="lg" />
          <p className="ml-2">Loading users...</p>
        </div>
      ) : (
        <div className="w-full max-w-[800px]">
          <Table hoverable={true} className="shadow-lg border border-gray-300">
            <Table.Head className="bg-gray-800 text-white">
              <Table.HeadCell className="bg-black w-full h-full ">
                <span>Name</span>
              </Table.HeadCell>
              <Table.HeadCell className="bg-black w-full h-full ">
                <span>Email</span>
              </Table.HeadCell>
              <Table.HeadCell className="bg-black w-full h-full ">
                <span>Type</span>
              </Table.HeadCell>
              <Table.HeadCell className="bg-black w-full h-full ">
                <span>Phone</span>
              </Table.HeadCell>
              <Table.HeadCell className="bg-black w-full h-full ">
                <span>Actions</span>
              </Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {Array.isArray(users) ? (
                users.map((user) => (
                  <Table.Row
                    key={user._id}
                    className="bg-white hover:bg-gray-100"
                  >
                    <Table.Cell className="p-4">{user.name}</Table.Cell>
                    <Table.Cell className="p-4">{user.email}</Table.Cell>
                    <Table.Cell className="p-4">{user.type}</Table.Cell>
                    <Table.Cell className="p-4">{user.phone}</Table.Cell>
                    <Table.Cell className="p-4">
                      <Button
                        onClick={() => handleUpdate(user)}
                        className="mr-2 bg-gray-800 hover:bg-gray-700 text-white"
                      >
                        Update
                      </Button>
                      <Button
                        onClick={() => handleDelete(user._id)}
                        color="failure"
                        className="bg-red-600 hover:bg-red-500 text-white"
                      >
                        Delete
                      </Button>
                    </Table.Cell>
                  </Table.Row>
                ))
              ) : (
                <>Failed to fetch</>
              )}
            </Table.Body>
          </Table>
        </div>
      )}

      <Modal show={showModal} onClose={() => setShowModal(false)} size="md">
        <Modal.Header>{editMode ? "Update User" : "Add New User"}</Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <Label htmlFor="name" value="Name" />
              <TextInput
                id="name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Name"
              />
            </div>
            <div className="mb-4">
              <Label htmlFor="email" value="Email" />
              <TextInput
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Email"
              />
            </div>
            <div className="mb-4">
              <Label htmlFor="password" value="Password" />
              <TextInput
                id="password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
              />
            </div>
            <div className="mb-4">
              <Label htmlFor="type" value="Account Type" />
              <Select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                required
              >
                <option value="staff">Staff</option>
                <option value="instructor">Instructor</option>
              </Select>
            </div>
            <div className="mb-4">
              <Label htmlFor="phone" value="Phone" />
              <TextInput
                id="phone"
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                placeholder="Phone Number"
              />
            </div>
            <div>
              <Button
                type="submit"
                className="w-full bg-gray-800 hover:bg-gray-700 text-white"
                disabled={loading}
              >
                {loading
                  ? editMode
                    ? "Updating User..."
                    : "Creating User..."
                  : editMode
                  ? "Update User"
                  : "Create User"}
              </Button>
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default AccountsPage;
