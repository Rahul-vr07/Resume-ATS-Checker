import React, { useState } from 'react';
import { FileUpload } from './components/FileUpload';
import { ScoreDashboard } from './components/ScoreDashboard';
import { PDFReportGenerator } from './components/PDFReportGenerator';
import { JobDescriptionInput } from './components/JobDescriptionInput';
import { AccuracyIndicator } from './components/AccuracyIndicator';
import { ResumeParser } from './utils/resumeParser';
import { EnhancedATSAnalyzer } from './utils/enhancedATSAnalyzer';
import { ResumeAnalysis } from './types';
import { FileText, Zap, Award, TrendingUp } from 'lucide-react';

function App() {
  const [analysis, setAnalysis] = useState<(ResumeAnalysis & { confidenceScore: number; analysisType: string }) | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [fileName, setFileName] = useState<string>('');
  const [jobDescription, setJobDescription] = useState<string>('');

  const handleFileUpload = async (file: File) => {
    setIsLoading(true);
    setFileName(file.name);
    
    try {
      // Parse the resume
      const { text: resumeText } = await ResumeParser.parseResume(file);
      
      // Analyze the resume
      const analysisResult = await EnhancedATSAnalyzer.analyzeResume(resumeText, jobDescription || undefined);
      
      setAnalysis(analysisResult);
    } catch (error) {
      console.error('Error processing resume:', error);
      alert('Error processing resume. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const resetAnalysis = () => {
    setAnalysis(null);
    setFileName('');
    setJobDescription('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Resume Auditor</h1>
                <p className="text-sm text-gray-600">ATS Checker & Optimization Tool</p>
              </div>
            </div>
            <div className="flex items-center space-x-6 text-sm text-gray-600">
              <div className="flex items-center">
                <Zap className="h-4 w-4 mr-1 text-yellow-500" />
                AI-Powered
              </div>
              <div className="flex items-center">
                <Award className="h-4 w-4 mr-1 text-green-500" />
                ATS Optimized
              </div>
              <div className="flex items-center">
                <TrendingUp className="h-4 w-4 mr-1 text-blue-500" />
                Score & Insights
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!analysis ? (
          <div className="max-w-4xl mx-auto">
            {/* Hero Section */}
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Optimize Your Resume for ATS Success
              </h2>
              <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                Upload your resume and get instant feedback on ATS compatibility, 
                keyword optimization, and AI-powered suggestions to improve your chances 
                of landing interviews.
              </p>
              
              {/* Features Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className="bg-white p-6 rounded-xl shadow-sm border">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <FileText className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Smart Parsing
                  </h3>
                  <p className="text-gray-600">
                    Automatically extracts and analyzes content from PDF and DOCX files
                  </p>
                </div>
                
                <div className="bg-white p-6 rounded-xl shadow-sm border">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Award className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    ATS Scoring
                  </h3>
                  <p className="text-gray-600">
                    Get a comprehensive score based on keyword matching and formatting
                  </p>
                </div>
                
                <div className="bg-white p-6 rounded-xl shadow-sm border">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <TrendingUp className="h-6 w-6 text-purple-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    AI Suggestions
                  </h3>
                  <p className="text-gray-600">
                    Receive personalized recommendations to improve your resume
                  </p>
                </div>
              </div>
            </div>

            {/* Job Description Input */}
            <JobDescriptionInput 
              onJobDescriptionChange={setJobDescription}
              jobDescription={jobDescription}
            />

            {/* File Upload */}
            <FileUpload onFileUpload={handleFileUpload} isLoading={isLoading} />
          </div>
        ) : (
          <div className="space-y-8">
            {/* Accuracy Indicator */}
            <AccuracyIndicator 
              analysisType={analysis.analysisType as 'basic' | 'ai-enhanced' | 'job-specific'}
              confidenceScore={analysis.confidenceScore}
              hasJobDescription={!!jobDescription}
            />

            {/* Analysis Header */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Analysis Results</h2>
                <p className="text-gray-600 mt-1">
                  Analysis for: <span className="font-medium">{fileName}</span>
                </p>
              </div>
              <div className="flex space-x-4">
                <PDFReportGenerator analysis={analysis} fileName={fileName} />
                <button
                  onClick={resetAnalysis}
                  className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Analyze Another Resume
                </button>
              </div>
            </div>

            {/* Dashboard */}
            <ScoreDashboard analysis={analysis as ResumeAnalysis} />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            <p>Built with React, TypeScript, and AI-powered analysis</p>
            <p className="mt-2 text-sm">
              Help job seekers optimize their resumes for better ATS compatibility
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;