export type QuestionType = 'select-sex' | 'single-variant' | 'custom-input' | 'completion';

export interface TQuestion {
  id: number;
  type: QuestionType;
  question: string;
  subTitle?: string;
  options?: string[];
  additionalOptions?: {
    hideNextButton?: boolean;
  };
  conditionalBlock?: {
    dependsOn: number;
    value: string;
  };
}

export interface TAnswer {
  questionId: number;
  answer: string;
  timeSpent: number;
  completed: boolean;
}
