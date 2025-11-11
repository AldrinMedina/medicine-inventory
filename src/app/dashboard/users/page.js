"use client";

import DashboardLayout from "../../../components/DashboardLayout";
import { useAuth } from "../../../context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getUsers, addUser, updateUser, deleteUser } from "../../../utils/api";
import { Users, Plus, Edit2, Trash2, X, AlertCircle, Mail, Lock, Shield } from 'lucide-react';
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
  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'admin':
        return 'bg-purple-100 text-purple-700';
      case 'doctor':
        return 'bg-blue-100 text-blue-700';
      case 'staff':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };
  const getRoleIcon = (role) => {
    switch (role) {
      case 'admin':
        return <Shield className="h-4 w-4" />;
      case 'doctor':
        return <Lock className="h-4 w-4" />;
      case 'staff':
        return <Users className="h-4 w-4" />;
      default:
        return null;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg">
              <Users className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Manage Users</h1>
              <p className="text-sm text-gray-600">Control user accounts and permissions</p>
            </div>
          </div>

          <button
            onClick={openAddModal}
            className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-blue-600/20 transition-all duration-200"
          >
            <Plus className="h-5 w-5" />
            Add User
          </button>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Username</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Email</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Role</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900">{u.username}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Mail className="h-4 w-4 text-gray-400" />
                        {u.email}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${getRoleBadgeColor(u.role)}`}>
                        {getRoleIcon(u.role)}
                        {u.role.charAt(0).toUpperCase() + u.role.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openEditModal(u)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(u.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900">
                  {modalMode === 'add' ? 'Add New User' : 'Edit User'}
                </h2>
                <button
                  onClick={closeModal}
                  className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="h-6 w-6 text-gray-600" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Username
                    </label>
                    <input
                      type="text"
                      value={formData.username}
                      onChange={(e) =>
                        setFormData({ ...formData, username: e.target.value })
                      }
                      className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                      placeholder="Enter username"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                      placeholder="Enter email"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Password {modalMode === 'edit' && <span className="text-xs font-normal text-gray-500">(leave blank to keep current)</span>}
                    </label>
                    <input
                      type="password"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                      placeholder={modalMode === 'add' ? 'Enter password' : 'Enter new password (optional)'}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Role
                    </label>
                    <select
                      value={formData.role}
                      onChange={(e) =>
                        setFormData({ ...formData, role: e.target.value })
                      }
                      className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                    >
                      <option value="staff">Staff</option>
                      <option value="doctor">Doctor</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>

                  {error && (
                    <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-lg flex items-start gap-3">
                      <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-red-700">{error}</p>
                    </div>
                  )}

                  {/* Modal Footer */}
                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={closeModal}
                      className="flex-1 px-4 py-2.5 border-2 border-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSubmit}
                      className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200"
                    >
                      {modalMode === 'add' ? 'Add User' : 'Update User'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}