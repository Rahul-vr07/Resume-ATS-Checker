// lib/parser.js - Resume Parsing Logic
import * as pdfjsLib from 'pdfjs-dist';
import workerUrl from 'pdfjs-dist/build/pdf.worker.min?url'; // ✅ Correct import
import mammoth from 'mammoth';

// Set up PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl; // ✅ Use workerUrl, not pdfWorker


/**
 * Parse resume file and extract text content
 * @param {Buffer} fileBuffer - File buffer
 * @param {string} mimeType - File MIME type
 * @returns {Promise<Object>} Parsed resume data
 */
export class ResumeParser {
  static async parseResume(file: File): Promise<{ text: string; sections: Record<string, string>; contact: Record<string, string>; skills: string[]; experience: { years: number; level: string; }; education: string[]; keywords: string[]; }> {
    const fileBuffer = await file.arrayBuffer();
    const mimeType = file.type;
    
  let text = '';
  let sections = {};

  try {
    if (mimeType === 'application/pdf') {
      // Parse PDF using pdfjs-dist
      const pdf = await pdfjsLib.getDocument({ data: new Uint8Array(fileBuffer) }).promise;
      const textParts = [];
      
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map((item: any) => item.str).join(' ');
        textParts.push(pageText);
      }
      
      text = textParts.join('\n');
    } else if (
      mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      mimeType === 'application/msword'
    ) {
      // Parse DOCX/DOC
      const result = await mammoth.extractRawText({ arrayBuffer: fileBuffer });
      text = result.value;
    } else {
      throw new Error('Unsupported file format');
    }

    // Clean and normalize text
    text = normalizeText(text);

    // Extract sections
    sections = extractSections(text);

    // Extract structured data
    const extractedData = {
      text,
      sections,
      contact: extractContactInfo(text),
      skills: extractSkills(text),
      experience: extractExperience(text),
      education: extractEducation(text),
      keywords: extractKeywords(text),
    };

    return extractedData;
  } catch (error) {
    console.error('Resume parsing error:', error);
    throw new Error(`Failed to parse resume: ${error.message}`);
  }
}
}

/**
 * Normalize text for better parsing
 */
function normalizeText(text) {
  return text
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
    .replace(/[^\x00-\x7F]/g, '') // Remove non-ASCII characters
    .trim();
}

/**
 * Extract resume sections
 */
function extractSections(text) {
  const sections = {};
  const sectionHeaders = {
    summary: /(?:summary|objective|profile|about)/i,
    experience: /(?:experience|employment|work history|professional experience)/i,
    education: /(?:education|academic|qualification)/i,
    skills: /(?:skills|technical skills|competencies|expertise)/i,
    projects: /(?:projects|portfolio)/i,
    certifications: /(?:certifications|certificates|licenses)/i,
    achievements: /(?:achievements|accomplishments|awards)/i,
  };

  const lines = text.split(/\n+/);
  let currentSection = 'header';
  let sectionContent = [];

  for (const line of lines) {
    let foundSection = false;
    
    for (const [section, pattern] of Object.entries(sectionHeaders)) {
      if (pattern.test(line) && line.length < 50) {
        // Save previous section
        if (currentSection && sectionContent.length > 0) {
          sections[currentSection] = sectionContent.join('\n').trim();
        }
        
        currentSection = section;
        sectionContent = [];
        foundSection = true;
        break;
      }
    }
    
    if (!foundSection) {
      sectionContent.push(line);
    }
  }

  // Save last section
  if (currentSection && sectionContent.length > 0) {
    sections[currentSection] = sectionContent.join('\n').trim();
  }

  return sections;
}

/**
 * Extract contact information
 */
function extractContactInfo(text) {
  const contact = {};
  
  // Email
  const emailMatch = text.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/);
  if (emailMatch) contact.email = emailMatch[1];
  
  // Phone
  const phoneMatch = text.match(/(\+?\d{1,3}[-.\s]?\(?\d{1,4}\)?[-.\s]?\d{1,4}[-.\s]?\d{1,9})/);
  if (phoneMatch) contact.phone = phoneMatch[1];
  
  // LinkedIn
  const linkedinMatch = text.match(/linkedin\.com\/in\/([a-zA-Z0-9-]+)/i);
  if (linkedinMatch) contact.linkedin = `linkedin.com/in/${linkedinMatch[1]}`;
  
  // GitHub
  const githubMatch = text.match(/github\.com\/([a-zA-Z0-9-]+)/i);
  if (githubMatch) contact.github = `github.com/${githubMatch[1]}`;
  
  // Name (usually at the beginning)
  const nameMatch = text.substring(0, 200).match(/^([A-Z][a-z]+ [A-Z][a-z]+)/);
  if (nameMatch) contact.name = nameMatch[1];
  
  return contact;
}

/**
 * Extract skills from resume
 */
function extractSkills(text) {
  const commonSkills = [
    'JavaScript', 'Python', 'Java', 'React', 'Node.js', 'SQL', 'MongoDB',
    'AWS', 'Docker', 'Git', 'Machine Learning', 'Data Analysis', 'HTML', 'CSS',
    'TypeScript', 'Angular', 'Vue.js', 'Express', 'Django', 'Flask', 'Spring',
    'Kubernetes', 'CI/CD', 'Agile', 'Scrum', 'REST API', 'GraphQL'
  ];
  
  const foundSkills = [];
  const textLower = text.toLowerCase();
  
  for (const skill of commonSkills) {
    if (textLower.includes(skill.toLowerCase())) {
      foundSkills.push(skill);
    }
  }
  
  return foundSkills;
}

/**
 * Extract experience information
 */
function extractExperience(text) {
  const experiencePatterns = [
    /(\d+)\+?\s*years?\s+(?:of\s+)?experience/i,
    /experience:\s*(\d+)\s*years?/i,
  ];
  
  for (const pattern of experiencePatterns) {
    const match = text.match(pattern);
    if (match) {
      return {
        years: parseInt(match[1]),
        level: getExperienceLevel(parseInt(match[1]))
      };
    }
  }
  
  return { years: 0, level: 'entry' };
}

/**
 * Get experience level based on years
 */
function getExperienceLevel(years) {
  if (years === 0) return 'entry';
  if (years <= 2) return 'junior';
  if (years <= 5) return 'mid';
  if (years <= 10) return 'senior';
  return 'expert';
}

/**
 * Extract education information
 */
function extractEducation(text) {
  const degrees = [];
  const degreePatterns = [
    /(?:Bachelor|B\.?S\.?|B\.?A\.?|BSc|BA)\s+(?:of\s+)?([A-Za-z\s]+)/gi,
    /(?:Master|M\.?S\.?|M\.?A\.?|MSc|MA|MBA)\s+(?:of\s+)?([A-Za-z\s]+)/gi,
    /(?:Ph\.?D\.?|Doctor|Doctorate)\s+(?:of\s+)?([A-Za-z\s]+)/gi,
  ];
  
  for (const pattern of degreePatterns) {
    const matches = text.matchAll(pattern);
    for (const match of matches) {
      degrees.push(match[0]);
    }
  }
  
  return degrees;
}

/**
 * Extract all relevant keywords
 */
function extractKeywords(text) {
  const keywords = new Set();
  const textLower = text.toLowerCase();
  
  // Technical keywords
  const technicalKeywords = [
    'developed', 'implemented', 'designed', 'managed', 'led', 'created',
    'improved', 'optimized', 'automated', 'built', 'deployed', 'analyzed',
    'collaborated', 'coordinated', 'achieved', 'delivered'
  ];
  
  for (const keyword of technicalKeywords) {
    if (textLower.includes(keyword)) {
      keywords.add(keyword);
    }
  }
  
  return Array.from(keywords);
}