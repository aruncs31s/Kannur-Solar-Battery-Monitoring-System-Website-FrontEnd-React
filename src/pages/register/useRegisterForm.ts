import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { authAPI } from "../../api/auth";

export interface RegistrationData {
  username: string;
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface ValidationErrors {
  [key: string]: string;
}

export const useRegisterForm = () => {
  const navigate = useNavigate();
  const { setToken, setUser } = useAuthStore();

  const [formData, setFormData] = useState<RegistrationData>({
    username: "",
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    if (!formData.username) {
      newErrors.username = "Username is required";
    }

    if (formData.email.length > 0 && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const updateField = (field: keyof RegistrationData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const { token, refresh_token, user } = await authAPI.register(
        formData.username,
        formData.password,
        formData.email,
        formData.name
      );
      setToken(token, refresh_token);
      setUser(user);
      setSuccess("Registration successful! Redirecting to home...");
      setTimeout(() => navigate("/"), 1500);
    } catch (err: any) {
      setError(
        err.response?.data?.error || "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    updateField,
    error,
    success,
    loading,
    errors,
    handleSubmit,
  };
};
