// CustomInputQuestion.tsx

import React, { useState, useEffect } from 'react';

interface QuestionCustomInputProps {
  questionId: number;
  currentAnswer: string | undefined;
  onNext: (questionId: number, answer: string) => void;
}

const QuestionCustomInput: React.FC<QuestionCustomInputProps> = ({ questionId, currentAnswer = '', onNext }) => {
  const [inputValue, setInputValue] = useState<string>(currentAnswer);

  useEffect(() => {
    setInputValue(currentAnswer || '');
  }, [currentAnswer]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = () => {
    onNext(questionId, inputValue);
  };

  return (
    <div className="flex flex-col gap-y-4">
      <input
        type="text"
        className="border-b-4 border-gray-300 w-full py-2 focus:outline-none focus:border-blue-500"
        value={inputValue}
        onChange={handleInputChange}
      />
      <button
        className="self-center px-14 py-4 rounded-md bg-orange-200 text-lg font-semibold"
        onClick={handleSubmit}
        disabled={!inputValue}
      >
        Next
      </button>
    </div>
  );
};

export default QuestionCustomInput;
