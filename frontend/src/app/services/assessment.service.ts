import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

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

export interface FullAssessmentSubmission {
  score: number;
  totalQuestions: number;
  percentage: number;
  passed: boolean;
  timeSpent?: number;
  timerExpired?: boolean;
  answers: any;
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
  const token = localStorage.getItem('token');
  const response = await axios.get(`${API_BASE_URL}/api/assessment/intro/check`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

// Get intro assessment
export const getIntroAssessment = async (): Promise<IntroAssessment> => {
  const token = localStorage.getItem('token');
  const response = await axios.get(`${API_BASE_URL}/api/assessment/intro`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

// Submit intro assessment
export const submitIntroAssessment = async (
  assessmentId: string,
  answers: IntroAssessmentAnswer[]
): Promise<IntroAssessmentResult> => {
  const token = localStorage.getItem('token');
  const response = await axios.post(
    `${API_BASE_URL}/api/assessment/intro/submit`,
    { assessmentId, answers },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};

// Check eligibility for full assessment
export const checkFullAssessmentEligibility = async (): Promise<{ eligible: boolean; reason?: string }> => {
  const token = localStorage.getItem('token');
  const response = await axios.get(`${API_BASE_URL}/api/assessment/full/check-eligibility`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

// Submit full assessment
export const submitFullAssessment = async (
  submission: FullAssessmentSubmission
): Promise<{ attemptId: string; score: number; totalQuestions: number; percentage: number; passed: boolean; completedAt: string }> => {
  const token = localStorage.getItem('token');
  const response = await axios.post(
    `${API_BASE_URL}/api/assessment/full/submit`,
    submission,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};

// Get assessment history
export const getAssessmentHistory = async (): Promise<AssessmentHistory> => {
  const token = localStorage.getItem('token');
  const response = await axios.get(`${API_BASE_URL}/api/assessment/history`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};
