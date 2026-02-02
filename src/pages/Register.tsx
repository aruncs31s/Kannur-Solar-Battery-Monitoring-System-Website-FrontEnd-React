import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { authAPI } from "../api/auth";
import {
  FormField,
  FormError,
  FormSuccess,
} from "../components/FormComponents";
import { UserPlus } from "lucide-react";

export const Register = () => {
  const navigate = useNavigate();
  const { setToken, setUser } = useAuthStore();
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

    if (!name) {
      newErrors.name = "Name is required";
    }

    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
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
      const { token, user } = await authAPI.register(name, email, password);
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
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="flex justify-center mb-6">
          <div className="bg-blue-100 p-4 rounded-full">
            <UserPlus className="text-blue-600" size={32} />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-center text-text-primary mb-2">
          Create Account
        </h1>
        <p className="text-center text-text-secondary mb-8">
          Join Solar Monitor to get started
        </p>

        {error && <FormError message={error} />}
        {success && <FormSuccess message={success} />}

        <form onSubmit={handleSubmit} className="space-y-6">
          <FormField
            label="Full Name"
            name="name"
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setErrors({ ...errors, name: "" });
            }}
            error={errors.name}
            placeholder="John Doe"
            required
          />

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
            placeholder="you@example.com"
            required
          />

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

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary-500 hover:bg-primary-600 disabled:bg-surface-secondary disabled:text-text-secondary text-white font-bold py-3 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
          >
            {loading ? "Creating Account..." : "Sign Up"}
            {!loading && <UserPlus size={20} />}
          </button>
        </form>

        <p className="text-center text-text-secondary mt-6">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-primary-500 hover:text-primary-600 font-semibold"
          >
            Sign in here
          </Link>
        </p>
      </div>
    </div>
  );
};
