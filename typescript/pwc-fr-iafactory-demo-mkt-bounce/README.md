# 🎨 Frontend - PwC MKT Bounce Analyzer

Application Angular 19 pour l'analyse d'emails automatiques avec interface utilisateur moderne et design system PwC.

## 📋 Architecture

```
frontend/
├── src/
│   ├── app/
│   │   ├── core/                    # Services et modèles métier
│   │   │   ├── models/              # Interfaces TypeScript
│   │   │   └── services/            # Services (API, theme, i18n)
│   │   ├── features/                # Modules fonctionnels
│   │   │   └── analysis/            # Module d'analyse d'emails
│   │   ├── shared/                  # Composants réutilisables
│   │   │   └── components/ui/       # Bibliothèque UI (button, card, badge)
│   │   └── layout/                  # En-tête et pied de page
│   ├── environments/                # Configuration par environnement
│   │   ├── environment.ts           # Développement
│   │   └── environment.prod.ts      # Production
│   └── styles/                      # Styles globaux (design system PwC)
├── angular.json                     # Configuration Angular
├── package.json                     # Dépendances npm
├── install.sh                       # Script d'installation
└── cli.sh                           # Script de build + lancement
```

## 🚀 Installation et Démarrage

### Prérequis

- Node.js 18+ et npm
- Angular CLI 19+

### Installation des dépendances

```bash
cd frontend
./install.sh
```

Le script va:
1. Vérifier que Node.js est installé
2. Installer toutes les dépendances npm

### Lancement de l'application

```bash
cd frontend
./cli.sh
```

Le script va:
1. Builder l'application en mode production
2. Démarrer un serveur HTTP sur le port configuré

## 🔐 Variables d'Environnement

### ⚠️ IMPORTANT
**NE JAMAIS utiliser de fichiers `.env`** - Toutes les variables doivent être fournies par **ConfigMap Kubernetes** via le fichier `env.js` injecté au runtime.

### Variables Obligatoires

| Variable | Description | Exemple | Source |
|----------|-------------|---------|--------|
| `FRONTEND_PORT` | Port d'écoute du serveur frontend | `4200` | ConfigMap |
| `BASE_HREF` | Chemin de base de l'application | `/front` ou `/` | ConfigMap |

### Variables d'Application (via env.js)

Ces variables sont injectées dans `window.__env` par le ConfigMap Kubernetes.

| Variable | Description | Valeur par défaut | Type |
|----------|-------------|-------------------|------|
| `production` | Mode production | `false` | boolean |
| `apiUrl` | URL de l'API backend | `http://api-backend:8000/api` | string |
| `baseUrl` | URL de base de l'API | `http://api-backend:8000` | string |
| `basePath` | Chemin de base | `` | string |
| `appName` | Nom de l'application | `PwC MKT Bounce` | string |
| `version` | Version de l'application | `1.0.0` | string |
| `enableMockServices` | Activer les services mockés | `false` | boolean |
| `logLevel` | Niveau de log | `info` | string |

### Variables d'Endpoints API

| Variable | Description | Exemple |
|----------|-------------|---------|
| `apiEndpoints.rfp` | Endpoint RFP | `/api/rfp` |
| `apiEndpoints.proposal` | Endpoint Proposal | `/api/proposal` |
| `apiEndpoints.ai` | Endpoint AI | `/api/analyze-autoreply/v1/analyze` |
| `apiEndpoints.health` | Endpoint Health | `/api/health` |

### Variables de Configuration Fichiers

| Variable | Description | Valeur par défaut |
|----------|-------------|-------------------|
| `fileUpload.maxSize` | Taille max fichier (bytes) | `10485760` (10MB) |
| `fileUpload.allowedTypes` | Types de fichiers autorisés | `["pdf","txt","docx"]` |

### Variables de Déploiement

| Variable | Description | Exemple |
|----------|-------------|---------|
| `FQDN` | Nom de domaine complet | `app.example.com` |

## 🔧 Configuration Kubernetes

### Exemple de ConfigMap

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: frontend-config
  namespace: projecthub-dev
  labels:
    app: app-frontend
data:
  env.js: |
    // Fichier injecté au runtime par ConfigMap
    // Chemin recommandé dans l'image: /usr/share/nginx/html/assets/env.js
    window.__env = {
      production: true,
      apiUrl: 'http://api-backend:8000/api',
      baseUrl: 'http://api-backend:8000',
      basePath: '',
      appName: 'PwC MKT Bounce',
      version: '1.0.0',
      enableMockServices: false,
      logLevel: 'info',
      apiEndpoints: {
        rfp: '/api/rfp',
        proposal: '/api/proposal',
        ai: '/api/analyze-autoreply/v1/analyze',
        health: '/api/health',
      },
      fileUpload: {
        maxSize: 10485760,
        allowedTypes: [
          'application/pdf',
          'text/plain',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        ],
      },
    };
```

### Montage du ConfigMap dans le Deployment

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: app-frontend
spec:
  template:
    spec:
      containers:
      - name: frontend
        env:
        - name: FRONTEND_PORT
          value: "4200"
        - name: BASE_HREF
          value: "/front"
        - name: FQDN
          value: "app.example.com"
        volumeMounts:
        - name: env-config
          mountPath: /usr/share/nginx/html/assets/env.js
          subPath: env.js
      volumes:
      - name: env-config
        configMap:
          name: frontend-config
```

## 🎨 Design System PwC

### Palette de Couleurs

#### Couleurs Principales
- **Orange PwC**: `#e8460a`
- **Orange Clair**: `#f06b39`
- **Orange Pale**: `#f59872`

#### Couleurs Neutres
- **Charcoal**: `#2C2C2C` (textes)
- **Dark Gray**: `#4A4A4A`
- **Medium Gray**: `#6B6B6B`
- **Light Gray**: `#E5E5E5` (bordures)
- **Pale Gray**: `#F5F5F5` (arrière-plans)

#### Couleurs Sémantiques
- **Success**: `#28A745`
- **Warning**: `#FFC107`
- **Error**: `#DC3545`
- **Info**: `#17A2B8`

### Composants UI

- **Badge**: Affichage des classifications
- **Button**: Boutons avec variantes (primary, secondary, outline)
- **Card**: Conteneurs de contenu
- **Input**: Champs de saisie
- **Table**: Tableaux de données responsifs
- **Loading**: Indicateurs de chargement

## 🔄 Utilisation des Variables d'Environnement

### Dans les Services TypeScript

```typescript
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private config = (window as any).__env || {};

  get apiUrl(): string {
    return this.config.apiUrl || 'http://localhost:8080/api';
  }

  get isProduction(): boolean {
    return this.config.production || false;
  }

  get appName(): string {
    return this.config.appName || 'PwC MKT Bounce';
  }
}
```

### Dans les Composants

```typescript
import { Component } from '@angular/core';
import { ConfigService } from './core/services/config.service';

@Component({
  selector: 'app-root',
  template: `<h1>{{ appName }}</h1>`
})
export class AppComponent {
  appName = this.config.appName;

  constructor(private config: ConfigService) {}
}
```

## 🧪 Tests

### Tests Unitaires

```bash
cd frontend
npm test
```

### Tests e2e

```bash
cd frontend
npm run e2e
```

### Linting

```bash
cd frontend
npm run lint
```

## 🏗️ Build de Production

```bash
cd frontend
npm run build -- --configuration production --base-href /front
```

Les fichiers compilés seront dans `dist/email-bounce-frontend/browser/`

## 📡 Intégration avec le Backend

### Configuration de l'API

L'URL de l'API doit être configurée dans le ConfigMap:

```javascript
window.__env = {
  apiUrl: 'http://api-backend:8000/api',  // URL interne Kubernetes
  // ou
  apiUrl: 'https://app.example.com/api',  // URL externe
};
```

### Endpoints utilisés

- `POST /analyze-autoreply/v1/analyze` - Analyse d'email
- `GET /health` - Health check

## 🐛 Dépannage

### Erreur: Cannot find module 'window.__env'

**Solution:** Vérifiez que le fichier `env.js` est correctement monté depuis le ConfigMap.

### Erreur: CORS

**Solution:** Configurez le backend pour accepter les requêtes depuis le domaine frontend (variable `ALLOWED_ORIGINS` dans le ConfigMap backend).

### Port déjà utilisé

**Solution:** Changez la variable `FRONTEND_PORT` dans le ConfigMap.

### Base href incorrecte

**Solution:** Vérifiez que la variable `BASE_HREF` correspond au chemin configuré dans le VirtualService Istio.

## 📚 Documentation

- [Guide de déploiement Kubernetes](../AGENT_DEPLOYMENT_TASKS.md)
- [Design System PwC](./ai-instructions-generic.md)
- [Architecture du projet](../README.md)

## 🚢 Déploiement

1. Builder l'image Docker avec l'application
2. Créer le ConfigMap avec les variables d'environnement
3. Déployer avec Kubernetes
4. Configurer le VirtualService Istio pour le routage

Voir [AGENT_DEPLOYMENT_TASKS.md](../AGENT_DEPLOYMENT_TASKS.md) pour les instructions détaillées.