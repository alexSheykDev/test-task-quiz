import React from 'react';

interface ProgressBarProps {
  currentQuestionIndex: number;
  totalQuestions: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ currentQuestionIndex, totalQuestions }) => {
  const progressPercentage = (currentQuestionIndex / totalQuestions) * 100;

  return (
    <div className="w-full h-4 bg-yellow-50 rounded-lg">
      <div
        className="h-full rounded-lg bg-fuchsia-300 transition-all duration-500"
        style={{
          width: `${progressPercentage}%`,
        }}
      />
    </div>
  );
};

export default ProgressBar;
