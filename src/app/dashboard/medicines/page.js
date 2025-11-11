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
import { Pill, Plus, Edit2, Trash2, X, AlertCircle, Calendar, Package } from 'lucide-react';

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
  const [searchTerm, setSearchTerm] = useState('');

  const filteredMedicines = medicines.filter(med =>
    med.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  const isExpiringSoon = (expiryDate) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const daysUntilExpiry = (expiry - today) / (1000 * 60 * 60 * 24);
    return daysUntilExpiry <= 30 && daysUntilExpiry > 0;
  };

  const isExpired = (expiryDate) => {
    return new Date(expiryDate) < new Date();
  };

  // While user is loading
  if (!user) {
    return <p className="p-6 text-gray-600">Loading...</p>;
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg">
              <Pill className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Medicines</h1>
              <p className="text-sm text-gray-600">Manage your medicine inventory</p>
            </div>
          </div>

          {(user.role === 'admin' || user.role === 'doctor') && (
            <button
              onClick={openAddModal}
              className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-blue-600/20 transition-all duration-200"
            >
              <Plus className="h-5 w-5" />
              Add Medicine
            </button>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-lg flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Search Bar */}
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Search medicines..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
          />
        </div>

        {/* Medicines Table */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Medicine Name</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Quantity</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Expiry Date</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                  {user.role !== 'staff' && (
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Actions</th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredMedicines.length > 0 ? (
                  filteredMedicines.map((med) => (
                    <tr key={med.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Pill className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{med.name}</p>
                            <p className="text-xs text-gray-500">by {med.createdBy}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Package className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-900 font-medium">{med.quantity} units</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-600">{new Date(med.expiryDate).toDateString()}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {isExpired(med.expiryDate) ? (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700">
                            Expired
                          </span>
                        ) : isExpiringSoon(med.expiryDate) ? (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700">
                            Expiring Soon
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                            Active
                          </span>
                        )}
                      </td>
                      {user.role !== 'staff' && (
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => openEditModal(med)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Edit"
                            >
                              <Edit2 className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => handleDelete(med.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="h-5 w-5" />
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={user.role !== 'staff' ? 5 : 4} className="px-6 py-12 text-center">
                      <p className="text-gray-500">No medicines found</p>
                    </td>
                  </tr>
                )}
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
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Pill className="h-5 w-5 text-blue-600" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">
                    {modalMode === 'add' ? 'Add New Medicine' : 'Edit Medicine'}
                  </h2>
                </div>
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
                      Medicine Name
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                      placeholder="e.g., Aspirin"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Quantity
                    </label>
                    <input
                      type="number"
                      value={formData.quantity}
                      onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                      className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                      placeholder="Enter quantity"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Expiry Date
                    </label>
                    <input
                      type="date"
                      value={formData.expiryDate}
                      onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                      className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                      required
                    />
                  </div>

                  {error && (
                    <div className="p-3 bg-red-50 border-l-4 border-red-500 rounded-lg">
                      <p className="text-sm text-red-700">{error}</p>
                    </div>
                  )}

                  {/* Modal Footer */}
                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={closeModal}
                      className="flex-1 px-4 py-2.5 border-2 border-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSubmit}
                      className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200"
                    >
                      {modalMode === 'add' ? 'Add Medicine' : 'Update Medicine'}
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
