
import React from 'react';

interface ProgressBarProps {
  duration: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ duration }) => {
  return (
    <div className="w-full bg-slate-700 rounded-full h-4 overflow-hidden border-2 border-slate-600">
      <div
        className="bg-cyan-400 h-full rounded-full origin-left"
        style={{
          animation: `progress-bar-shrink ${duration}s linear forwards`,
        }}
      />
    </div>
  );
};

export default ProgressBar;
