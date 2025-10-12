"use client";

import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import DashboardLayout from "../../components/DashboardLayout";

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/");
    }
  }, [user, loading, router]);

  if (loading) {
    return <p className="p-6">Loading...</p>; // prevent premature redirect
  }

  if (!user) return null;

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold mb-4">Welcome, {user.username}!</h1>
      <p className="text-gray-600">
        You are logged in as <strong>{user.role}</strong>.
      </p>
    </DashboardLayout>
  );
}
