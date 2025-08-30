import { ResumeAnalysis } from '../types';
import { ATS_KEYWORDS, getAllKeywords } from './keywords';
import { AIAnalyzer } from './aiAnalyzer';

export class EnhancedATSAnalyzer {
  static async analyzeResume(
    resumeText: string, 
    jobDescription?: string
  ): Promise<ResumeAnalysis & { confidenceScore: number; analysisType: string }> {
    const text = resumeText.toLowerCase();
    const allKeywords = getAllKeywords();
    
    // Enhanced keyword matching with context
    const matchedKeywords = this.findContextualKeywords(resumeText, allKeywords, jobDescription);
    const missingKeywords = allKeywords
      .filter(keyword => !matchedKeywords.includes(keyword))
      .slice(0, 15);
    
    // Calculate more sophisticated scores
    const keywordScore = this.calculateKeywordScore(matchedKeywords, allKeywords, resumeText, jobDescription);
    const formattingScore = this.analyzeFormattingAdvanced(resumeText);
    const skillsScore = this.analyzeSkillsAdvanced(resumeText, jobDescription);
    const experienceScore = this.analyzeExperienceAdvanced(resumeText);
    
    // Calculate weighted overall score
    const overallScore = Math.round(
      (keywordScore * 0.35 + formattingScore * 0.25 + skillsScore * 0.25 + experienceScore * 0.15)
    );
    
    // Determine analysis type and confidence
    const analysisType = jobDescription ? 'job-specific' : 'basic';
    const confidenceScore = this.calculateConfidenceScore(resumeText, jobDescription, matchedKeywords);
    
    // Get AI-powered insights if available
    let aiInsights;
    try {
      // Check if OpenAI API key is available before attempting AI analysis
      const hasOpenAIKey = import.meta.env.VITE_OPENAI_API_KEY;
      if (hasOpenAIKey) {
        aiInsights = await AIAnalyzer.analyzeResumeWithAI(resumeText, jobDescription);
      } else {
        // Use enhanced fallback analysis when API key is not available
        aiInsights = this.getEnhancedFallbackAnalysis(resumeText, jobDescription);
      }
    } catch (error) {
      console.warn('AI analysis failed, using enhanced rule-based analysis');
      aiInsights = this.getEnhancedFallbackAnalysis(resumeText, jobDescription);
    }
    
    return {
      score: overallScore,
      totalKeywords: allKeywords.length,
      matchedKeywords,
      missingKeywords,
      suggestions: [
        ...aiInsights.suggestions,
        ...this.generateContextualSuggestions(overallScore, matchedKeywords, resumeText, jobDescription)
      ],
      strengths: [
        ...aiInsights.strengths,
        ...this.identifyAdvancedStrengths(matchedKeywords, resumeText)
      ],
      weaknesses: [
        ...aiInsights.weaknesses,
        ...this.identifyAdvancedWeaknesses(resumeText)
      ],
      sectionScores: {
        keywords: keywordScore,
        formatting: formattingScore,
        skills: skillsScore,
        experience: experienceScore
      },
      confidenceScore,
      analysisType
    };
  }
  
  private static calculateConfidenceScore(
    resumeText: string, 
    jobDescription?: string, 
    matchedKeywords?: string[]
  ): number {
    let confidence = 60; // Base confidence
    
    // Text quality factors
    const wordCount = resumeText.split(/\s+/).length;
    if (wordCount > 200) confidence += 10;
    if (wordCount > 500) confidence += 10;
    
    // Structure indicators
    const hasStructure = /experience|education|skills|summary/.test(resumeText.toLowerCase());
    if (hasStructure) confidence += 15;
    
    // Job description context
    if (jobDescription && jobDescription.length > 100) {
      confidence += 20;
    }
    
    // Keyword coverage
    if (matchedKeywords && matchedKeywords.length > 10) {
      confidence += 10;
    }
    
    return Math.min(confidence, 95); // Cap at 95% to acknowledge limitations
  }
  
  private static findContextualKeywords(
    resumeText: string, 
    keywords: string[], 
    jobDescription?: string
  ): string[] {
    const text = resumeText.toLowerCase();
    const matched: string[] = [];
    
    // If we have a job description, prioritize keywords found in it
    const jobKeywords = jobDescription ? this.extractJobKeywords(jobDescription) : [];
    
    keywords.forEach(keyword => {
      const keywordLower = keyword.toLowerCase();
      
      // Higher weight for job-specific keywords
      const isJobRelevant = jobKeywords.includes(keywordLower);
      
      // Check for exact matches
      if (text.includes(keywordLower)) {
        matched.push(keyword);
        return;
      }
      
      // Check for variations and related terms
      const variations = this.getKeywordVariations(keyword);
      if (variations.some(variation => text.includes(variation.toLowerCase()))) {
        matched.push(keyword);
      }
    });
    
    return matched;
  }
  
  private static extractJobKeywords(jobDescription: string): string[] {
    const text = jobDescription.toLowerCase();
    const allKeywords = getAllKeywords();
    
    return allKeywords.filter(keyword => 
      text.includes(keyword.toLowerCase())
    ).map(k => k.toLowerCase());
  }
  
  private static getKeywordVariations(keyword: string): string[] {
    const variations: Record<string, string[]> = {
      'JavaScript': ['js', 'javascript', 'ecmascript', 'es6', 'es2015'],
      'TypeScript': ['ts', 'typescript'],
      'React': ['react.js', 'reactjs', 'react native'],
      'Node.js': ['nodejs', 'node', 'express'],
      'Python': ['py', 'python3', 'django', 'flask'],
      'Machine Learning': ['ml', 'artificial intelligence', 'ai', 'deep learning'],
      'Project Management': ['pm', 'project manager', 'project lead', 'scrum master'],
      'Database': ['db', 'sql', 'nosql', 'mongodb', 'postgresql'],
      'Cloud Computing': ['aws', 'azure', 'gcp', 'cloud', 'serverless'],
      'DevOps': ['ci/cd', 'docker', 'kubernetes', 'jenkins', 'deployment']
    };
    
    return variations[keyword] || [keyword];
  }
  
  private static calculateKeywordScore(
    matched: string[], 
    total: string[], 
    resumeText: string, 
    jobDescription?: string
  ): number {
    const baseScore = (matched.length / total.length) * 100;
    
    // Bonus for keyword density and context
    const wordCount = resumeText.split(/\s+/).length;
    const keywordDensity = matched.length / wordCount;
    const densityBonus = Math.min(keywordDensity * 1000, 10);
    
    // Job-specific bonus
    let jobBonus = 0;
    if (jobDescription) {
      const jobKeywords = this.extractJobKeywords(jobDescription);
      const jobMatches = matched.filter(keyword => 
        jobKeywords.includes(keyword.toLowerCase())
      );
      jobBonus = (jobMatches.length / Math.max(jobKeywords.length, 1)) * 15;
    }
    
    return Math.min(Math.round(baseScore + densityBonus + jobBonus), 100);
  }
  
  private static analyzeFormattingAdvanced(resumeText: string): number {
    let score = 60;
    const text = resumeText.toLowerCase();
    
    // Contact information checks (more sophisticated)
    if (/@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(resumeText)) score += 8;
    if (/\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/.test(resumeText)) score += 8;
    if (/linkedin\.com|github\.com/.test(text)) score += 5;
    
    // Section structure checks
    const sections = ['experience', 'education', 'skills', 'summary', 'objective', 'projects'];
    const foundSections = sections.filter(section => 
      new RegExp(`\\b${section}\\b`, 'i').test(resumeText)
    );
    score += Math.min(foundSections.length * 4, 20);
    
    // Professional formatting indicators
    const actionVerbs = ['led', 'managed', 'developed', 'created', 'implemented', 'designed', 'built', 'optimized'];
    const foundVerbs = actionVerbs.filter(verb => text.includes(verb));
    score += Math.min(foundVerbs.length * 2, 10);
    
    // Quantifiable results
    if (/\b\d+%|\$\d+|increased|decreased|improved|reduced.*?\d+/.test(text)) score += 8;
    
    // Length optimization
    const wordCount = resumeText.split(/\s+/).length;
    if (wordCount >= 300 && wordCount <= 800) score += 5;
    else if (wordCount < 200) score -= 10;
    else if (wordCount > 1200) score -= 5;
    
    return Math.min(score, 100);
  }
  
  private static analyzeSkillsAdvanced(resumeText: string, jobDescription?: string): number {
    const text = resumeText.toLowerCase();
    const technicalKeywords = ATS_KEYWORDS.technical;
    const softKeywords = ATS_KEYWORDS.soft;
    
    let matchedTech = technicalKeywords.filter(skill => 
      text.includes(skill.toLowerCase()) || 
      this.getKeywordVariations(skill).some(variation => text.includes(variation.toLowerCase()))
    );
    
    let matchedSoft = softKeywords.filter(skill => text.includes(skill.toLowerCase()));
    
    // Job-specific skill weighting
    if (jobDescription) {
      const jobText = jobDescription.toLowerCase();
      const jobTechSkills = technicalKeywords.filter(skill => jobText.includes(skill.toLowerCase()));
      const jobSoftSkills = softKeywords.filter(skill => jobText.includes(skill.toLowerCase()));
      
      // Weight skills found in job description higher
      const jobRelevantTech = matchedTech.filter(skill => 
        jobTechSkills.some(jobSkill => jobSkill.toLowerCase() === skill.toLowerCase())
      );
      const jobRelevantSoft = matchedSoft.filter(skill => 
        jobSoftSkills.some(jobSkill => jobSkill.toLowerCase() === skill.toLowerCase())
      );
      
      // Boost score for job-relevant skills
      const techScore = (matchedTech.length / technicalKeywords.length) * 60 + 
                       (jobRelevantTech.length / Math.max(jobTechSkills.length, 1)) * 20;
      const softScore = (matchedSoft.length / softKeywords.length) * 15 + 
                       (jobRelevantSoft.length / Math.max(jobSoftSkills.length, 1)) * 5;
      
      return Math.min(Math.round(techScore + softScore), 100);
    }
    
    const techScore = (matchedTech.length / technicalKeywords.length) * 70;
    const softScore = (matchedSoft.length / softKeywords.length) * 30;
    
    return Math.min(Math.round(techScore + softScore), 100);
  }
  
  private static analyzeExperienceAdvanced(resumeText: string): number {
    let score = 50;
    const text = resumeText.toLowerCase();
    
    // Experience duration patterns
    const yearPatterns = text.match(/\b\d+\+?\s*years?\b/g);
    const monthPatterns = text.match(/\b\d+\+?\s*months?\b/g);
    
    if (yearPatterns) score += Math.min(yearPatterns.length * 8, 20);
    if (monthPatterns) score += Math.min(monthPatterns.length * 4, 10);
    
    // Achievement patterns with numbers
    const achievementPatterns = [
      /\b(increased|decreased|improved|reduced|enhanced|streamlined)\s+.*?\b\d+%\b/g,
      /\b(managed|led|supervised)\s+.*?\b\d+\b/g,
      /\$\d+[kmb]?/g // Dollar amounts
    ];
    
    achievementPatterns.forEach(pattern => {
      const matches = text.match(pattern);
      if (matches) score += Math.min(matches.length * 6, 15);
    });
    
    // Job titles and company indicators
    const jobTitles = ['engineer', 'developer', 'manager', 'analyst', 'specialist', 'coordinator', 'director'];
    const foundTitles = jobTitles.filter(title => text.includes(title));
    score += Math.min(foundTitles.length * 3, 10);
    
    return Math.min(score, 100);
  }
  
  private static generateContextualSuggestions(
    score: number, 
    matched: string[], 
    resumeText: string, 
    jobDescription?: string
  ): string[] {
    const suggestions: string[] = [];
    const text = resumeText.toLowerCase();
    
    // Score-based suggestions
    if (score < 70) {
      suggestions.push('Consider restructuring your resume to better highlight relevant experience and skills');
    }
    
    // Content-based suggestions
    if (!text.includes('summary') && !text.includes('objective')) {
      suggestions.push('Add a compelling professional summary that highlights your key qualifications and career goals');
    }
    
    if (!/\b\d+%|\$\d+|increased|decreased|improved\b/.test(text)) {
      suggestions.push('Quantify your achievements with specific numbers, percentages, and dollar amounts');
    }
    
    if (matched.length < 10) {
      suggestions.push('Research industry-specific keywords and incorporate them naturally throughout your resume');
    }
    
    // Job-specific suggestions
    if (jobDescription) {
      const jobKeywords = this.extractJobKeywords(jobDescription);
      const missingJobKeywords = jobKeywords.filter(keyword => 
        !matched.some(m => m.toLowerCase() === keyword)
      );
      
      if (missingJobKeywords.length > 0) {
        suggestions.push(`Consider adding these job-specific keywords: ${missingJobKeywords.slice(0, 5).join(', ')}`);
      }
    }
    
    // Format-specific suggestions
    const wordCount = resumeText.split(/\s+/).length;
    if (wordCount < 300) {
      suggestions.push('Expand your resume with more detailed descriptions of your accomplishments and responsibilities');
    } else if (wordCount > 1000) {
      suggestions.push('Consider condensing your resume to focus on the most relevant and impactful information');
    }
    
    return suggestions;
  }
  
  private static identifyAdvancedStrengths(matched: string[], resumeText: string): string[] {
    const strengths: string[] = [];
    const text = resumeText.toLowerCase();
    
    if (matched.length > 15) {
      strengths.push(`Strong keyword coverage with ${matched.length} relevant terms demonstrates industry knowledge`);
    }
    
    if (/\b\d+%|\$\d+|increased|decreased|improved\b/.test(text)) {
      strengths.push('Includes quantifiable achievements that demonstrate measurable impact');
    }
    
    if (/\b(led|managed|mentored|supervised|coordinated)\b/.test(text)) {
      strengths.push('Shows leadership experience and team management capabilities');
    }
    
    if (/@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(resumeText)) {
      strengths.push('Contains proper contact information for easy recruiter outreach');
    }
    
    const actionVerbs = ['developed', 'implemented', 'designed', 'created', 'optimized', 'built'];
    const foundVerbs = actionVerbs.filter(verb => text.includes(verb));
    if (foundVerbs.length >= 3) {
      strengths.push('Uses strong action verbs that demonstrate proactive contribution');
    }
    
    return strengths;
  }
  
  private static identifyAdvancedWeaknesses(resumeText: string): string[] {
    const weaknesses: string[] = [];
    const text = resumeText.toLowerCase();
    
    if (!/\b\d+%|\$\d+|increased|decreased|improved\b/.test(text)) {
      weaknesses.push('Lacks quantifiable achievements - add specific numbers and measurable results');
    }
    
    if (!/@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(resumeText)) {
      weaknesses.push('Missing professional email address in contact information');
    }
    
    const wordCount = resumeText.split(/\s+/).length;
    if (wordCount < 200) {
      weaknesses.push('Resume appears too brief - consider adding more detailed descriptions');
    } else if (wordCount > 1200) {
      weaknesses.push('Resume may be too lengthy - focus on most relevant information');
    }
    
    if (!/linkedin|github|portfolio/.test(text)) {
      weaknesses.push('Consider adding professional online profiles (LinkedIn, GitHub, portfolio)');
    }
    
    if (!/\b(bachelor|master|degree|certification|certified)\b/.test(text)) {
      weaknesses.push('Education or certification section may need more prominence');
    }
    
    return weaknesses;
  }
  
  private static getEnhancedFallbackAnalysis(resumeText: string, jobDescription?: string) {
    const text = resumeText.toLowerCase();
    
    return {
      suggestions: [
        'Use strong action verbs to start each bullet point (e.g., "Developed", "Implemented", "Led")',
        'Include specific metrics and quantifiable achievements wherever possible',
        'Tailor your resume keywords to match the job description requirements',
        'Ensure consistent formatting and professional presentation throughout',
        'Add a compelling professional summary that highlights your unique value proposition',
        jobDescription ? 'Align your experience descriptions with the specific requirements mentioned in the job posting' : 'Research target job descriptions to identify relevant keywords'
      ],
      strengths: [
        text.includes('experience') ? 'Contains dedicated work experience section' : 'Document has clear structure',
        text.includes('skills') ? 'Skills section helps with keyword matching' : 'Content is well-organized',
        'Professional vocabulary and terminology usage',
        /\b(developed|created|managed|led)\b/.test(text) ? 'Uses action-oriented language' : 'Clear communication style'
      ],
      weaknesses: [
        !/@/.test(resumeText) ? 'Missing contact information (email address)' : 'Could benefit from more industry-specific keywords',
        !/\b\d+%|\$\d+/.test(text) ? 'Lacks quantifiable achievements and measurable results' : 'May need more specific accomplishments',
        !jobDescription ? 'Analysis limited without job description context' : 'Could better align with job requirements'
      ],
      keywordRecommendations: [
        'Project management', 'Team collaboration', 'Problem solving',
        'Data analysis', 'Process improvement', 'Strategic planning',
        'Cross-functional', 'Stakeholder management', 'Quality assurance'
      ],
      formattingAdvice: [
        'Use consistent bullet points and formatting throughout',
        'Ensure proper section headers and clear hierarchy',
        'Maintain professional font choices and appropriate spacing',
        'Include complete contact information at the top'
      ]
    };
  }
}