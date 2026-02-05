import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

interface BackButtonProps {
  to: string;
  label?: string;
}

export const BackButton = ({ to, label = 'Back' }: BackButtonProps) => {
  return (
    <Link
      to={to}
      className="inline-flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors mb-4"
    >
      <ArrowLeft size={20} />
      {label}
    </Link>
  );
};
