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
      className="bg-surface-primary rounded-2xl shadow-2xl p-8 border border-border-primary"
    >
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-text-primary mb-2">Sign In</h2>
        <p className="text-text-secondary">Enter your credentials to continue</p>
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
            <input type="checkbox" className="rounded border-border-primary text-primary-500 focus:ring-primary-500" />
            <span className="ml-2 text-sm text-text-secondary">Remember me</span>
          </label>
          <Link to="#" className="text-sm text-primary-500 hover:text-primary-600 font-semibold transition-colors">
            Forgot password?
          </Link>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={loading}
          className="w-full bg-primary-500 hover:bg-primary-600 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
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
        <p className="text-sm text-text-secondary">
          Don&apos;t have an account?{' '}
          <Link to="/register" className="text-primary-500 hover:text-primary-600 font-semibold transition-colors">
            Sign up now
          </Link>
        </p>
      </div>
    </motion.div>
  );
};
