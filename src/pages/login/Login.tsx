import { motion } from 'framer-motion';
import { LoginForm } from './components/LoginForm';

export const Login = () => {

  return (
    <div className="min-h-screen bg-background-primary flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md mx-auto">
        <motion.div
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-text-primary mb-2">Welcome Back</h1>
          <p className="text-lg text-text-secondary">Sign in to Solar & Battery Monitoring System</p>
        </motion.div>

        <LoginForm />
      </div>
    </div>
  );
};
