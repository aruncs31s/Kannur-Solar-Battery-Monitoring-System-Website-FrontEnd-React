import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

export interface FeatureCardProps {
  title: string;
  value: string;
  subtitle: string;
  icon: LucideIcon;
  iconColor: string;
  gradientFrom: string;
  gradientTo: string;
  delay: number;
}

export const FeatureCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  iconColor,
  gradientFrom,
  gradientTo,
  delay,
}: FeatureCardProps) => {
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay }}
      whileHover={{ y: -4, scale: 1.02 }}
      className="relative overflow-hidden card p-6 hover:shadow-2xl transition-all duration-300"
    >
      <div
        className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${gradientFrom} ${gradientTo} opacity-10 rounded-full blur-2xl`}
      />
      <div className="relative flex items-start justify-between">
        <div className="flex-1">
          <p className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-2">
            {title}
          </p>
          <p className="text-2xl font-bold text-gray-800 dark:text-white mb-1">
            {value}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">{subtitle}</p>
        </div>
        <div className={`bg-gradient-to-br ${iconColor} p-3 rounded-xl`}>
          <Icon size={28} />
        </div>
      </div>
    </motion.div>
  );
};
