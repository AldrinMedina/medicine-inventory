"use client";

import Link from "next/link";
import { useAuth } from "../context/AuthContext";

export default function DashboardLayout({ children }) {
  const { user, logout } = useAuth();

  // Sidebar links
  const links = [];
  if (user?.role === "admin") {
    links.push(
      { href: "/dashboard/users", label: "👥 Manage Users" },
      { href: "/dashboard/medicines", label: "💊 Manage Medicines" }
    );
  }
  if (user?.role === "doctor") {
    links.push({ href: "/dashboard/medicines", label: "💊 Manage Medicines" });
  }
  if (user?.role === "staff") {
    links.push({ href: "/dashboard/medicines", label: "📋 View Medicines" });
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md p-4 flex flex-col justify-between">
        <div>
          <h2 className="mb-6 text-xl font-bold"><Link href={"/dashboard"}>Dashboard</Link></h2>

          {/* Show user info */}
          {user && (
            <div className="mb-4 text-sm text-gray-600">
              <p><span className="font-semibold">User:</span> {user.username}</p>
              <p><span className="font-semibold">Role:</span> {user.role}</p>
            </div>
          )}

          <nav className="space-y-2">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block rounded px-3 py-2 text-gray-700 hover:bg-gray-200"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* ✅ Logout Button */}
        <button
          onClick={logout}
          className="mt-6 w-full rounded bg-red-600 px-3 py-2 text-white hover:bg-red-700"
        >
          🚪 Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
