// api-response.model.ts - Backend API Response Models

export interface AnalyzeEmailRequest {
  sender: string;
  body: string;
}

export interface AnalyzeEmailResultItem {
  sender: string;
  email_content: string;
  classification: string;
  explanation: string;
  action_type: string;
  email_adresse: string;
  name: string;
  mobile_phone_number: string;
  business_phone_number: string;
  job_title: string;
  email_type: string;
  organisation_name: string;
}

export interface AnalyzeEmailResponse {
  status: string;
  results: AnalyzeEmailResultItem[];
}