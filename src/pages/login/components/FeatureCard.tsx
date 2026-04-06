import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface FeatureCardProps {
  title: string;
  value: string;
  description: string;
  icon: LucideIcon;
  delay: number;
}

export const FeatureCard = ({ title, value, description, icon: Icon, delay }: FeatureCardProps) => (
  <motion.div
    initial={{ y: 20, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ delay }}
    whileHover={{ y: -4, scale: 1.02 }}
    className="relative overflow-hidden bg-surface-primary rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 border border-border-primary"
  >
    <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500 opacity-10 rounded-full blur-2xl" />
    <div className="relative flex items-start justify-between">
      <div className="flex-1">
        <p className="text-text-secondary text-sm font-medium mb-2">{title}</p>
        <p className="text-2xl font-bold text-text-primary mb-1">{value}</p>
        <p className="text-xs text-text-tertiary">{description}</p>
      </div>
      <div className="bg-primary-500/10 text-primary-500 p-3 rounded-xl border border-primary-500/20">
        <Icon size={28} />
      </div>
    </div>
  </motion.div>
);
