"use client";

import DashboardLayout from "../../../components/DashboardLayout";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../context/AuthContext";
import { useEffect, useState } from "react";
import {
  getMedicines,
  addMedicine,
  updateMedicine,
  deleteMedicine,
} from "../../../utils/api";

export default function MedicinesPage() {
  const { user, loading } = useAuth();
  const [medicines, setMedicines] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("add"); // "add" or "edit"
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    quantity: "",
    expiryDate: "",
  });
  const [error, setError] = useState("");

  const router = useRouter();

  // Load medicines
  useEffect(() => {
    if (!user) return; // ✅ guard
    fetchMedicines();
  }, [user]);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/");
    }
  }, [user, loading, router]);

  async function fetchMedicines() {
    const res = await getMedicines();
    if (res.success) setMedicines(res.data);
  }

  // Open modal for adding
  function openAddModal() {
    setModalMode("add");
    setFormData({ name: "", quantity: "", expiryDate: "" });
    setSelectedMedicine(null);
    setError("");
    setShowModal(true);
  }

  // Open modal for editing
  function openEditModal(med) {
    setModalMode("edit");
    setFormData({
      name: med.name,
      quantity: med.quantity,
      expiryDate: med.expiryDate,
    });
    setSelectedMedicine(med);
    setError("");
    setShowModal(true);
  }

  // Close modal
  function closeModal() {
    setShowModal(false);
    setFormData({ name: "", quantity: "", expiryDate: "" });
    setError("");
  }


  // Handle form submission
  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!formData.name || !formData.quantity || !formData.expiryDate) {
      setError("All fields are required");
      return;
    }
    formData.createdBy = user.username;
    let res;
    if (modalMode === "add") {
      if (user.role === "staff") {
        setError("Staff cannot add medicines");
        return;
      }
      res = await addMedicine(formData);
    } else {
      if (user.role === "staff") {
        setError("Staff cannot edit medicines");
        return;
      }
      res = await updateMedicine(selectedMedicine.id, formData);
    }

    if (res.success) {
      fetchMedicines();
      closeModal();
    } else {
      setError(res.message || "An error occurred");
    }
  }

  // Delete medicine
  async function handleDelete(id) {
    if (user.role === "staff") {
      setError("Staff cannot delete medicines");
      return;
    }
    if (confirm("Are you sure you want to delete this medicine?")) {
      const res = await deleteMedicine(id);
      if (res.success) {
        fetchMedicines();
      } else {
        setError(res.message || "Failed to delete medicine");
      }
    }
  }

  // While user is loading
  if (!user) {
    return <p className="p-6 text-gray-600">Loading...</p>;
  }

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold mb-4">Medicines</h1>

      {(user.role === "admin" || user.role === "doctor") && (
        <button
          onClick={openAddModal}
          className="mb-4 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          + Add Medicine
        </button>
      )}

      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Name</th>
            <th className="border p-2">Quantity</th>
            <th className="border p-2">Expiry</th>
            {user.role !== "staff" && <th className="border p-2">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {medicines.map((med) => (
            <tr key={med.id}>
              <td className="border p-2">{med.name}</td>
              <td className="border p-2">{med.quantity}</td>
              <td className="border p-2">
                {new Date(med.expiryDate).toDateString()}
              </td>
              {user.role !== "staff" && (
                <td className="border p-2">
                  <button
                    onClick={() => openEditModal(med)}
                    className="mr-2 rounded bg-yellow-500 px-2 py-1 text-white hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(med.id)}
                    className="rounded bg-red-600 px-2 py-1 text-white hover:bg-red-700"
                  >
                    Delete
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {modalMode === "add" ? "Add Medicine" : "Edit Medicine"}
            </h2>

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Medicine Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter medicine name"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Quantity
                </label>
                <input
                  type="number"
                  value={formData.quantity}
                  onChange={(e) =>
                    setFormData({ ...formData, quantity: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter quantity"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Expiry Date
                </label>
                <input
                  type="date"
                  value={formData.expiryDate}
                  onChange={(e) =>
                    setFormData({ ...formData, expiryDate: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                  {error}
                </div>
              )}

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  {modalMode === "add" ? "Add" : "Update"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
