import { motion } from 'framer-motion';
import { Zap, Shield, Activity } from 'lucide-react';
import { LoginForm } from './components/LoginForm';
import { FeatureCard } from './components/FeatureCard';

export const Login = () => {

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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <LoginForm />
          <div className="space-y-6">
            <FeatureCard
              title="Real-time Monitoring"
              value="24/7"
              description="Always connected"
              icon={Activity}
              delay={0.1}
              gradientFrom="from-blue-400"
              gradientTo="to-blue-600"
              bgColor="bg-blue-100 dark:bg-blue-900/30"
              textColor="text-blue-600 dark:text-blue-400"
            />
            <FeatureCard
              title="Secure Access"
              value="100%"
              description="Encrypted data"
              icon={Shield}
              delay={0.2}
              gradientFrom="from-purple-400"
              gradientTo="to-purple-600"
              bgColor="bg-purple-100 dark:bg-purple-900/30"
              textColor="text-purple-600 dark:text-purple-400"
            />
            <FeatureCard
              title="Energy Insights"
              value="Smart"
              description="AI-powered analytics"
              icon={Zap}
              delay={0.3}
              gradientFrom="from-green-400"
              gradientTo="to-green-600"
              bgColor="bg-green-100 dark:bg-green-900/30"
              textColor="text-green-600 dark:text-green-400"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
