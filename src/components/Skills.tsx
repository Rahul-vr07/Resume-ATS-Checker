import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { useInView } from 'react-intersection-observer';

interface Skill {
  name: string;
  level: number;
  category: string;
  color: string;
}

const Skills: React.FC = () => {
  const { ref: sectionRef, inView } = useInView({
    threshold: 0.2,
    triggerOnce: true
  });

  const headingRef = useRef<HTMLHeadingElement>(null);

  // Skills data
  const skills: Skill[] = [
    { name: 'JavaScript', level: 95, category: 'frontend', color: '#F7DF1E' },
    { name: 'TypeScript', level: 90, category: 'frontend', color: '#3178C6' },
    { name: 'React', level: 92, category: 'frontend', color: '#61DAFB' },
    { name: 'Vue.js', level: 85, category: 'frontend', color: '#4FC08D' },
    { name: 'HTML/CSS', level: 95, category: 'frontend', color: '#E34F26' },
    { name: 'GSAP', level: 88, category: 'frontend', color: '#88CE02' },
    { name: 'Node.js', level: 85, category: 'backend', color: '#339933' },
    { name: 'Express', level: 87, category: 'backend', color: '#000000' },
    { name: 'MongoDB', level: 80, category: 'backend', color: '#47A248' },
    { name: 'SQL', level: 78, category: 'backend', color: '#4479A1' },
    { name: 'GraphQL', level: 75, category: 'backend', color: '#E10098' },
    { name: 'Docker', level: 70, category: 'devops', color: '#2496ED' },
    { name: 'AWS', level: 65, category: 'devops', color: '#FF9900' },
    { name: 'Git', level: 90, category: 'devops', color: '#F05032' },
  ];

  // Filter skills by category
  const frontendSkills = skills.filter(skill => skill.category === 'frontend');
  const backendSkills = skills.filter(skill => skill.category === 'backend');
  const devopsSkills = skills.filter(skill => skill.category === 'devops');

  useEffect(() => {
    // Heading animation
    gsap.fromTo(
      headingRef.current,
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        scrollTrigger: {
          trigger: headingRef.current,
          start: 'top 80%'
        }
      }
    );

    // Animate progress bars when in view
    if (inView) {
      gsap.to('.skill-progress-fill', {
        width: (index) => `${skills[index].level}%`,
        duration: 1.5,
        stagger: 0.1,
        ease: 'power3.out'
      });
    }
  }, [inView, skills]);

  return (
    <section id="skills" ref={sectionRef} className="section">
      <div className="container">
        <h2 ref={headingRef} className="text-center mb-16">
          My <span className="text-primary">Skills</span>
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="card">
            <h3 className="text-2xl font-semibold mb-6 text-primary">Frontend Development</h3>
            <div className="space-y-6">
              {frontendSkills.map((skill, index) => (
                <div key={skill.name} className="skill-item">
                  <div className="flex justify-between mb-2">
                    <span className="font-medium">{skill.name}</span>
                    <span>{skill.level}%</span>
                  </div>
                  <div className="progress-bar">
                    <div 
                      className="skill-progress-fill"
                      style={{ 
                        width: '0%', 
                        backgroundColor: skill.color,
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="space-y-12">
            <div className="card">
              <h3 className="text-2xl font-semibold mb-6 text-secondary">Backend Development</h3>
              <div className="space-y-6">
                {backendSkills.map((skill, index) => (
                  <div key={skill.name} className="skill-item">
                    <div className="flex justify-between mb-2">
                      <span className="font-medium">{skill.name}</span>
                      <span>{skill.level}%</span>
                    </div>
                    <div className="progress-bar">
                      <div 
                        className="skill-progress-fill"
                        style={{ 
                          width: '0%', 
                          backgroundColor: skill.color,
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="card">
              <h3 className="text-2xl font-semibold mb-6 text-accent">DevOps & Tools</h3>
              <div className="space-y-6">
                {devopsSkills.map((skill, index) => (
                  <div key={skill.name} className="skill-item">
                    <div className="flex justify-between mb-2">
                      <span className="font-medium">{skill.name}</span>
                      <span>{skill.level}%</span>
                    </div>
                    <div className="progress-bar">
                      <div 
                        className="skill-progress-fill"
                        style={{ 
                          width: '0%', 
                          backgroundColor: skill.color,
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Skills;