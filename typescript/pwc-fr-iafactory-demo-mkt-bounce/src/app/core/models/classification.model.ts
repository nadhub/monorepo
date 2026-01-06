// classification.model.ts - Classification Types and Information

export type ClassificationType = 
  | 'HARD_BOUNCE'
  | 'SOFT_BOUNCE'
  | 'BLOCK'
  | 'SPAM'
  | 'INVALID_ADDRESS';

export type ActionType = 
  | 'REMOVE'
  | 'RETRY'
  | 'UPDATE'
  | 'MANUAL_REVIEW'
  | 'NONE';

export interface ClassificationInfo {
  type: ClassificationType;
  description: string;
  severity: 'high' | 'medium' | 'low';
  badgeVariant: 'error' | 'warning' | 'info' | 'success' | 'neutral';
}

export const CLASSIFICATION_INFO: Record<ClassificationType, ClassificationInfo> = {
  HARD_BOUNCE: {
    type: 'HARD_BOUNCE',
    description: 'Permanent delivery failure',
    severity: 'high',
    badgeVariant: 'error'
  },
  SOFT_BOUNCE: {
    type: 'SOFT_BOUNCE',
    description: 'Temporary delivery failure',
    severity: 'medium',
    badgeVariant: 'warning'
  },
  BLOCK: {
    type: 'BLOCK',
    description: 'Blocked by recipient server',
    severity: 'high',
    badgeVariant: 'error'
  },
  SPAM: {
    type: 'SPAM',
    description: 'Marked as spam',
    severity: 'medium',
    badgeVariant: 'warning'
  },
  INVALID_ADDRESS: {
    type: 'INVALID_ADDRESS',
    description: 'Invalid email address format',
    severity: 'high',
    badgeVariant: 'error'
  }
};
