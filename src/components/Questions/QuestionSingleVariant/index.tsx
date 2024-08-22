// CustomInputQuestion.tsx

import React from 'react';
import { TQuestion } from '@/types';

interface QuestionSingleVariantProps {
  question: TQuestion;
  currentAnswer: string | null;
  onNext: (questionId: number, answer: string) => void;
}

const QuestionSingleVariant: React.FC<QuestionSingleVariantProps> = ({ question, currentAnswer = '', onNext }) => {
  return (
    <div className="flex flex-col w-full gap-y-4 mt-10">
      {question.options!.map((option) => (
        <label
          htmlFor={option}
          key={option}
          className="flex items-center gap-x-4 text-lg text-black font-semibold p-6 border border-black rounded-lg cursor-pointer"
        >
          <input
            id={option}
            type="radio"
            value={option}
            className="w-5 h-5 text-black"
            checked={currentAnswer === option}
            onChange={() => onNext(question.id, option)}
          />
          {option}
        </label>
      ))}
    </div>
  );
};

export default QuestionSingleVariant;
