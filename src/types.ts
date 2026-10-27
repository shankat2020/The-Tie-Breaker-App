export interface DecisionOption {
  id: string;
  name: string;
  description: string;
  tag: string;
}

export interface ProConItem {
  id: string;
  title: string;
  explanation: string;
  impact: 'high' | 'medium' | 'low';
  category: string;
  userAdded?: boolean;
}

export interface OptionProsCons {
  optionId: string;
  optionName: string;
  netAssessment: string;
  pros: ProConItem[];
  cons: ProConItem[];
}

export interface CriterionScore {
  optionId: string;
  score: number; // 1 to 10
  reasoning: string;
}

export interface MatrixCriterion {
  id: string;
  name: string;
  category: string;
  description: string;
  weight: number; // 1 to 5
  scores: CriterionScore[];
}

export interface ComparisonMatrix {
  criteria: MatrixCriterion[];
}

export interface OptionSwot {
  optionId: string;
  optionName: string;
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
  keyTakeaway: string;
}

export interface DecisionTrigger {
  optionId: string;
  optionName: string;
  condition: string;
  recommendedAction: string;
}

export interface TieBreakerVerdict {
  winnerOptionId: string;
  verdictHeadline: string;
  verdictRationale: string;
  confidenceScore: number; // 0 to 100
  decisionType: string;
  reversibilityAdvice: string;
  triggers: DecisionTrigger[];
  tenTenTen: {
    tenMinutes: string;
    tenMonths: string;
    tenYears: string;
  };
  worstCasePreMortem: {
    scenario: string;
    safeguard: string;
  };
  bestFriendAdvice: string;
}

export interface DecisionAnalysis {
  id: string;
  createdAt?: string;
  rawDecision?: string;
  title: string;
  summary: string;
  category: string;
  options: DecisionOption[];
  prosCons: OptionProsCons[];
  comparisonMatrix: ComparisonMatrix;
  swot: OptionSwot[];
  tieBreakerVerdict: TieBreakerVerdict;
  notes?: string;
}

export interface GutCheckQuestion {
  id: string;
  question: string;
  reveals: string;
  scenario: string;
}
