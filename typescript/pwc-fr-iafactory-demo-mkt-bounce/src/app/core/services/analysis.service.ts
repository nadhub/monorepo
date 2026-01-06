// analysis.service.ts - Analysis State Management Service

import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import {
  Analysis,
  AnalysisMetrics,
  ClassificationCount
} from '../models/analysis.model';
import {
  AnalyzeEmailRequest,
  AnalyzeEmailResponse
} from '../models/api-response.model';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class AnalysisService {
  private http = inject(HttpClient);
  private config = inject(ConfigService);
  private apiUrl = this.config.apiUrl;
  
  private _analyses = signal<Analysis[]>([]);
  private _loading = signal<boolean>(false);
  private _error = signal<string | null>(null);
  private _apiResponse = signal<AnalyzeEmailResponse | null>(null);

  readonly analyses = this._analyses.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();
  readonly apiResponse = this._apiResponse.asReadonly();

  readonly metrics = computed<AnalysisMetrics>(() => {
    const analyses = this._analyses();
    
    return {
      totalAnalyses: analyses.length,
      successRate: 94.5,
      averageProcessingTime: 245,
      activeClassifications: 5
    };
  });

  readonly recentAnalyses = computed<Analysis[]>(() => {
    return this._analyses().slice(0, 10);
  });

  readonly classificationDistribution = computed<ClassificationCount[]>(() => {
    const analyses = this._analyses();
    const total = analyses.length;
    
    if (total === 0) return [];

    const counts = new Map<string, number>();
    analyses.forEach(a => {
      const type = a.result.classification.type;
      counts.set(type, (counts.get(type) || 0) + 1);
    });

    return Array.from(counts.entries()).map(([classification, count]) => ({
      classification: classification as any,
      count,
      percentage: (count / total) * 100
    }));
  });

  async analyzeEmail(sender: string, body: string): Promise<AnalyzeEmailResponse> {
    this._loading.set(true);
    this._error.set(null);
    this._apiResponse.set(null);

    try {
      const request: AnalyzeEmailRequest = { sender, body };
      
      // Log détaillé pour déboguer
      console.log('🔍 [AnalysisService] Début de l\'analyse');
      console.log('📧 [AnalysisService] Sender:', sender);
      console.log('📝 [AnalysisService] Body length:', body.length);
      console.log('🌐 [AnalysisService] API URL:', this.apiUrl);
      console.log('🔗 [AnalysisService] Full endpoint:', `${this.apiUrl}/analyze_autoreply/v1/analyze`);
      console.log('📤 [AnalysisService] Request payload:', request);
      
      const response = await firstValueFrom(
        this.http.post<AnalyzeEmailResponse>(
          `${this.apiUrl}/analyze_autoreply/v1/analyze`,
          request
        )
      );

      console.log('✅ [AnalysisService] Response reçue:', response);
      console.log('📊 [AnalysisService] Nombre de résultats:', response.results?.length || 0);
      
      this._apiResponse.set(response);
      
      // Store in history (optional - keeping for backwards compatibility)
      const analysis: Analysis = {
        id: `analysis-${Date.now()}`,
        timestamp: new Date(),
        result: {
          input: { sender, body },
          classification: {
            type: response.results[0]?.classification as any || 'HARD_BOUNCE',
            confidence: 0.95,
            explanation: response.results[0]?.explanation || ''
          },
          action: {
            type: response.results[0]?.action_type as any || 'REMOVE',
            description: response.results[0]?.action_type || ''
          },
          extractedContacts: [],
          processingTime: 0,
          timestamp: new Date()
        }
      };
      
      this._analyses.update(analyses => [analysis, ...analyses]);
      
      return response;
    } catch (error) {
      console.error('❌ [AnalysisService] Erreur lors de l\'analyse:', error);
      
      if (error instanceof HttpErrorResponse) {
        console.error('🚨 [AnalysisService] HTTP Error Details:');
        console.error('   - Status:', error.status);
        console.error('   - Status Text:', error.statusText);
        console.error('   - Message:', error.message);
        console.error('   - URL:', error.url);
        console.error('   - Error:', error.error);
        
        // Status 0 = Erreur réseau (backend non disponible)
        if (error.status === 0) {
          const errorMessage = `❌ Backend non disponible à l'adresse: ${this.apiUrl}\n\nVérifiez que le serveur backend est démarré et accessible.`;
          this._error.set(errorMessage);
          throw new Error(errorMessage);
        }
        
        const errorMessage = `API Error: ${error.status} - ${error.message}`;
        this._error.set(errorMessage);
        throw error;
      }
      
      const errorMessage = 'Failed to analyze email';
      this._error.set(errorMessage);
      throw error;
    } finally {
      this._loading.set(false);
    }
  }

  async analyzeBatch(emails: Array<{ sender: string; body: string }>): Promise<AnalyzeEmailResponse[]> {
    const results: AnalyzeEmailResponse[] = [];
    
    for (const email of emails) {
      const response = await this.analyzeEmail(email.sender, email.body);
      results.push(response);
    }
    
    return results;
  }


  exportResults(analyses: Analysis[], format: 'json' | 'csv'): void {
    if (format === 'json') {
      const dataStr = JSON.stringify(analyses, null, 2);
      this.downloadFile(dataStr, 'analyses.json', 'application/json');
    } else {
      const csv = this.convertToCSV(analyses);
      this.downloadFile(csv, 'analyses.csv', 'text/csv');
    }
  }

  private convertToCSV(analyses: Analysis[]): string {
    const headers = ['ID', 'Timestamp', 'Sender', 'Classification', 'Action', 'Confidence'];
    const rows = analyses.map(a => [
      a.id,
      a.timestamp.toISOString(),
      a.result.input.sender,
      a.result.classification.type,
      a.result.action.type,
      (a.result.classification.confidence * 100).toFixed(1) + '%'
    ]);

    return [headers, ...rows].map(row => row.join(',')).join('\n');
  }

  private downloadFile(content: string, filename: string, mimeType: string): void {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  }
}
