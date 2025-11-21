"use client";

// /pages/forgot-password.js
import { useState } from "react";
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { forgotPassword } from "../../utils/api";
import { useRouter } from "next/navigation";

export default function ForgotPassword() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const res = await forgotPassword(email); // pass string
      if (res.success) {
        setMessage(res.message);
        setSuccess(true); // show confirmation screen
      } else {
        setError(res.message);
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  
  const handleBackToLogin = () => {
    router.push("/"); // or your login page route
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="rounded-2xl bg-white shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-10 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
              <Mail className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-white">Forgot Password?</h2>
            <p className="mt-2 text-blue-100">
              {"No worries! Enter your email and we'll send you reset instructions"}
            </p>
          </div>

          <div className="px-8 py-10">
            {!success ? (
              <>
                {error && (
                  <div className="mb-6 rounded-lg bg-red-50 border-l-4 border-red-500 p-4">
                    <p className="text-sm text-red-700 font-medium">{error}</p>
                  </div>
                )}

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-xl border-2 border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-200 transition duration-200"
                      placeholder="you@example.com"
                      required
                    />
                  </div>

                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 py-3.5 font-bold text-white shadow-lg hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:opacity-50 disabled:cursor-not-allowed transform transition duration-200 hover:scale-[1.02] active:scale-[0.98]"
                  >
                    {loading ? "Sending..." : "Send Reset Link"}
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center py-4">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                  <CheckCircle className="h-10 w-10 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Check Your Email</h3>
                <div className="mb-6 rounded-lg bg-green-50 border-l-4 border-green-500 p-4">
                  <p className="text-sm text-green-700 font-medium">{message}</p>
                </div>
                <p className="text-sm text-gray-600 mb-6">
                  {"Didn't receive the email? Check your spam folder or try again."}
                </p>
              </div>
            )}

            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-4 text-gray-500">Remember your password?</span>
              </div>
            </div>

            <button
              onClick={handleBackToLogin}
              className="flex items-center justify-center gap-2 w-full rounded-xl border-2 border-blue-600 bg-white py-3 text-center font-semibold text-blue-600 hover:bg-blue-50 transition duration-200"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
