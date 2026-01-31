import api from './api';

// ============================================
// TYPES
// ============================================

export type PhishingAction = 'REPORTED' | 'MARKED_SAFE' | 'CLICKED_LINK' | 'DELETED' | 'IGNORED';

export interface PhishingScenario {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  category: string;
  senderName: string;
  senderEmail: string;
  subject: string;
  body: string;
  attachments: string[];
}

export interface PhishingProgress {
  completed: number;
  total: number;
  allCompleted: boolean;
  allCorrect: boolean;
}

export interface ScenarioResponse {
  scenario: PhishingScenario | null;
  progress: PhishingProgress;
}

export interface PhishingScenarioFull extends PhishingScenario {
  isActive: boolean;
  isPhishing: boolean;
  redFlags: string[];
  legitimateReason: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AttemptResult {
  attemptId: string;
  isCorrect: boolean;
  wasPhishing: boolean;
  userAction: PhishingAction;
  redFlags: string[];
  legitimateReason: string | null;
  explanation: string;
}

export interface PhishingStats {
  totalAttempts: number;
  correctAttempts: number;
  accuracy: number;
  clickRate: number;
  reportRate: number;
  streak: number;
  avgResponseTimeMs: number;
  byDifficulty: {
    difficulty: string;
    total: number;
    correct: number;
    accuracy: number;
  }[];
}

export interface PhishingAttemptHistory {
  id: string;
  scenarioId: string;
  scenarioTitle: string;
  difficulty: string;
  category: string;
  senderName: string;
  senderEmail: string;
  subject: string;
  wasPhishing: boolean;
  userAction: PhishingAction;
  isCorrect: boolean;
  responseTimeMs: number;
  attemptedAt: string;
}

export interface PhishingHistoryResponse {
  attempts: PhishingAttemptHistory[];
  total: number;
  limit: number;
  offset: number;
}

// Admin types
export interface ScenarioWithStats {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  category: string;
  isActive: boolean;
  senderName: string;
  senderEmail: string;
  subject: string;
  isPhishing: boolean;
  redFlagsCount: number;
  createdAt: string;
  updatedAt: string;
  stats: {
    totalAttempts: number;
    correctAttempts: number;
    accuracy: number;
    clickRate: number | null;
  };
}

export interface CreateScenarioRequest {
  title: string;
  description: string;
  difficulty?: string;
  category?: string;
  isActive?: boolean;
  senderName: string;
  senderEmail: string;
  subject: string;
  body: string;
  attachments?: string[];
  isPhishing: boolean;
  redFlags?: string[];
  legitimateReason?: string;
}

export interface UpdateScenarioRequest extends CreateScenarioRequest {}

export interface AdminPhishingStats {
  overview: {
    totalAttempts: number;
    correctAttempts: number;
    overallAccuracy: number;
    clickRate: number;
    reportRate: number;
    uniqueUsers: number;
    totalScenarios: number;
    activeScenarios: number;
    avgResponseTimeMs: number;
  };
  byDifficulty: {
    difficulty: string;
    total: number;
    correct: number;
    accuracy: number;
  }[];
  byCategory: {
    category: string;
    total: number;
    correct: number;
    accuracy: number;
  }[];
}

export interface AdminPhishingAttempt {
  id: string;
  user: {
    id: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
  };
  scenario: {
    id: string;
    title: string;
    difficulty: string;
    category: string;
    isPhishing: boolean;
  };
  userAction: PhishingAction;
  isCorrect: boolean;
  responseTimeMs: number;
  attemptedAt: string;
}

export interface AdminAttemptsResponse {
  attempts: AdminPhishingAttempt[];
  total: number;
  limit: number;
  offset: number;
}

// ============================================
// SERVICE
// ============================================

const phishingService = {
  // ============================================
  // STUDENT ENDPOINTS
  // ============================================

  // Get next scenario (prioritizes unseen, then failed)
  async getNextScenario(): Promise<ScenarioResponse> {
    const response = await api.get<ScenarioResponse>('/phishing/scenario');
    return response.data;
  },

  // Submit attempt
  async submitAttempt(
    scenarioId: string,
    action: PhishingAction,
    responseTimeMs: number
  ): Promise<AttemptResult> {
    const response = await api.post<AttemptResult>('/phishing/attempt', {
      scenarioId,
      action,
      responseTimeMs
    });
    return response.data;
  },

  // Get user's stats
  async getStats(): Promise<PhishingStats> {
    const response = await api.get<PhishingStats>('/phishing/stats');
    return response.data;
  },

  // Get attempt history
  async getHistory(limit: number = 20, offset: number = 0): Promise<PhishingHistoryResponse> {
    const response = await api.get<PhishingHistoryResponse>('/phishing/history', {
      params: { limit, offset }
    });
    return response.data;
  },

  // ============================================
  // ADMIN ENDPOINTS
  // ============================================

  // Get all scenarios with stats
  async getAllScenarios(): Promise<ScenarioWithStats[]> {
    const response = await api.get<{ scenarios: ScenarioWithStats[] }>('/admin/phishing/scenarios');
    return response.data.scenarios;
  },

  // Get scenario by ID
  async getScenarioById(id: string): Promise<PhishingScenarioFull & { stats: { totalAttempts: number; correctAttempts: number; accuracy: number } }> {
    const response = await api.get(`/admin/phishing/scenarios/${id}`);
    return response.data;
  },

  // Create scenario
  async createScenario(data: CreateScenarioRequest): Promise<{ message: string; scenario: PhishingScenarioFull }> {
    const response = await api.post<{ message: string; scenario: PhishingScenarioFull }>('/admin/phishing/scenarios', data);
    return response.data;
  },

  // Update scenario
  async updateScenario(id: string, data: UpdateScenarioRequest): Promise<{ message: string; scenario: PhishingScenarioFull }> {
    const response = await api.put<{ message: string; scenario: PhishingScenarioFull }>(`/admin/phishing/scenarios/${id}`, data);
    return response.data;
  },

  // Delete scenario
  async deleteScenario(id: string): Promise<{ message: string; deletedAttempts: number }> {
    const response = await api.delete<{ message: string; deletedAttempts: number }>(`/admin/phishing/scenarios/${id}`);
    return response.data;
  },

  // Get platform-wide stats
  async getPlatformStats(): Promise<AdminPhishingStats> {
    const response = await api.get<AdminPhishingStats>('/admin/phishing/stats');
    return response.data;
  },

  // Get all attempts (filterable)
  async getAllAttempts(
    limit: number = 50,
    offset: number = 0,
    filters?: { userId?: string; scenarioId?: string; isCorrect?: boolean }
  ): Promise<AdminAttemptsResponse> {
    const params: Record<string, string | number | boolean> = { limit, offset };
    if (filters?.userId) params.userId = filters.userId;
    if (filters?.scenarioId) params.scenarioId = filters.scenarioId;
    if (filters?.isCorrect !== undefined) params.isCorrect = filters.isCorrect;

    const response = await api.get<AdminAttemptsResponse>('/admin/phishing/attempts', { params });
    return response.data;
  }
};

export default phishingService;
