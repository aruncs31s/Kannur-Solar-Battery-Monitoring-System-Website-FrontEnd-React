import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, User as UserIcon, ArrowRight } from 'lucide-react';
import { FormError, FormSuccess } from '../../../components/FormComponents';
import { FormInput } from './FormInput';
import { useLoginForm } from '../hooks/useLoginForm';

export const LoginForm = () => {
  const { username, setUsername, password, setPassword, error, success, loading, errors, setErrors, handleSubmit } = useLoginForm();

  return (
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
        <FormInput
          label="Username"
          icon={UserIcon}
          type="text"
          value={username}
          onChange={(val) => {
            setUsername(val);
            setErrors({ ...errors, username: '' });
          }}
          placeholder="Enter your username"
          error={errors.username}
        />

        <FormInput
          label="Password"
          icon={Lock}
          type="password"
          value={password}
          onChange={(val) => {
            setPassword(val);
            setErrors({ ...errors, password: '' });
          }}
          placeholder="Enter your password"
          error={errors.password}
        />

        <div className="flex items-center justify-between">
          <label className="flex items-center">
            <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
            <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">Remember me</span>
          </label>
          <Link to="#" className="text-sm text-blue-600 hover:text-blue-700 font-semibold transition-colors">
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
          <Link to="/register" className="text-blue-600 hover:text-blue-700 font-semibold transition-colors">
            Sign up now
          </Link>
        </p>
      </div>
    </motion.div>
  );
};
