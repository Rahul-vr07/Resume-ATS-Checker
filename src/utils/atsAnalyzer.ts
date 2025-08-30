import { ResumeAnalysis } from '../types';
import { ATS_KEYWORDS, getAllKeywords } from './keywords';

export class ATSAnalyzer {
  static analyzeResume(resumeText: string): ResumeAnalysis {
    const text = resumeText.toLowerCase();
    const allKeywords = getAllKeywords();
    
    // Find matched keywords
    const matchedKeywords = allKeywords.filter(keyword => 
      text.includes(keyword.toLowerCase())
    );
    
    // Find missing important keywords (sample)
    const missingKeywords = allKeywords
      .filter(keyword => !text.includes(keyword.toLowerCase()))
      .slice(0, 10); // Limit to top 10 missing
    
    // Calculate keyword score
    const keywordScore = Math.round((matchedKeywords.length / allKeywords.length) * 100);
    
    // Analyze formatting (basic checks)
    const formattingScore = this.analyzeFormatting(text);
    
    // Analyze skills coverage
    const skillsScore = this.analyzeSkills(text);
    
    // Analyze experience
    const experienceScore = this.analyzeExperience(text);
    
    // Calculate overall score
    const overallScore = Math.round(
      (keywordScore * 0.4 + formattingScore * 0.2 + skillsScore * 0.3 + experienceScore * 0.1)
    );
    
    return {
      score: overallScore,
      totalKeywords: allKeywords.length,
      matchedKeywords,
      missingKeywords,
      suggestions: this.generateSuggestions(overallScore, matchedKeywords, missingKeywords),
      strengths: this.identifyStrengths(matchedKeywords),
      weaknesses: this.identifyWeaknesses(missingKeywords),
      sectionScores: {
        keywords: keywordScore,
        formatting: formattingScore,
        skills: skillsScore,
        experience: experienceScore
      }
    };
  }
  
  private static analyzeFormatting(text: string): number {
    let score = 70; // Base score
    
    // Check for contact information
    if (text.includes('@')) score += 5;
    if (/\d{10}/.test(text)) score += 5; // Phone number
    
    // Check for sections
    if (text.includes('experience') || text.includes('work')) score += 5;
    if (text.includes('education')) score += 5;
    if (text.includes('skills')) score += 5;
    if (text.includes('projects')) score += 5;
    
    return Math.min(score, 100);
  }
  
  private static analyzeSkills(text: string): number {
    const technicalKeywords = ATS_KEYWORDS.technical;
    const matchedTech = technicalKeywords.filter(skill => 
      text.includes(skill.toLowerCase())
    );
    
    return Math.min(Math.round((matchedTech.length / technicalKeywords.length) * 100), 100);
  }
  
  private static analyzeExperience(text: string): number {
    let score = 60; // Base score
    
    // Look for experience indicators
    const experienceKeywords = ['years', 'months', 'developed', 'built', 'created', 'managed', 'led'];
    const foundExp = experienceKeywords.filter(keyword => text.includes(keyword));
    
    score += foundExp.length * 5;
    
    return Math.min(score, 100);
  }
  
  private static generateSuggestions(score: number, matched: string[], missing: string[]): string[] {
    const suggestions: string[] = [];
    
    if (score < 70) {
      suggestions.push('Consider adding more relevant keywords from your target job descriptions');
      suggestions.push('Include quantifiable achievements (e.g., "Increased efficiency by 20%")');
      suggestions.push('Add a professional summary section at the top');
    }
    
    if (missing.length > 0) {
      suggestions.push(`Consider adding these missing keywords: ${missing.slice(0, 5).join(', ')}`);
    }
    
    suggestions.push('Use action verbs to start bullet points (e.g., "Developed", "Implemented", "Led")');
    suggestions.push('Include relevant certifications and training');
    suggestions.push('Tailor your resume for each job application');
    
    return suggestions;
  }
  
  private static identifyStrengths(matched: string[]): string[] {
    if (matched.length === 0) return ['Keep building your skills and experience'];
    
    return [
      `Strong keyword coverage with ${matched.length} relevant terms`,
      'Good technical vocabulary usage',
      'Industry-relevant terminology present'
    ];
  }
  
  private static identifyWeaknesses(missing: string[]): string[] {
    if (missing.length === 0) return ['Excellent keyword coverage'];
    
    return [
      `Missing ${missing.length} potentially important keywords`,
      'Could benefit from more industry-specific terms',
      'Consider adding more technical skills'
    ];
  }
}