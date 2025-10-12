"use client";

import DashboardLayout from "../../../components/DashboardLayout";
import { useAuth } from "../../../context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getUsers, addUser, updateUser, deleteUser } from "../../../utils/api";

export default function UsersPage() {
  const { user, loading } = useAuth();
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("add"); // "add" or "edit"
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "staff",
  });
  const [error, setError] = useState("");

  const router = useRouter();

  useEffect(() => {
    if (!user || user.role !== "admin") return;
    fetchUsers();
  }, [user]);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/");
    }
  }, [user, loading, router]);

  async function fetchUsers() {
    const res = await getUsers();
    if (res.success) setUsers(res.data);
  }

  // Open modal for adding
  function openAddModal() {
    setModalMode("add");
    setFormData({ username: "", email: "", password: "", role: "staff" });
    setSelectedUser(null);
    setError("");
    setShowModal(true);
  }

  // Open modal for editing
  function openEditModal(u) {
    setModalMode("edit");
    setFormData({
      username: u.username,
      email: u.email,
      password: "", // Don't show existing password
      role: u.role,
    });
    setSelectedUser(u);
    setError("");
    setShowModal(true);
  }

  // Close modal
  function closeModal() {
    setShowModal(false);
    setFormData({ username: "", email: "", password: "", role: "staff" });
    setError("");
  }

  // Handle form submission
  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    // Validation
    if (!formData.username || !formData.email || !formData.role) {
      setError("Username, email, and role are required");
      return;
    }

    if (modalMode === "add" && !formData.password) {
      setError("Password is required for new users");
      return;
    }

    let res;
    if (modalMode === "add") {
      res = await addUser(formData);
    } else {
      // For edit, only send password if it's been changed
      const updateData = { ...formData };
      if (!updateData.password) {
        delete updateData.password;
      }
      res = await updateUser(selectedUser.id, updateData);
    }

    if (res.success) {
      fetchUsers();
      closeModal();
    } else {
      setError(res.message || "An error occurred");
    }
  }

  // Delete user
  async function handleDelete(id) {
    if (confirm("Are you sure you want to delete this user?")) {
      const res = await deleteUser(id);
      if (res.success) {
        fetchUsers();
      } else {
        setError(res.message || "Failed to delete user");
      }
    }
  }

  if (!user) {
    return <p className="p-6 text-gray-600">Loading...</p>;
  }

  if (user.role !== "admin") {
    return <p className="p-6 text-red-600">Access denied.</p>;
  }

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold mb-4">Manage Users</h1>

      <button
        onClick={openAddModal}
        className="mb-4 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
      >
        + Add User
      </button>

      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Username</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">Role</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td className="border p-2">{u.username}</td>
              <td className="border p-2">{u.email}</td>
              <td className="border p-2">{u.role}</td>
              <td className="border p-2">
                <button
                  onClick={() => openEditModal(u)}
                  className="mr-2 rounded bg-yellow-500 px-2 py-1 text-white hover:bg-yellow-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(u.id)}
                  className="rounded bg-red-600 px-2 py-1 text-white hover:bg-red-700"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {modalMode === "add" ? "Add User" : "Edit User"}
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Username
                </label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter username"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter email"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Password {modalMode === "edit" && "(leave blank to keep current)"}
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={modalMode === "add" ? "Enter password" : "Enter new password (optional)"}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Role
                </label>
                <select
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({ ...formData, role: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="staff">Staff</option>
                  <option value="doctor">Doctor</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              {error && (
                <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                  {error}
                </div>
              )}

              <div className="flex justify-end gap-2 mt-6">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  {modalMode === "add" ? "Add User" : "Update User"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}