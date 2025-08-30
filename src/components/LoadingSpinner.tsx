import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex flex-col items-center">
      <div className="loading-dots text-blue-600">
        <div></div>
        <div></div>
        <div></div>
      </div>
      <p className="mt-2 text-slate-600 text-sm">Loading...</p>
    </div>
  );
};

export default LoadingSpinner;