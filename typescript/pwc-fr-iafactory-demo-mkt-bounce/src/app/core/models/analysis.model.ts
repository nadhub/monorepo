// analysis.model.ts - Analysis Data Models

import { ClassificationType, ActionType } from './classification.model';
import { Contact } from './contact.model';

export interface EmailInput {
  sender: string;
  body: string;
}

export interface Classification {
  type: ClassificationType;
  confidence: number;
  explanation: string;
}

export interface AnalysisAction {
  type: ActionType;
  description: string;
}

export interface AnalysisResult {
  input: EmailInput;
  classification: Classification;
  action: AnalysisAction;
  extractedContacts: Contact[];
  processingTime: number;
  timestamp: Date;
}

export interface Analysis {
  id: string;
  timestamp: Date;
  result: AnalysisResult;
}

export interface AnalysisMetrics {
  totalAnalyses: number;
  successRate: number;
  averageProcessingTime: number;
  activeClassifications: number;
}

export interface ClassificationCount {
  classification: ClassificationType;
  count: number;
  percentage: number;
}

export interface HistoryFilters {
  dateFrom?: Date;
  dateTo?: Date;
  classification?: ClassificationType;
  searchText?: string;
}
