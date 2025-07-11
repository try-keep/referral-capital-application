import React from 'react';

interface ProgressBarProps {
  className?: string;
  progress?: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ className, progress }) => {
  const style = progress ? { width: `${progress}%` } : {};
  return (
    <div className="w-full bg-gray-200 rounded-full h-2.5">
      <div className={`h-2.5 rounded-full ${className}`} style={style}></div>
    </div>
  );
};

export default ProgressBar;
