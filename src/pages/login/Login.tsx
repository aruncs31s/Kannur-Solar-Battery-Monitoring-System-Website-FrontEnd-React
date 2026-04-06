import { motion } from 'framer-motion';
import { Zap, Shield, Activity } from 'lucide-react';
import { LoginForm } from './components/LoginForm';
import { FeatureCard } from './components/FeatureCard';

export const Login = () => {

  return (
    <div className="min-h-screen bg-background-primary flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-6xl mx-auto">
        <motion.div
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-text-primary mb-2">Welcome Back</h1>
          <p className="text-lg text-text-secondary">Sign in to Solar & Battery Monitoring System</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <LoginForm />
          <div className="space-y-6">
            <FeatureCard
              title="Real-time Monitoring"
              value="24/7"
              description="Always connected"
              icon={Activity}
              delay={0.1}
            />
            <FeatureCard
              title="Secure Access"
              value="100%"
              description="Encrypted data"
              icon={Shield}
              delay={0.2}
            />
            <FeatureCard
              title="Energy Insights"
              value="Smart"
              description="AI-powered analytics"
              icon={Zap}
              delay={0.3}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
