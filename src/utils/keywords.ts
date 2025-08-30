export const ATS_KEYWORDS: Record<string, string[]> = {
  technical: [
    'JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'Java', 'C++', 
    'HTML', 'CSS', 'SQL', 'MongoDB', 'PostgreSQL', 'AWS', 'Docker', 'Git',
    'REST API', 'GraphQL', 'Redux', 'Next.js', 'Vue.js', 'Angular', 'Express',
    'Spring Boot', 'Django', 'Flask', 'Kubernetes', 'Jenkins', 'CI/CD',
    'Machine Learning', 'Data Science', 'TensorFlow', 'PyTorch', 'Pandas',
    'NumPy', 'Matplotlib', 'Scikit-learn', 'Apache Spark', 'Hadoop',
    'Microservices', 'DevOps', 'Agile', 'Scrum', 'JIRA', 'Confluence'
  ],
  soft: [
    'Leadership', 'Communication', 'Problem Solving', 'Team Work', 'Collaboration',
    'Critical Thinking', 'Project Management', 'Time Management', 'Adaptability',
    'Creative', 'Innovative', 'Analytical', 'Detail Oriented', 'Self Motivated',
    'Initiative', 'Mentoring', 'Presentation', 'Negotiation', 'Conflict Resolution'
  ],
  industry: [
    'Software Development', 'Web Development', 'Mobile Development', 'Full Stack',
    'Frontend', 'Backend', 'DevOps', 'Data Analysis', 'Product Management',
    'UI/UX Design', 'Quality Assurance', 'Testing', 'Cybersecurity', 'Cloud Computing',
    'Database Administration', 'System Administration', 'Network Engineering'
  ],
  certifications: [
    'AWS Certified', 'Google Cloud', 'Microsoft Azure', 'Certified Kubernetes',
    'PMP', 'Scrum Master', 'Product Owner', 'CISSP', 'CompTIA', 'Oracle Certified',
    'Microsoft Certified', 'Salesforce Certified', 'Adobe Certified'
  ]
};

export const getAllKeywords = (): string[] => {
  return Object.values(ATS_KEYWORDS).flat();
};