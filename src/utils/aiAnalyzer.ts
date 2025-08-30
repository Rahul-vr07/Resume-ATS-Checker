import OpenAI from 'openai';

export class AIAnalyzer {
  private static openai: OpenAI | null = null;

  private static getOpenAI(): OpenAI {
    if (!this.openai) {
      const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
      if (!apiKey) {
        throw new Error('OpenAI API key not found. Please add VITE_OPENAI_API_KEY to your environment variables.');
      }
      this.openai = new OpenAI({
        apiKey,
        dangerouslyAllowBrowser: true // Note: In production, this should be done server-side
      });
    }
    return this.openai;
  }

  static async analyzeResumeWithAI(resumeText: string, jobDescription?: string): Promise<{
    suggestions: string[];
    strengths: string[];
    weaknesses: string[];
    keywordRecommendations: string[];
    formattingAdvice: string[];
  }> {
    try {
      const openai = this.getOpenAI();
      
      const prompt = `
        As an expert ATS (Applicant Tracking System) and resume optimization specialist, analyze the following resume:

        RESUME TEXT:
        ${resumeText}

        ${jobDescription ? `JOB DESCRIPTION: ${jobDescription}` : ''}

        Please provide a detailed analysis in the following JSON format:
        {
          "suggestions": ["specific actionable suggestions for improvement"],
          "strengths": ["current strengths of the resume"],
          "weaknesses": ["areas that need improvement"],
          "keywordRecommendations": ["specific keywords to add"],
          "formattingAdvice": ["formatting and structure improvements"]
        }

        Focus on:
        1. ATS compatibility and keyword optimization
        2. Content structure and formatting
        3. Quantifiable achievements and impact statements
        4. Industry-specific terminology
        5. Skills presentation and relevance
      `;

      const response = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are an expert resume reviewer and ATS optimization specialist. Provide detailed, actionable feedback in valid JSON format only.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1500
      });

      const content = response.choices[0]?.message?.content;
      if (!content) {
        throw new Error('No response from AI');
      }

      // Parse the JSON response
      const analysis = JSON.parse(content);
      return analysis;
    } catch (error) {
      console.error('AI Analysis Error:', error);
      
      // Fallback to enhanced rule-based analysis
      return this.fallbackAnalysis(resumeText);
    }
  }

  private static fallbackAnalysis(resumeText: string) {
    const text = resumeText.toLowerCase();
    
    return {
      suggestions: [
        'Add quantifiable achievements with specific numbers and percentages',
        'Include more action verbs at the beginning of bullet points',
        'Optimize for ATS by including relevant keywords from job descriptions',
        'Ensure consistent formatting throughout the document',
        'Add a professional summary section if missing'
      ],
      strengths: [
        text.includes('experience') ? 'Contains work experience section' : 'Document structure is readable',
        text.includes('skills') ? 'Skills section is present' : 'Content is well-organized',
        'Professional vocabulary usage'
      ],
      weaknesses: [
        !text.includes('@') ? 'Missing contact information' : 'Could benefit from more keywords',
        'May need more industry-specific terminology',
        'Consider adding more quantifiable results'
      ],
      keywordRecommendations: [
        'Project management', 'Team collaboration', 'Problem solving',
        'Data analysis', 'Process improvement', 'Strategic planning'
      ],
      formattingAdvice: [
        'Use consistent bullet points throughout',
        'Ensure proper section headers',
        'Maintain consistent font and spacing',
        'Include contact information at the top'
      ]
    };
  }
}