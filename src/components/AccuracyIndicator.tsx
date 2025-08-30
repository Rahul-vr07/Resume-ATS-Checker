import React from 'react';
import { Shield, AlertTriangle, Info } from 'lucide-react';

interface AccuracyIndicatorProps {
  analysisType: 'basic' | 'ai-enhanced' | 'job-specific';
  confidenceScore: number;
  hasJobDescription: boolean;
}

export const AccuracyIndicator: React.FC<AccuracyIndicatorProps> = ({
  analysisType,
  confidenceScore,
  hasJobDescription
}) => {
  const getAccuracyLevel = () => {
    if (analysisType === 'job-specific' && hasJobDescription) {
      return { level: 'High', color: 'green', icon: Shield };
    } else if (analysisType === 'ai-enhanced') {
      return { level: 'Medium', color: 'yellow', icon: AlertTriangle };
    } else {
      return { level: 'Basic', color: 'orange', icon: Info };
    }
  };

  const accuracy = getAccuracyLevel();
  const Icon = accuracy.icon;

  return (
    <div className={`bg-${accuracy.color}-50 border border-${accuracy.color}-200 rounded-lg p-4 mb-6`}>
      <div className="flex items-start">
        <Icon className={`h-5 w-5 text-${accuracy.color}-600 mr-3 mt-0.5 flex-shrink-0`} />
        <div className="flex-1">
          <h4 className={`text-sm font-semibold text-${accuracy.color}-800 mb-1`}>
            Analysis Accuracy: {accuracy.level} ({confidenceScore}%)
          </h4>
          <div className="text-sm text-gray-700 space-y-2">
            {analysisType === 'basic' && (
              <div>
                <p className="mb-2">This analysis uses rule-based keyword matching and basic formatting checks.</p>
                <div className="bg-white p-3 rounded border-l-4 border-blue-400">
                  <p className="font-medium text-blue-800 mb-1">To improve accuracy:</p>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Add a specific job description for targeted analysis</li>
                    <li>• Enable AI analysis for deeper insights</li>
                    <li>• Consider industry-specific keyword databases</li>
                  </ul>
                </div>
              </div>
            )}
            
            {analysisType === 'ai-enhanced' && !hasJobDescription && (
              <div>
                <p className="mb-2">AI-enhanced analysis provides better insights but lacks job-specific context.</p>
                <div className="bg-white p-3 rounded border-l-4 border-yellow-400">
                  <p className="font-medium text-yellow-800 mb-1">For maximum accuracy:</p>
                  <ul className="text-sm text-yellow-700 space-y-1">
                    <li>• Provide the specific job description you're targeting</li>
                    <li>• This will enable job-specific keyword analysis</li>
                  </ul>
                </div>
              </div>
            )}
            
            {analysisType === 'job-specific' && hasJobDescription && (
              <div>
                <p className="mb-2">High-accuracy analysis using job-specific requirements and AI insights.</p>
                <div className="bg-white p-3 rounded border-l-4 border-green-400">
                  <p className="font-medium text-green-800 mb-1">This analysis includes:</p>
                  <ul className="text-sm text-green-700 space-y-1">
                    <li>• Job-specific keyword matching</li>
                    <li>• AI-powered contextual analysis</li>
                    <li>• Industry-relevant suggestions</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};