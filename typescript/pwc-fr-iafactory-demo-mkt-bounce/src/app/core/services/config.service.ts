import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private config = environment;

  get production(): boolean {
    return this.config.production || false;
  }

  get apiUrl(): string {
    return this.config.apiUrl || 'http://localhost:8000/api';
  }

  get baseUrl(): string {
    return this.config.baseUrl || 'http://localhost:8000';
  }

  get basePath(): string {
    return this.config.basePath || '';
  }

  get appName(): string {
    return this.config.appName || 'PwC MKT Bounce Analyzer';
  }

  get version(): string {
    return this.config.version || '1.0.0';
  }

  get enableMockServices(): boolean {
    return this.config.enableMockServices || false;
  }

  get logLevel(): string {
    return this.config.logLevel || 'info';
  }

  get apiEndpoints(): any {
    return this.config.apiEndpoints || {
      analyze: '/api/analyze-autoreply/v1/analyze',
      health: '/api/health'
    };
  }

  get fileUpload(): any {
    return this.config.fileUpload || {
      maxSize: 10 * 1024 * 1024, // 10MB
      allowedTypes: [
        'application/pdf',
        'text/plain',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ]
    };
  }

  // La configuration est maintenant chargée directement depuis environment.prod.ts
  // qui est généré au moment du build avec les variables d'environnement
  loadConfig(): Promise<void> {
    return Promise.resolve();
  }

  // Méthode pour obtenir toute la configuration (utile pour le debug)
  getFullConfig(): any {
    return this.config;
  }
}