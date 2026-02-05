import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuthStore } from "../store/authStore";
import { authAPI } from "../api/auth";
import {
  FormField,
  FormError,
  FormSuccess,
} from "../components/FormComponents";
import { UserPlus, Users, TrendingUp, Globe } from "lucide-react";

export const Register = () => {
  const navigate = useNavigate();
  const { setToken, setUser } = useAuthStore();
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!username) {
      newErrors.username = "Username is required";
    }

    if (email.length > 0 && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const { token, user } = await authAPI.register(
        username,
        password,
        email,
        name);
      setToken(token);
      setUser(user);
      setSuccess("Registration successful! Redirecting to home...");
      setTimeout(() => navigate("/"), 1500);

    } catch (err: any) {
      setError(
        err.response?.data?.error || "Registration failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-green-900 dark:to-blue-900 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-6xl">
        {/* Header with animated icon */}
        <motion.div
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">Join Our Platform</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">Create your account and start monitoring</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Register Form - Left Side */}
          <motion.div
            initial={{ x: -30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 border border-gray-100 dark:border-gray-700"
          >
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Create Account</h2>
              <p className="text-gray-600 dark:text-gray-400">Fill in your details to get started</p>
            </div>

            {error && <FormError message={error} />}
            {success && <FormSuccess message={success} />}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  label="Name"
                  name="name"
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    setErrors({ ...errors, name: "" });
                  }}
                  error={errors.name}
                  placeholder="Arun CS"
                />

                <FormField
                  label="Username"
                  name="username"
                  type="text"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    setErrors({ ...errors, username: "" });
                  }}
                  error={errors.username}
                  placeholder="arun_cs"
                  required
                />
              </div>

              <FormField
                label="Email Address"
                name="email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setErrors({ ...errors, email: "" });
                }}
                error={errors.email}
                placeholder="arun.cs@example.com"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  label="Password"
                  name="password"
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setErrors({ ...errors, password: "" });
                  }}
                  error={errors.password}
                  placeholder="••••••••"
                  required
                />

                <FormField
                  label="Confirm Password"
                  name="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setErrors({ ...errors, confirmPassword: "" });
                  }}
                  error={errors.confirmPassword}
                  placeholder="••••••••"
                  required
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-3 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl mt-6"
              >
                {loading ? (
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    Create Account
                    <UserPlus size={20} />
                  </>
                )}
              </motion.button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-blue-600 hover:text-blue-700 font-semibold transition-colors"
                >
                  Sign in here
                </Link>
              </p>
            </div>
          </motion.div>

          {/* Feature Cards - Right Side */}
          <div className="space-y-6">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              whileHover={{ y: -4, scale: 1.02 }}
              className="relative overflow-hidden bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-gray-700"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-400 to-green-600 opacity-10 rounded-full blur-2xl" />
              <div className="relative flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-2">Active Users</p>
                  <p className="text-2xl font-bold text-gray-800 dark:text-white mb-1">1,000+</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Trusted worldwide</p>
                </div>
                <div className="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 p-3 rounded-xl">
                  <Users size={28} />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              whileHover={{ y: -4, scale: 1.02 }}
              className="relative overflow-hidden bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-gray-700"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400 to-blue-600 opacity-10 rounded-full blur-2xl" />
              <div className="relative flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-2">Performance</p>
                  <p className="text-2xl font-bold text-gray-800 dark:text-white mb-1">99.9%</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Uptime guaranteed</p>
                </div>
                <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 p-3 rounded-xl">
                  <TrendingUp size={28} />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              whileHover={{ y: -4, scale: 1.02 }}
              className="relative overflow-hidden bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-gray-700"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-400 to-purple-600 opacity-10 rounded-full blur-2xl" />
              <div className="relative flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-2">Global Reach</p>
                  <p className="text-2xl font-bold text-gray-800 dark:text-white mb-1">50+</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Countries served</p>
                </div>
                <div className="bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 p-3 rounded-xl">
                  <Globe size={28} />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};
