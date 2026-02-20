import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Zap, Lock, User as UserIcon, ArrowRight, Shield, Activity } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { authAPI } from '../api/auth';
import { FormError, FormSuccess } from '../components/FormComponents';

export const Login = () => {
  const { setToken } = useAuthStore();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!username) {
      newErrors.username = 'Username is required';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const token = await authAPI.login({ username, password });
      if (token) {
        localStorage.setItem('token', token);
        setToken(token);
        setSuccess('Login successful!');
        window.location.href = '/';
      } else {
        setError('No token received from server');
      }
    } catch (err: any) {
      setError(
        err.response?.data?.error || 'Login failed. Please try again.',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-6xl">
        {/* Header with animated cards */}
        <motion.div
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >

          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">Welcome Back</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">Sign in to Solar & Battery Monitoring System</p>
        </motion.div>

        <div className='flex justify-center'>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-8"> */}
            {/* Login Form - Left Side */}
            <motion.div
              initial={{ x: -30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 border border-gray-100 dark:border-gray-700"
            >
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Sign In</h2>
                <p className="text-gray-600 dark:text-gray-400">Enter your credentials to continue</p>
              </div>

              {error && <FormError message={error} />}
              {success && <FormSuccess message={success} />}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    <UserIcon size={16} className="inline mr-2 text-blue-600" />
                    Username
                  </label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => {
                      setUsername(e.target.value);
                      setErrors({ ...errors, username: '' });
                    }}
                    placeholder="Enter your username"
                    className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50 dark:bg-gray-700 focus:bg-white dark:focus:bg-gray-600 text-gray-900 dark:text-white"
                    required
                  />
                  {errors.username && (
                    <p className="mt-1 text-xs text-red-600">{errors.username}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    <Lock size={16} className="inline mr-2 text-blue-600" />
                    Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setErrors({ ...errors, password: '' });
                    }}
                    placeholder="Enter your password"
                    className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50 dark:bg-gray-700 focus:bg-white dark:focus:bg-gray-600 text-gray-900 dark:text-white"
                    required
                  />
                  {errors.password && (
                    <p className="mt-1 text-xs text-red-600">{errors.password}</p>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center">
                    <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                    <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">Remember me</span>
                  </label>
                  <Link
                    to="#"
                    className="text-sm text-blue-600 hover:text-blue-700 font-semibold transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-3 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                >
                  {loading ? (
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      Sign In
                      <ArrowRight size={20} />
                    </>
                  )}
                </motion.button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Don&apos;t have an account?{' '}
                  <Link
                    to="/register"
                    className="text-blue-600 hover:text-blue-700 font-semibold transition-colors"
                  >
                    Sign up now
                  </Link>
                </p>
              </div>
            </motion.div>

            {/* Feature Cards - Right Side */}
            {/* <div className="space-y-6"> */}
            {/*   <motion.div */}
            {/*     initial={{ y: 20, opacity: 0 }} */}
            {/*     animate={{ y: 0, opacity: 1 }} */}
            {/*     transition={{ delay: 0.1 }} */}
            {/*     whileHover={{ y: -4, scale: 1.02 }} */}
            {/*     className="relative overflow-hidden bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-gray-700" */}
            {/*   > */}
            {/*     <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400 to-blue-600 opacity-10 rounded-full blur-2xl" /> */}
            {/*     <div className="relative flex items-start justify-between"> */}
            {/*       <div className="flex-1"> */}
            {/*         <p className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-2">Real-time Monitoring</p> */}
            {/*         <p className="text-2xl font-bold text-gray-800 dark:text-white mb-1">24/7</p> */}
            {/*         <p className="text-xs text-gray-500 dark:text-gray-400">Always connected</p> */}
            {/*       </div> */}
            {/*       <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 p-3 rounded-xl"> */}
            {/*         <Activity size={28} /> */}
            {/*       </div> */}
            {/*     </div> */}
            {/*   </motion.div> */}
            {/**/}
            {/*   <motion.div */}
            {/*     initial={{ y: 20, opacity: 0 }} */}
            {/*     animate={{ y: 0, opacity: 1 }} */}
            {/*     transition={{ delay: 0.2 }} */}
            {/*     whileHover={{ y: -4, scale: 1.02 }} */}
            {/*     className="relative overflow-hidden bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-gray-700" */}
            {/*   > */}
            {/*     <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-400 to-purple-600 opacity-10 rounded-full blur-2xl" /> */}
            {/*     <div className="relative flex items-start justify-between"> */}
            {/*       <div className="flex-1"> */}
            {/*         <p className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-2">Secure Access</p> */}
            {/*         <p className="text-2xl font-bold text-gray-800 dark:text-white mb-1">100%</p> */}
            {/*         <p className="text-xs text-gray-500 dark:text-gray-400">Encrypted data</p> */}
            {/*       </div> */}
            {/*       <div className="bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 p-3 rounded-xl"> */}
            {/*         <Shield size={28} /> */}
            {/*       </div> */}
            {/*     </div> */}
            {/*   </motion.div> */}
            {/**/}
            {/*   <motion.div */}
            {/*     initial={{ y: 20, opacity: 0 }} */}
            {/*     animate={{ y: 0, opacity: 1 }} */}
            {/*     transition={{ delay: 0.3 }} */}
            {/*     whileHover={{ y: -4, scale: 1.02 }} */}
            {/*     className="relative overflow-hidden bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-gray-700" */}
            {/*   > */}
            {/*     <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-400 to-green-600 opacity-10 rounded-full blur-2xl" /> */}
            {/*     <div className="relative flex items-start justify-between"> */}
            {/*       <div className="flex-1"> */}
            {/*         <p className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-2">Energy Insights</p> */}
            {/*         <p className="text-2xl font-bold text-gray-800 dark:text-white mb-1">Smart</p> */}
            {/*         <p className="text-xs text-gray-500 dark:text-gray-400">AI-powered analytics</p> */}
            {/*       </div> */}
            {/*       <div className="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 p-3 rounded-xl"> */}
            {/*         <Zap size={28} /> */}
            {/*       </div> */}
            {/*     </div> */}
            {/*   </motion.div> */}
            {/* </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};
