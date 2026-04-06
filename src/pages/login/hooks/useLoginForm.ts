import { useState } from 'react';
import { useAuthStore } from '../../../store/authStore';
import { authAPI } from '../../../api/auth';

export const useLoginForm = () => {
  const { setToken } = useAuthStore();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!username) newErrors.username = 'Username is required';
    if (!password) newErrors.password = 'Password is required';
    else if (password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await authAPI.login({ username, password });
      if (response?.token) {
        setToken(response.token, response.refresh_token);
        setSuccess('Login successful!');
        window.location.href = '/';
      } else {
        setError('No token received from server');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return {
    username,
    setUsername,
    password,
    setPassword,
    error,
    success,
    loading,
    errors,
    setErrors,
    handleSubmit,
  };
};
