// Quiz.tsx

import React, { useState, useEffect, useCallback } from 'react';
import { TAnswer, TQuestion } from '@/types';
import ProgressBar from '@/components/ProgressBar';
import QuestionCustomInput from '@/components/Questions/QuestionCustomInput';
import QuestionSelectSex from '@/components/Questions/QuestionSelectSex';
import QuestionSingleVariant from '@/components/Questions/QuestionSingleVariant';

const Quiz: React.FC = () => {
  const [questions, setQuestions] = useState<TQuestion[]>([]);
  const [filteredQuestions, setFilteredQuestions] = useState<TQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<TAnswer[]>([]);
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [loading, setLoading] = useState<boolean>(true);

  const getFilteredQuestions = (questions: TQuestion[], answers: TAnswer[]) => {
    if (!answers.length) return questions;

    return questions.filter((question) => {
      if (!question.conditionalBlock) {
        return true; // No condition, show question
      }

      // Find the answer to the dependent question
      const dependentAnswer = answers.find((answer) => answer.questionId === question.conditionalBlock!.dependsOn);

      // Show the question only if the dependent answer matches the required value
      return dependentAnswer?.answer === question.conditionalBlock!.value;
    });
  };

  useEffect(() => {
    const fetchQuestions = async () => {
      setLoading(true);
      try {
        const response = await fetch('/questions.json');
        const data: TQuestion[] = await response.json();
        setQuestions(data);
        // Load answers from localStorage and filter the questions accordingly
        const savedAnswers = JSON.parse(localStorage.getItem('quiz-answers') || '[]') as TAnswer[];
        const filteredQuestions = getFilteredQuestions(data, savedAnswers);

        setFilteredQuestions(filteredQuestions);
        setAnswers(savedAnswers);

        // Determine the next unanswered question or reset to a valid question
        const lastAnsweredIndex = savedAnswers.findIndex((answer) => !answer.completed);
        if (lastAnsweredIndex !== -1) {
          setCurrentQuestionIndex(lastAnsweredIndex);
        } else {
          setCurrentQuestionIndex(savedAnswers.length);
        }
      } catch (error) {
        console.error('Failed to fetch questions', error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  const handleAnswer = useCallback(
    (questionId: number, answer: string) => {
      const timeSpent = Date.now() - startTime;
      const updatedAnswers = [...answers];
      updatedAnswers[currentQuestionIndex] = {
        questionId,
        answer,
        timeSpent,
        completed: true,
      };
      setAnswers(updatedAnswers);
      localStorage.setItem('quiz-answers', JSON.stringify(updatedAnswers));

      // Re-filter the questions based on the updated answers
      const updatedQuestions = getFilteredQuestions(questions, updatedAnswers);
      setFilteredQuestions(updatedQuestions);

      // Determine the next valid question index
      let nextQuestionIndex = currentQuestionIndex + 1;

      // If the next question index is out of bounds after filtering, reset it to the last valid question
      if (nextQuestionIndex >= updatedQuestions.length) {
        nextQuestionIndex = updatedQuestions.length - 1;
      }

      setCurrentQuestionIndex(nextQuestionIndex);
      setStartTime(Date.now());
    },
    [startTime, answers, currentQuestionIndex, questions],
  );

  const handlePrevious = () => {
    const prevQuestionIndex = currentQuestionIndex - 1;
    if (prevQuestionIndex >= 0) {
      setCurrentQuestionIndex(prevQuestionIndex);
    }
  };

  const handleReset = () => {
    setAnswers([]);
    setCurrentQuestionIndex(0);
    localStorage.removeItem('quiz-answers');
  };

  const renderQuestion = (question: TQuestion) => {
    switch (question.type) {
      case 'select-sex':
        return (
          <QuestionSelectSex
            question={question}
            currentAnswer={answers[currentQuestionIndex]?.answer || ''}
            onNext={handleAnswer}
          />
        );

      case 'single-variant':
        return (
          <QuestionSingleVariant
            question={question}
            currentAnswer={answers[currentQuestionIndex]?.answer || ''}
            onNext={handleAnswer}
          />
        );

      case 'custom-input':
        return (
          <QuestionCustomInput
            questionId={question.id}
            currentAnswer={answers[currentQuestionIndex]?.answer || ''}
            onNext={handleAnswer}
          />
        );
      case 'completion':
        // eslint-disable-next-line no-case-declarations
        const totalTime = answers.reduce((acc, cur) => acc + cur.timeSpent, 0);
        return (
          <div className="flex flex-col gap-y-4">
            <p>Total Time Spent: {Math.round(totalTime / 1000)} seconds</p>
            <button
              className="self-center px-14 py-4 rounded-md bg-orange-200 text-lg font-semibold"
              onClick={handleReset}
            >
              Reset
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  const currentQuestion = filteredQuestions[currentQuestionIndex];

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!filteredQuestions.length) {
    return <div>No questions available</div>;
  }

  return (
    <div className="flex justify-center">
      <div className="bg-white shadow-xl w-[600px] px-10 py-4">
        <div className="flex justify-between mb-6">
          <button onClick={handlePrevious}>Back</button>
          <h2>GOALS</h2>
          <p>{`${currentQuestionIndex + 1}/${filteredQuestions.length}`}</p>
        </div>
        <ProgressBar currentQuestionIndex={currentQuestionIndex + 1} totalQuestions={filteredQuestions.length} />
        <div className="py-10">
          <h3 className="text-2xl font-semibold italic">{currentQuestion.question}</h3>
          {currentQuestion.subTitle && <p className="my-6">{currentQuestion.subTitle}</p>}
          {renderQuestion(currentQuestion)}
        </div>
      </div>
    </div>
  );
};

export default Quiz;
