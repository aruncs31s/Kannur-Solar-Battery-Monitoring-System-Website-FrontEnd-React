import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { UserPlus } from "lucide-react";
import {
  FormField,
  FormError,
  FormSuccess,
} from "../../components/FormComponents";
import { useRegisterForm } from "./useRegisterForm";

export const RegisterForm = () => {
  const {
    formData,
    updateField,
    error,
    success,
    loading,
    errors,
    handleSubmit,
  } = useRegisterForm();

  return (
    <motion.div
      initial={{ x: -30, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: 0.4 }}
      className="card shadow-2xl p-8"
    >
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
          Create Account
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Fill in your details to get started
        </p>
      </div>

      {error && <FormError message={error} />}
      {success && <FormSuccess message={success} />}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label="Name"
            name="name"
            type="text"
            value={formData.name}
            onChange={(e) => updateField("name", e.target.value)}
            error={errors.name}
            placeholder="Arun CS"
          />

          <FormField
            label="Username"
            name="username"
            type="text"
            value={formData.username}
            onChange={(e) => updateField("username", e.target.value)}
            error={errors.username}
            placeholder="arun_cs"
            required
          />
        </div>

        <FormField
          label="Email Address"
          name="email"
          type="email"
          value={formData.email}
          onChange={(e) => updateField("email", e.target.value)}
          error={errors.email}
          placeholder="arun.cs@example.com"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={(e) => updateField("password", e.target.value)}
            error={errors.password}
            placeholder="••••••••"
            required
          />

          <FormField
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={(e) => updateField("confirmPassword", e.target.value)}
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
  );
};
