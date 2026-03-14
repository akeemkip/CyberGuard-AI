import api from './api';

export interface IntroAssessmentQuestion {
  id: string;
  question: string;
  options: string[];
  courseTitle: string;
  order: number;
}

export interface IntroAssessment {
  id: string;
  title: string;
  description: string | null;
  passingScore: number;
  questions: IntroAssessmentQuestion[];
}

export interface IntroAssessmentAnswer {
  questionId: string;
  selectedAnswer: number;
}

export interface IntroAssessmentResult {
  attemptId: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  passed: boolean;
  answers: {
    questionId: string;
    selectedAnswer: number;
    correctAnswer: number;
    isCorrect: boolean;
    explanation: string | null;
  }[];
}

export interface FullAssessmentQuestion {
  id: number;
  question: string;
  options: string[];
  topic: string;
}

export interface FullAssessmentData {
  title: string;
  passingScore: number;
  totalQuestions: number;
  questions: FullAssessmentQuestion[];
}

export interface FullAssessmentSubmission {
  timeSpent?: number;
  timerExpired?: boolean;
  answers: { questionId: number; userAnswer: number }[];
}

export interface FullAssessmentResult {
  attemptId: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  passed: boolean;
  completedAt: string;
  answers: {
    questionId: number;
    userAnswer: number;
    isCorrect: boolean;
    correctAnswer: number;
    explanation: string;
  }[];
}

export interface AssessmentHistory {
  introAttempts: {
    id: string;
    title: string;
    score: number;
    totalQuestions: number;
    percentage: number;
    passed: boolean;
    completedAt: string;
    type: 'intro';
  }[];
  fullAttempts: {
    id: string;
    title: string;
    score: number;
    totalQuestions: number;
    percentage: number;
    passed: boolean;
    timeSpent: number | null;
    timerExpired: boolean;
    completedAt: string;
    type: 'full';
  }[];
}

// Check if user needs to take intro assessment
export const checkIntroAssessmentRequired = async (): Promise<{ required: boolean; completed: boolean }> => {
  const response = await api.get('/assessment/intro/check');
  return response.data;
};

// Get intro assessment
export const getIntroAssessment = async (): Promise<IntroAssessment> => {
  const response = await api.get('/assessment/intro');
  return response.data;
};

// Submit intro assessment
export const submitIntroAssessment = async (
  assessmentId: string,
  answers: IntroAssessmentAnswer[]
): Promise<IntroAssessmentResult> => {
  const response = await api.post('/assessment/intro/submit', { assessmentId, answers });
  return response.data;
};

// Check eligibility for full assessment
export const checkFullAssessmentEligibility = async (): Promise<{ eligible: boolean; reason?: string }> => {
  const response = await api.get('/assessment/full/check-eligibility');
  return response.data;
};

// Get full assessment questions (correct answers withheld by server)
export const getFullAssessmentQuestions = async (): Promise<FullAssessmentData> => {
  const response = await api.get('/assessment/full/questions');
  return response.data;
};

// Submit full assessment - server validates and calculates score
export const submitFullAssessment = async (
  submission: FullAssessmentSubmission
): Promise<FullAssessmentResult> => {
  const response = await api.post('/assessment/full/submit', submission);
  return response.data;
};

// Get assessment history
export const getAssessmentHistory = async (): Promise<AssessmentHistory> => {
  const response = await api.get('/assessment/history');
  return response.data;
};
