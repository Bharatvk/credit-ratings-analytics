export type FeedbackRole = 'Credit Analyst' | 'Portfolio Manager' | 'Risk Manager' | 'Other';

export interface FeedbackRequest {
  issuerId: string;
  user: {
    name: string;
    email: string;
    role: FeedbackRole;
    organization?: string;
  };
  ratings: {
    accuracy: number;
    driverRelevance: number;
    aiInsightQuality: number;
    timeliness: number;
  };
  feedback: {
    agreedDrivers: string[];
    disagreedDrivers: string[];
    additionalFactors?: string;
    comments?: string;
  };
  metadata: {
    submittedAt: string;
    version: string;
  };
}

export interface FeedbackResponse {
  success: boolean;
  feedbackId: string;
  message: string;
}
