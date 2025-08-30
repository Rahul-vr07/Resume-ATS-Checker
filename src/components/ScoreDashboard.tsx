import React from 'react';
import { ResumeAnalysis } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Award, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';

interface ScoreDashboardProps {
  analysis: ResumeAnalysis;
}

export const ScoreDashboard: React.FC<ScoreDashboardProps> = ({ analysis }) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return 'bg-green-100';
    if (score >= 60) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  const sectionData = [
    { name: 'Keywords', score: analysis.sectionScores.keywords },
    { name: 'Formatting', score: analysis.sectionScores.formatting },
    { name: 'Skills', score: analysis.sectionScores.skills },
    { name: 'Experience', score: analysis.sectionScores.experience }
  ];

  const pieData = [
    { name: 'Matched', value: analysis.matchedKeywords.length, color: '#10b981' },
    { name: 'Missing', value: analysis.missingKeywords.length, color: '#ef4444' }
  ];

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Overall Score Card */}
      <div className={`${getScoreBg(analysis.score)} border rounded-xl p-6`}>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">ATS Score</h2>
            <p className="text-gray-600">Overall resume compatibility score</p>
          </div>
          <div className="text-right">
            <div className={`text-4xl font-bold ${getScoreColor(analysis.score)} flex items-center`}>
              <Award className="mr-2" />
              {analysis.score}%
            </div>
            <div className="text-sm text-gray-600 mt-1">
              {analysis.matchedKeywords.length} of {analysis.totalKeywords} keywords found
            </div>
          </div>
        </div>
      </div>

      {/* Section Scores */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Section Scores</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={sectionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis domain={[0, 100]} />
              <Tooltip formatter={(value) => [`${value}%`, 'Score']} />
              <Bar dataKey="score" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white border rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Keyword Coverage</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value, name) => [`${value} keywords`, name]} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center space-x-4 mt-4">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded mr-2"></div>
              <span className="text-sm">Matched ({analysis.matchedKeywords.length})</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-red-500 rounded mr-2"></div>
              <span className="text-sm">Missing ({analysis.missingKeywords.length})</span>
            </div>
          </div>
        </div>
      </div>

      {/* Strengths and Weaknesses */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <CheckCircle className="text-green-500 mr-2" />
            Strengths
          </h3>
          <ul className="space-y-2">
            {analysis.strengths.map((strength, index) => (
              <li key={index} className="flex items-start">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <span className="text-gray-700">{strength}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white border rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <AlertTriangle className="text-orange-500 mr-2" />
            Areas for Improvement
          </h3>
          <ul className="space-y-2">
            {analysis.weaknesses.map((weakness, index) => (
              <li key={index} className="flex items-start">
                <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <span className="text-gray-700">{weakness}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Suggestions */}
      <div className="bg-white border rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <TrendingUp className="text-blue-500 mr-2" />
          AI-Powered Suggestions
        </h3>
        <div className="space-y-3">
          {analysis.suggestions.map((suggestion, index) => (
            <div key={index} className="flex items-start p-3 bg-blue-50 rounded-lg">
              <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 flex-shrink-0">
                {index + 1}
              </div>
              <p className="text-gray-700">{suggestion}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Missing Keywords */}
      {analysis.missingKeywords.length > 0 && (
        <div className="bg-white border rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Missing Keywords to Consider
          </h3>
          <div className="flex flex-wrap gap-2">
            {analysis.missingKeywords.slice(0, 20).map((keyword, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm"
              >
                {keyword}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};