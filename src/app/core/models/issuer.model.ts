export type Outlook = 'Positive' | 'Stable' | 'Negative';
export type RatingAction = 'Upgrade' | 'Downgrade' | 'Affirmed';
export type DriverCategory = 'Financial' | 'Operational' | 'Market' | 'Governance';
export type DriverImpact = 'Positive' | 'Negative' | 'Neutral';

export interface Issuer {
  id: string;
  name: string;
  industry: string;
  rating: string;
  outlook: Outlook;
  lastUpdated: string;
  country: string;
}

export interface RatingHistory {
  date: string;
  rating: string;
  action: RatingAction;
  rationale: string;
}

export interface KeyDriver {
  id: string;
  category: DriverCategory;
  title: string;
  impact: DriverImpact;
  score: number;
  description: string;
}

export interface AIInsight {
  summary: string;
  confidence: number;
  generatedAt: string;
}

export interface IssuerDetailResponse {
  issuer: Issuer;
  history: RatingHistory[];
  drivers: KeyDriver[];
  aiInsight: AIInsight;
}
