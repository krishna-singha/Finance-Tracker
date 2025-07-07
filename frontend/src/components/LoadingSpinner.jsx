import { FaSpinner } from 'react-icons/fa';

const LoadingSpinner = ({ 
  size = 'md', 
  color = 'blue', 
  text = 'Loading...',
  fullScreen = false,
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'text-xl',
    md: 'text-3xl',
    lg: 'text-5xl'
  };

  const colorClasses = {
    blue: 'text-blue-500',
    purple: 'text-purple-500',
    green: 'text-green-500',
    white: 'text-white',
    gray: 'text-gray-400'
  };

  if (fullScreen) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className={`animate-spin ${sizeClasses[size]} ${colorClasses[color]} mx-auto mb-4`} />
          <p className="text-white text-lg">{text}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="text-center">
        <FaSpinner className={`animate-spin ${sizeClasses[size]} ${colorClasses[color]} mx-auto mb-2`} />
        {text && <p className="text-gray-300">{text}</p>}
      </div>
    </div>
  );
};

export default LoadingSpinner;
