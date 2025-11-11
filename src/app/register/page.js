"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { registerUser } from "../../utils/api";
import { useAuth } from "../../context/AuthContext";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError(null);

    // Check password strength
    if (name === "password") {
      checkPasswordStrength(value);
    }
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validate password match
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    // Validate password strength
    if (formData.password.length < 8 ) {
      setError("Password must be at least 8 characters");
      setLoading(false);
      return;
    }

    try {
      const res = await registerUser(
        formData.username,
        formData.email,
        formData.password
      );

      if (res?.success) {
        login(res.data.user, res.data.token);
        router.push("/");
      } else {
        setError(res.message || "Registration failed");
      }
    } catch (err) {
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const checkPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8 ) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;

    if (strength <= 1) setPasswordStrength("weak");
    else if (strength <= 3) setPasswordStrength("medium");
    else setPasswordStrength("strong");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        {/* Card Container */}
        <div className="rounded-2xl bg-white shadow-2xl overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-10 text-center">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
              <span className="text-5xl">💊</span>
            </div>
            <h2 className="text-3xl font-bold text-white">Create Account</h2>
            <p className="mt-2 text-indigo-100">Join Medicine Inventory System</p>
          </div>

          {/* Form Section */}
          <div className="px-8 py-10">
            {/* Error Message */}
            {error && (
              <div className="mb-6 rounded-lg bg-red-50 border-l-4 border-red-500 p-4">
                <div className="flex items-center">
                  <span className="text-red-500 mr-2">❌</span>
                  <p className="text-sm text-red-700 font-medium">{error}</p>
                </div>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Username Field */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <span className="text-gray-400 text-lg">👤</span>
                  </div>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className="w-full rounded-xl border-2 border-gray-200 bg-gray-50 pl-12 pr-4 py-3 text-gray-900 placeholder-gray-400 focus:border-purple-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-200 transition duration-200"
                    placeholder="johndoe"
                    required
                  />
                </div>
              </div>

              {/* Email Field */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <span className="text-gray-400 text-lg">📧</span>
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full rounded-xl border-2 border-gray-200 bg-gray-50 pl-12 pr-4 py-3 text-gray-900 placeholder-gray-400 focus:border-purple-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-200 transition duration-200"
                    placeholder="you@gmail.com"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <span className="text-gray-400 text-lg">🔒</span>
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full rounded-xl border-2 border-gray-200 bg-gray-50 pl-12 pr-12 py-3 text-gray-900 placeholder-gray-400 focus:border-purple-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-200 transition duration-200"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
                  >
                  </button>
                </div>
                
                {/* Password Strength Indicator */}
                {formData.password && (
                  <div className="mt-2">
                    <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${
                          passwordStrength === "weak"
                            ? "w-1/3 bg-red-500"
                            : passwordStrength === "medium"
                            ? "w-2/3 bg-yellow-500"
                            : "w-full bg-green-500"
                        }`}
                      />
                    </div>
                    <p className="mt-1 text-xs text-gray-600">
                      Password strength:{" "}
                      <span
                        className={`font-semibold ${
                          passwordStrength === "weak"
                            ? "text-red-600"
                            : passwordStrength === "medium"
                            ? "text-yellow-600"
                            : "text-green-600"
                        }`}
                      >
                        {passwordStrength}
                      </span>
                    </p>
                  </div>
                )}
              </div>

              {/* Confirm Password Field */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <span className="text-gray-400 text-lg">🔒</span>
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full rounded-xl border-2 border-gray-200 bg-gray-50 pl-12 pr-4 py-3 text-gray-900 placeholder-gray-400 focus:border-purple-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-200 transition duration-200"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 py-3.5 font-bold text-white shadow-lg hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-purple-300 disabled:opacity-50 disabled:cursor-not-allowed transform transition duration-200 hover:scale-[1.02] active:scale-[0.98]"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Creating Account...
                  </span>
                ) : (
                  "Create Account"
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-4 text-gray-500">Already have an account?</span>
              </div>
            </div>

            {/* Login Link */}
            <Link
              href="/"
              className="block w-full rounded-xl border-2 border-purple-600 bg-white py-3 text-center font-semibold text-purple-600 hover:bg-purple-50 transition duration-200"
            >
              Sign In Instead
            </Link>
          </div>
        </div>

        {/* Footer Text */}
        <p className="mt-6 text-center text-sm text-white/80">
          By creating an account, you agree to our{" "}
          <a href="#" className="font-semibold underline hover:text-white">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="#" className="font-semibold underline hover:text-white">
            Privacy Policy
          </a>
        </p>
      </div>
    </div>
  );
}
