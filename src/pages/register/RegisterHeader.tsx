import { motion } from "framer-motion";

export const RegisterHeader = () => {
  return (
    <motion.div
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="text-center mb-8"
    >
      <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">
        Join Our Platform
      </h1>
      <p className="text-lg text-gray-600 dark:text-gray-300">
        Create your account and start monitoring
      </p>
    </motion.div>
  );
};
