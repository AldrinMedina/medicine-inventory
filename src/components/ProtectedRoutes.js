// components/ProtectedRoute.js
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children, roles = [] }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) router.push("/login");
      else if (roles.length && !roles.includes(user.role)) router.push("/unauthorized");
    }
  }, [user, loading]);

  if (loading || !user) return <div className="p-4">Loading...</div>;
  return children;
}
