interface LoadingStateProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  minHeight?: string;
}

export const LoadingState = ({ 
  message = 'Loading...', 
  size = 'md',
  minHeight = 'min-h-96' 
}: LoadingStateProps) => {
  const sizeClasses = {
    sm: 'h-8 w-8 border-2',
    md: 'h-12 w-12 border-b-2',
    lg: 'h-16 w-16 border-b-4',
  };

  return (
    <div className={`flex items-center justify-center ${minHeight}`}>
      <div className="text-center">
        <div className={`animate-spin rounded-full ${sizeClasses[size]} border-primary-500 mx-auto mb-4`}></div>
        <p className="text-text-secondary">{message}</p>
      </div>
    </div>
  );
};
