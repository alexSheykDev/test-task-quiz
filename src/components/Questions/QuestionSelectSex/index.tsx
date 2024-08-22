// CustomInputQuestion.tsx

import React from 'react';
import { TQuestion } from '@/types';
import { IoMdMan, IoMdWoman } from 'react-icons/io';

interface QuestionSelectSexProps {
  question: TQuestion;
  currentAnswer: string | null;
  onNext: (questionId: number, answer: string) => void;
}

const QuestionSelectSex: React.FC<QuestionSelectSexProps> = ({ question, currentAnswer, onNext }) => {
  const handleSubmit = (inputValue: string) => {
    onNext(question.id, inputValue);
  };

  return (
    <div className="flex w-full gap-x-6">
      {question.options!.map((option) => (
        <button
          key={option}
          onClick={() => handleSubmit(option)}
          className="grow rounded-md border p-8"
          style={{ borderColor: currentAnswer === option ? '#9333ea' : '#171717' }}
        >
          {option === 'Male' ? (
            <IoMdMan color={currentAnswer === option ? '#9333ea' : '#171717'} className="w-full h-full min-w-[80px]" />
          ) : (
            <IoMdWoman
              color={currentAnswer === option ? '#9333ea' : '#171717'}
              className="w-full h-full min-w-[80px]"
            />
          )}
        </button>
      ))}
    </div>
  );
};

export default QuestionSelectSex;
