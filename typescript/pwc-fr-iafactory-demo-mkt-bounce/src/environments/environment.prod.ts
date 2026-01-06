export const environment = {
  production: true,
  apiUrl: 'https://{{{ env "FQDN" }}}/api',
  baseUrl: 'https://{{{ env "FQDN" }}}',
  basePath: '{{{ env "BASE_HREF" }}}',
  appName: 'PwC MKT Bounce Analyzer',
  version: '1.0.0',
  enableMockServices: false,
  logLevel: 'error',
  apiEndpoints: {
    analyze: '/api/analyze-autoreply/v1/analyze',
    health: '/api/health'
  },
  fileUpload: {
    maxSize: 10 * 1024 * 1024, // 10MB
    allowedTypes: ['application/pdf', 'text/plain', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
  }
};
