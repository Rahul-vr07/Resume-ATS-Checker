import React, { useState } from 'react';
import { Briefcase, Sparkles } from 'lucide-react';

interface JobDescriptionInputProps {
  onJobDescriptionChange: (jobDescription: string) => void;
  jobDescription: string;
}

export const JobDescriptionInput: React.FC<JobDescriptionInputProps> = ({
  onJobDescriptionChange,
  jobDescription
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="w-full max-w-2xl mx-auto mb-6">
      <div className="bg-white border rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Briefcase className="h-5 w-5 text-blue-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">
              Job Description (Optional)
            </h3>
            <Sparkles className="h-4 w-4 text-yellow-500 ml-2" />
          </div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            {isExpanded ? 'Hide' : 'Add Job Description'}
          </button>
        </div>
        
        {isExpanded && (
          <div className="space-y-3">
            <p className="text-sm text-gray-600">
              Paste the job description to get more targeted analysis and keyword recommendations.
            </p>
            <textarea
              value={jobDescription}
              onChange={(e) => onJobDescriptionChange(e.target.value)}
              placeholder="Paste the job description here for more accurate analysis..."
              className="w-full h-32 p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <div className="flex items-center text-xs text-gray-500">
              <Sparkles className="h-3 w-3 mr-1" />
              AI will analyze your resume against this specific job for better accuracy
            </div>
          </div>
        )}
      </div>
    </div>
  );
};