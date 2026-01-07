export const environment = {
  production: true,
  apiUrl: '${BACKEND_URL}',
  baseUrl: '${BACKEND_URL}',
  basePath: '${BASE_HREF}',
  appName: 'PwC MKT Bounce Analyzer',
  version: '1.0.0',
  enableMockServices: false,
  logLevel: 'error',
  apiEndpoints: {
    analyze: '/analyze-autoreply/v1/analyze',
    health: '/healthcheck'
  },
  fileUpload: {
    maxSize: 10 * 1024 * 1024, // 10MB
    allowedTypes: ['application/pdf', 'text/plain', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
  }
};
