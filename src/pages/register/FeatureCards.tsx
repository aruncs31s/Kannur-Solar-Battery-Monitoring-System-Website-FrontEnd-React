import { Users, TrendingUp, Globe } from "lucide-react";
import { FeatureCard, FeatureCardProps } from "./FeatureCard";

const FEATURES: Omit<FeatureCardProps, "delay">[] = [
  {
    title: "Active Users",
    value: "1,000+",
    subtitle: "Trusted worldwide",
    icon: Users,
    iconColor: "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400",
    gradientFrom: "from-green-400",
    gradientTo: "to-green-600",
  },
  {
    title: "Performance",
    value: "99.9%",
    subtitle: "Uptime guaranteed",
    icon: TrendingUp,
    iconColor: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400",
    gradientFrom: "from-blue-400",
    gradientTo: "to-blue-600",
  },
  {
    title: "Global Reach",
    value: "50+",
    subtitle: "Countries served",
    icon: Globe,
    iconColor: "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400",
    gradientFrom: "from-purple-400",
    gradientTo: "to-purple-600",
  },
];

export const FeatureCards = () => {
  return (
    <div className="space-y-6">
      {FEATURES.map((feature, index) => (
        <FeatureCard key={feature.title} {...feature} delay={0.1 + index * 0.1} />
      ))}
    </div>
  );
};
