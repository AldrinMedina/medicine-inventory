// pages/medicines/new.js
import { useForm } from "react-hook-form";
import api from "../../utils/api";
import {useRouter} from "next/router";
import ProtectedRoute from "../../components/ProtectedRoute";
import { useAuth } from "../../context/AuthContext";

export default function NewMedicine() {
  const { register, handleSubmit } = useForm();
  const { user } = useAuth();

  const onSubmit = async (data) => {
    try {
      const payload = { ...data, createdBy: user?.id };
      await api.post("/medicines", payload);
      const router = useRouter();
      router.push("/medicines");

    } catch (err) {
      alert(err.response?.data?.message || "Create failed");
    }
  };

  return (
    <ProtectedRoute roles={["admin","manager"]}>
      <div className="max-w-xl mx-auto p-6">
        <h1 className="text-xl mb-4">Add Medicine</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <input {...register("name", { required: true })} placeholder="Name" className="w-full p-2 border rounded" />
          <input {...register("category")} placeholder="Category" className="w-full p-2 border rounded" />
          <input {...register("manufacturer")} placeholder="Manufacturer" className="w-full p-2 border rounded" />
          <input {...register("dosage")} placeholder="Dosage" className="w-full p-2 border rounded" />
          <input {...register("batchNumber")} placeholder="Batch #" className="w-full p-2 border rounded" />
          <input {...register("expiryDate", {required:"Expiry date is required"})} type="date" className="w-full p-2 border rounded" />
          <input {...register("quantity", { valueAsNumber: true })} type="number" placeholder="Quantity" className="w-full p-2 border rounded" />
          <button className="bg-blue-600 text-white px-4 py-2 rounded">Create</button>
        </form>
      </div>
    </ProtectedRoute>
  );
}
