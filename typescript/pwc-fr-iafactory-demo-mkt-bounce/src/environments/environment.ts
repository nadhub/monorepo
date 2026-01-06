// environment.ts - Development Configuration
//
// ⚠️ DEPRECATED: Ce fichier est conservé pour la rétrocompatibilité
// mais ne doit PAS être utilisé pour les configurations sensibles.
//
// ✅ Utilisez ConfigService à la place:
//    import { ConfigService } from './core/services/config.service';
//    constructor(private config: ConfigService) {}
//    this.config.apiUrl
//
// Les valeurs de configuration DOIVENT être fournies par le ConfigMap Kubernetes
// via window.__env (injecté au runtime par le fichier env.js)

export const environment = {
  // Ces valeurs sont des fallbacks pour le développement local uniquement
  // En production, elles sont overridées par ConfigService qui lit window.__env
  production: false,
  
  // ⚠️ Ne pas utiliser directement - Utiliser ConfigService.apiUrl
  apiUrl: 'http://localhost:8080/api',
  
  // Propriétés de développement local uniquement
  mockDelay: 1000,
  enableDevTools: true,
  logLevel: 'debug'
};
