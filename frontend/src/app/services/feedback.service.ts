import api from './api';

export interface SusQuestion {
  id: string;
  question: string;
  isPositive: boolean;
  order: number;
}

export interface SusSurvey {
  id: string;
  title: string;
  description: string | null;
  questions: SusQuestion[];
}

export interface SusSurveyWithCount extends SusSurvey {
  isActive: boolean;
  createdAt: string;
  _count: { responses: number };
}

export interface FeedbackAnswer {
  questionId: string;
  rating: number;
}

export interface FeedbackStatus {
  hasSubmitted: boolean;
  lastSubmittedAt: string | null;
}

export interface FeedbackResults {
  survey: { id: string; title: string };
  totalResponses: number;
  totalStudents: number;
  averageSusScore: number;
  perQuestionAverages: {
    questionId: string;
    question: string;
    isPositive: boolean;
    order: number;
    averageRating: number;
  }[];
  scoreDistribution: { range: string; count: number }[];
  recentResponses: {
    userId: string;
    firstName: string;
    lastName: string;
    email: string;
    susScore: number;
    completedAt: string;
  }[];
}

// Student endpoints
export const getActiveSurvey = () =>
  api.get<{ survey: SusSurvey }>('/feedback/survey').then(r => r.data);

export const getFeedbackStatus = () =>
  api.get<FeedbackStatus>('/feedback/status').then(r => r.data);

export const submitFeedback = (surveyId: string, answers: FeedbackAnswer[]) =>
  api.post<{ susScore: number; id: string }>('/feedback/submit', { surveyId, answers }).then(r => r.data);

// Admin endpoints
export const getFeedbackResults = () =>
  api.get<FeedbackResults>('/admin/feedback/results').then(r => r.data);

export const getAllSurveys = () =>
  api.get<{ surveys: SusSurveyWithCount[] }>('/admin/feedback/surveys').then(r => r.data.surveys);

export const updateSurveyAdmin = (id: string, data: { title?: string; description?: string | null; isActive?: boolean }) =>
  api.put<{ message: string; survey: SusSurveyWithCount }>(`/admin/feedback/surveys/${id}`, data).then(r => r.data);

export const createQuestionAdmin = (data: { surveyId: string; question: string; isPositive: boolean; order: number }) =>
  api.post<{ message: string; question: SusQuestion }>('/admin/feedback/questions', data).then(r => r.data);

export const updateQuestionAdmin = (id: string, data: { question?: string; isPositive?: boolean; order?: number }) =>
  api.put<{ message: string; question: SusQuestion }>(`/admin/feedback/questions/${id}`, data).then(r => r.data);

export const deleteQuestionAdmin = (id: string) =>
  api.delete<{ message: string }>(`/admin/feedback/questions/${id}`).then(r => r.data);

export const reorderQuestionsAdmin = (questionOrders: { id: string; order: number }[]) =>
  api.put<{ message: string }>('/admin/feedback/questions/reorder', { questionOrders }).then(r => r.data);
