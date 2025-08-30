import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Award, Briefcase, GraduationCap } from 'lucide-react';

interface Achievement {
  id: number;
  year: string;
  title: string;
  organization: string;
  description: string;
  icon: 'award' | 'briefcase' | 'education';
}

const Achievements: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);

  // Achievements data
  const achievements: Achievement[] = [
    {
      id: 1,
      year: '2023',
      title: 'Lead Frontend Developer',
      organization: 'Tech Innovations Inc.',
      description: 'Led a team of 5 developers to deliver a complex SaaS platform that increased client productivity by 35%',
      icon: 'briefcase'
    },
    {
      id: 2,
      year: '2022',
      title: 'Best Web Application Award',
      organization: 'WebTech Summit 2022',
      description: 'Received recognition for developing an innovative accessibility-focused web application',
      icon: 'award'
    },
    {
      id: 3,
      year: '2021',
      title: 'Senior Developer',
      organization: 'Digital Solutions Co.',
      description: 'Promoted to senior role after successfully delivering 12 client projects with perfect satisfaction ratings',
      icon: 'briefcase'
    },
    {
      id: 4,
      year: '2020',
      title: 'Advanced Frontend Architecture',
      organization: 'React Conference',
      description: 'Presented a talk on optimizing React applications that was attended by over 500 developers',
      icon: 'education'
    },
    {
      id: 5,
      year: '2019',
      title: 'Junior Developer',
      organization: 'StartUp Ventures',
      description: 'Started career journey as a junior developer working on e-commerce platforms and progressive web apps',
      icon: 'briefcase'
    },
    {
      id: 6,
      year: '2018',
      title: 'Computer Science Degree',
      organization: 'Tech University',
      description: 'Graduated with honors, specializing in web technologies and user interface design',
      icon: 'education'
    }
  ];

  // Icon mapping
  const getIcon = (iconType: string) => {
    switch (iconType) {
      case 'award':
        return <Award className="h-6 w-6 text-white" />;
      case 'briefcase':
        return <Briefcase className="h-6 w-6 text-white" />;
      case 'education':
        return <GraduationCap className="h-6 w-6 text-white" />;
      default:
        return <Award className="h-6 w-6 text-white" />;
    }
  };

  useEffect(() => {
    // GSAP animations
    gsap.fromTo(
      headingRef.current,
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%'
        }
      }
    );

    // Animate timeline line drawing
    gsap.fromTo(
      '.timeline-line',
      { height: 0 },
      {
        height: '100%',
        duration: 1.5,
        ease: 'power3.inOut',
        scrollTrigger: {
          trigger: timelineRef.current,
          start: 'top 70%',
          end: 'bottom 30%',
          scrub: 1
        }
      }
    );

    // Animate achievement items
    gsap.fromTo(
      '.achievement-item',
      { x: (i) => i % 2 === 0 ? -50 : 50, opacity: 0 },
      {
        x: 0,
        opacity: 1,
        stagger: 0.2,
        duration: 0.8,
        scrollTrigger: {
          trigger: timelineRef.current,
          start: 'top 70%',
          end: 'bottom 30%',
          scrub: 1
        }
      }
    );
  }, []);

  return (
    <section id="achievements" ref={sectionRef} className="section">
      <div className="container">
        <h2 ref={headingRef} className="text-center mb-16">
          My <span className="text-primary">Achievements</span>
        </h2>
        
        <div ref={timelineRef} className="relative">
          {/* Timeline center line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gray-200 dark:bg-gray-700">
            <div className="timeline-line absolute top-0 left-0 w-full bg-primary" style={{ height: '0%' }}></div>
          </div>
          
          {/* Timeline items */}
          <div className="relative z-10">
            {achievements.map((achievement, index) => (
              <div
                key={achievement.id}
                className={`achievement-item mb-12 flex ${
                  index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'
                }`}
              >
                <div className={`w-1/2 ${index % 2 === 0 ? 'pr-12 text-right' : 'pl-12'}`}>
                  <div className="card hover:shadow-lg transition-shadow">
                    <div className="mb-2 text-primary font-bold">{achievement.year}</div>
                    <h3 className="text-xl font-semibold mb-1">{achievement.title}</h3>
                    <div className="text-gray-600 dark:text-gray-400 mb-3">{achievement.organization}</div>
                    <p className="text-gray-600 dark:text-gray-400">{achievement.description}</p>
                  </div>
                </div>
                
                <div className="absolute left-1/2 transform -translate-x-1/2 w-12 h-12 rounded-full bg-primary flex items-center justify-center">
                  {getIcon(achievement.icon)}
                </div>
                
                <div className="w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Achievements;