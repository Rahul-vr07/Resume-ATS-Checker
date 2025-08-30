export interface ResumeAnalysis {
  score: number;
  totalKeywords: number;
  matchedKeywords: string[];
  missingKeywords: string[];
  suggestions: string[];
  strengths: string[];
  weaknesses: string[];
  sectionScores: {
    keywords: number;
    formatting: number;
    skills: number;
    experience: number;
  };
  confidenceScore?: number;
  analysisType?: string;
}

export interface UploadedFile {
  file: File;
  content: string;
  type: 'pdf' | 'docx';
}

export interface ATSKeywords {
  technical: string[];
  soft: string[];
  industry: string[];
  certifications: string[];
}