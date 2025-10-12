// components/MedicineList.js
import useSWR from "swr";
import api from "../utils/api";
import Link from "next/link";
import { useAuth } from "../context/AuthContext";

const fetcher = (url) => api.get(url).then(r => r.data.data);

export default function MedicineList() {
  const { data, error } = useSWR("/medicines", fetcher);
  const { user } = useAuth();

  if (error) return <div>Error loading medicines</div>;
  if (!data) return <div>Loading...</div>;

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl">Medicines</h2>
        {(user?.role === "admin" || user?.role === "manager") && (
          <Link href="/medicines/new"><a className="bg-green-500 text-white px-3 py-1 rounded">Add Medicine</a></Link>
        )}
      </div>

      <table className="w-full table-auto">
        <thead><tr><th>Name</th><th>Qty</th><th>Expiry</th><th>Actions</th></tr></thead>
        <tbody>
          {data.map(m => (
            <tr key={m.id} className="border-t">
              <td>{m.name}</td>
              <td>{m.quantity}</td>
              <td>{new Date(m.expiryDate).toLocaleDateString()}</td>
              <td>
                <Link href={`/medicines/${m.id}`}><a className="mr-2 text-blue-600">View</a></Link>
                {user?.role === "admin" && (
                  <button onClick={() => {/* delete flow */}} className="text-red-600">Delete</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
