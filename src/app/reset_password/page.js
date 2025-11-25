"use client";
import { useState, useEffect } from 'react';
import { resetPassword } from '../../utils/api';
import { Lock, Eye, EyeOff, CheckCircle, AlertCircle } from 'lucide-react';

export default function ResetPassword() {
  const [token, setToken] = useState(null);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // ✅ Get token safely in the browser
  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlToken = new URLSearchParams(window.location.search).get("token");
      setToken(urlToken);
    }
  }, []);

  // Password strength checker
  const getPasswordStrength = (pwd) => {
    if (!pwd) return { strength: 0, text: '', color: '' };
    let strength = 0;
    if (pwd.length >= 8) strength++;
    if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) strength++;
    if (/\d/.test(pwd)) strength++;
    if (/[^a-zA-Z0-9]/.test(pwd)) strength++;

    const levels = [
      { strength: 1, text: 'Weak', color: 'bg-red-500' },
      { strength: 2, text: 'Fair', color: 'bg-orange-500' },
      { strength: 3, text: 'Good', color: 'bg-yellow-500' },
      { strength: 4, text: 'Strong', color: 'bg-green-500' }
    ];

    return levels.find(l => l.strength === strength) || levels[0];
  };

  const passwordStrength = getPasswordStrength(password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    // Validation
    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (!token) {
      setError('Invalid or expired reset token');
      setLoading(false);
      return;
    }

    try {
      const res = await resetPassword(token, password); // ✅ ACTUAL CALL
      if (res.success) {
        setSuccess(true);
        setMessage(res.message || 'Your password has been reset successfully!');
        setTimeout(() => {
          window.location.href = '/';
        }, 2000);
      } else {
        setError(res.message || 'Failed to reset password');
      }
    } catch (err) {
      console.error("Reset password error:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleLoginRedirect = () => {
    window.location.href = '/';
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="rounded-2xl bg-white shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-10 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
              <Lock className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-white">Reset Password</h2>
            <p className="mt-2 text-blue-100">
              Create a new password for your account
            </p>
          </div>

          <div className="px-8 py-10">
            {!success ? (
              <>
                {error && (
                  <div className="mb-6 rounded-lg bg-red-50 border-l-4 border-red-500 p-4 flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-700 font-medium">{error}</p>
                  </div>
                )}

                <div className="space-y-6">
                  {/* New Password Field */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full rounded-xl border-2 border-gray-200 bg-gray-50 px-4 pr-12 py-3 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-200 transition duration-200"
                        placeholder="Enter new password"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-gray-700"
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>

                    {/* Password Strength Indicator */}
                    {password && (
                      <div className="mt-2">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-gray-600">Password strength:</span>
                          <span className={`text-xs font-semibold ${
                            passwordStrength.text === 'Weak' ? 'text-red-600' :
                            passwordStrength.text === 'Fair' ? 'text-orange-600' :
                            passwordStrength.text === 'Good' ? 'text-yellow-600' :
                            'text-green-600'
                          }`}>
                            {passwordStrength.text}
                          </span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${passwordStrength.color} transition-all duration-300`}
                            style={{ width: `${(passwordStrength.strength / 4) * 100}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Confirm Password Field */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full rounded-xl border-2 border-gray-200 bg-gray-50 px-4 pr-12 py-3 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-200 transition duration-200"
                        placeholder="Confirm new password"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-gray-700"
                      >
                        {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                    {confirmPassword && password !== confirmPassword && (
                      <p className="mt-1 text-xs text-red-600">Passwords do not match</p>
                    )}
                  </div>

                  {/* Password Requirements */}
                  <div className="bg-blue-50 rounded-lg p-4">
                    <p className="text-xs font-semibold text-gray-700 mb-2">Password must contain:</p>
                    <ul className="space-y-1 text-xs text-gray-600">
                      <li className="flex items-center gap-2">
                        <div className={`h-1.5 w-1.5 rounded-full ${password.length >= 8 ? 'bg-green-500' : 'bg-gray-300'}`} />
                        At least 8 characters
                      </li>
                      <li className="flex items-center gap-2">
                        <div className={`h-1.5 w-1.5 rounded-full ${/[a-z]/.test(password) && /[A-Z]/.test(password) ? 'bg-green-500' : 'bg-gray-300'}`} />
                        Upper and lowercase letters
                      </li>
                      <li className="flex items-center gap-2">
                        <div className={`h-1.5 w-1.5 rounded-full ${/\d/.test(password) ? 'bg-green-500' : 'bg-gray-300'}`} />
                        At least one number
                      </li>
                      {/*<li className="flex items-center gap-2">
                        <div className={`h-1.5 w-1.5 rounded-full ${/[^a-zA-Z0-9]/.test(password) ? 'bg-green-500' : 'bg-gray-300'}`} />
                        At least one special character
                      </li>*/}
                    </ul>
                  </div>

                  {/* Submit Button */}
                  <button
                    onClick={handleSubmit}
                    disabled={loading || !password || !confirmPassword || password !== confirmPassword}
                    className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 py-3.5 font-bold text-white shadow-lg hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:opacity-50 disabled:cursor-not-allowed transform transition duration-200 hover:scale-[1.02] active:scale-[0.98]"
                  >
                    {loading ? "Resetting Password..." : "Reset Password"}
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center py-4">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                  <CheckCircle className="h-10 w-10 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Password Reset Successfully!</h3>
                <div className="mb-6 rounded-lg bg-green-50 border-l-4 border-green-500 p-4">
                  <p className="text-sm text-green-700 font-medium">{message}</p>
                </div>
                <p className="text-sm text-gray-600 mb-6">
                  Redirecting you to login page...
                </p>
                <button
                  onClick={handleLoginRedirect}
                  className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 py-3 font-semibold text-white hover:from-blue-700 hover:to-indigo-700 transition duration-200"
                >
                  Go to Login Now
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
