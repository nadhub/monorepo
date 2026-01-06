// mock-data.service.ts - Mock Data Generation Service

import { Injectable, signal } from '@angular/core';
import { AnalysisResult, Classification, AnalysisAction } from '../models/analysis.model';
import { ClassificationType, ActionType } from '../models/classification.model';
import { Contact } from '../models/contact.model';

@Injectable({
  providedIn: 'root'
})
export class MockDataService {
  private mockDelay = signal(800);

  async simulateDelay(): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, this.mockDelay()));
  }

  generateMockAnalysis(sender: string, body: string): AnalysisResult {
    const classification = this.determineClassification(body);
    const action = this.determineAction(classification.type);
    const contacts = this.extractContacts(body);

    return {
      input: { sender, body },
      classification,
      action,
      extractedContacts: contacts,
      processingTime: Math.floor(Math.random() * 500) + 100,
      timestamp: new Date()
    };
  }

  private determineClassification(body: string): Classification {
    const bodyLower = body.toLowerCase();
    
    let type: ClassificationType;
    let confidence: number;
    let explanation: string;

    if (bodyLower.includes('user unknown') || bodyLower.includes('550')) {
      type = 'HARD_BOUNCE';
      confidence = 0.95;
      explanation = 'Recipient address does not exist on the destination server.';
    } else if (bodyLower.includes('mailbox full') || bodyLower.includes('452')) {
      type = 'SOFT_BOUNCE';
      confidence = 0.90;
      explanation = 'Recipient mailbox is full. Email may be delivered later.';
    } else if (bodyLower.includes('blocked') || bodyLower.includes('554')) {
      type = 'BLOCK';
      confidence = 0.92;
      explanation = 'Email blocked by recipient server policy or spam filter.';
    } else if (bodyLower.includes('spam') || bodyLower.includes('junk')) {
      type = 'SPAM';
      confidence = 0.88;
      explanation = 'Email identified as spam by recipient server.';
    } else {
      type = 'INVALID_ADDRESS';
      confidence = 0.85;
      explanation = 'Email address format is invalid or malformed.';
    }

    return { type, confidence, explanation };
  }

  private determineAction(classificationType: ClassificationType): AnalysisAction {
    const actionMap: Record<ClassificationType, { type: ActionType; description: string }> = {
      HARD_BOUNCE: {
        type: 'REMOVE',
        description: 'Remove this email address from your mailing list immediately.'
      },
      SOFT_BOUNCE: {
        type: 'RETRY',
        description: 'Retry sending after 24-48 hours. Remove if bounces persist.'
      },
      BLOCK: {
        type: 'MANUAL_REVIEW',
        description: 'Review sender reputation and email content. Contact recipient if needed.'
      },
      SPAM: {
        type: 'UPDATE',
        description: 'Review and update email content to avoid spam triggers.'
      },
      INVALID_ADDRESS: {
        type: 'UPDATE',
        description: 'Verify and correct the email address format.'
      }
    };

    return actionMap[classificationType];
  }

  private extractContacts(body: string): Contact[] {
    const contacts: Contact[] = [];
    const emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi;
    const matches = body.match(emailRegex);

    if (matches) {
      matches.slice(0, 3).forEach((email, index) => {
        contacts.push({
          email,
          name: `Contact ${index + 1}`,
          role: index === 0 ? 'Primary' : 'Secondary'
        });
      });
    }

    return contacts;
  }

}
