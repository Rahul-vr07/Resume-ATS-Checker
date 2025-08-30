import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ExternalLink, Github } from 'lucide-react';

interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  tags: string[];
  demoUrl: string;
  githubUrl: string;
}

const Projects: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const filtersRef = useRef<HTMLDivElement>(null);
  const projectsRef = useRef<HTMLDivElement>(null);

  // Projects data
  const projectsData: Project[] = [
    {
      id: 1,
      title: 'E-Commerce Platform',
      description: 'A full-featured e-commerce platform with product catalog, cart, and checkout functionality',
      image: 'https://images.pexels.com/photos/6956002/pexels-photo-6956002.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      tags: ['React', 'Node.js', 'MongoDB', 'Frontend', 'Backend'],
      demoUrl: '#',
      githubUrl: '#'
    },
    {
      id: 2,
      title: 'Social Media Dashboard',
      description: 'Real-time analytics dashboard for monitoring social media engagement and performance',
      image: 'https://images.pexels.com/photos/5483077/pexels-photo-5483077.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      tags: ['React', 'Redux', 'Express', 'Frontend'],
      demoUrl: '#',
      githubUrl: '#'
    },
    {
      id: 3,
      title: 'Project Management Tool',
      description: 'A collaborative project management application with task tracking and team workflows',
      image: 'https://images.pexels.com/photos/6804581/pexels-photo-6804581.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      tags: ['Vue.js', 'Node.js', 'MongoDB', 'Frontend', 'Backend'],
      demoUrl: '#',
      githubUrl: '#'
    },
    {
      id: 4,
      title: 'Real Estate Listings App',
      description: 'Property listings and search application with map integration and filtering options',
      image: 'https://images.pexels.com/photos/7821827/pexels-photo-7821827.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      tags: ['React', 'TypeScript', 'GraphQL', 'Frontend'],
      demoUrl: '#',
      githubUrl: '#'
    },
    {
      id: 5,
      title: 'Fitness Tracking API',
      description: 'RESTful API for tracking workouts, nutrition, and health metrics with data visualization',
      image: 'https://images.pexels.com/photos/3927385/pexels-photo-3927385.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      tags: ['Node.js', 'Express', 'MongoDB', 'Backend'],
      demoUrl: '#',
      githubUrl: '#'
    },
    {
      id: 6,
      title: 'Cloud Deployment Tool',
      description: 'Infrastructure management tool for deploying applications across multiple cloud providers',
      image: 'https://images.pexels.com/photos/325229/pexels-photo-325229.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      tags: ['TypeScript', 'AWS', 'Docker', 'DevOps'],
      demoUrl: '#',
      githubUrl: '#'
    }
  ];

  // Get unique tags for filtering
  const allTags = ['all', ...new Set(projectsData.flatMap(project => project.tags))];

  // Filtered projects
  const filteredProjects = activeFilter === 'all'
    ? projectsData
    : projectsData.filter(project => project.tags.includes(activeFilter));

  // Handle filter change
  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
    
    // Animate project cards when filter changes
    gsap.fromTo(
      '.project-card',
      { y: 20, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        stagger: 0.1,
        duration: 0.5,
        ease: 'power2.out',
        delay: 0.2
      }
    );
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

    gsap.fromTo(
      filtersRef.current?.children,
      { y: 20, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        stagger: 0.1,
        duration: 0.6,
        delay: 0.3,
        scrollTrigger: {
          trigger: filtersRef.current,
          start: 'top 80%'
        }
      }
    );

    gsap.fromTo(
      '.project-card',
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        stagger: 0.1,
        duration: 0.8,
        delay: 0.5,
        scrollTrigger: {
          trigger: projectsRef.current,
          start: 'top 80%'
        }
      }
    );

    // Hover animations for project cards
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
      card.addEventListener('mouseenter', () => {
        gsap.to(card.querySelector('.project-overlay'), {
          opacity: 1,
          duration: 0.3
        });
        
        gsap.to(card.querySelector('.project-content'), {
          y: 0,
          opacity: 1,
          duration: 0.5
        });
      });
      
      card.addEventListener('mouseleave', () => {
        gsap.to(card.querySelector('.project-overlay'), {
          opacity: 0,
          duration: 0.3
        });
        
        gsap.to(card.querySelector('.project-content'), {
          y: 20,
          opacity: 0,
          duration: 0.5
        });
      });
    });
    
    return () => {
      projectCards.forEach(card => {
        card.removeEventListener('mouseenter', () => {});
        card.removeEventListener('mouseleave', () => {});
      });
    };
  }, []);

  return (
    <section id="projects" ref={sectionRef} className="section bg-gray-50 dark:bg-gray-900">
      <div className="container">
        <h2 ref={headingRef} className="text-center mb-16">
          My <span className="text-primary">Projects</span>
        </h2>
        
        {/* Project Filters */}
        <div ref={filtersRef} className="flex flex-wrap justify-center gap-3 mb-12">
          {allTags.map(tag => (
            <button
              key={tag}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeFilter === tag
                  ? 'bg-primary text-white'
                  : 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
              onClick={() => handleFilterChange(tag)}
            >
              {tag.charAt(0).toUpperCase() + tag.slice(1)}
            </button>
          ))}
        </div>
        
        {/* Projects Grid */}
        <div 
          ref={projectsRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {filteredProjects.map(project => (
            <div key={project.id} className="project-card rounded-xl overflow-hidden shadow-md relative group">
              <div className="aspect-video overflow-hidden">
                <img 
                  src={project.image} 
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>
              
              <div className="project-overlay absolute inset-0 bg-black bg-opacity-70 opacity-0 transition-opacity flex items-center justify-center">
                <div className="project-content text-white text-center p-6 transform translate-y-20 opacity-0">
                  <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                  <p className="text-gray-300 mb-4">{project.description}</p>
                  
                  <div className="flex flex-wrap justify-center gap-2 mb-6">
                    {project.tags.map(tag => (
                      <span 
                        key={tag} 
                        className="px-2 py-1 text-xs rounded-full bg-primary/20 text-primary"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex justify-center space-x-4">
                    <a 
                      href={project.demoUrl}
                      className="p-2 rounded-full bg-white text-gray-900 hover:bg-primary hover:text-white transition-colors"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink size={20} />
                    </a>
                    <a 
                      href={project.githubUrl}
                      className="p-2 rounded-full bg-white text-gray-900 hover:bg-primary hover:text-white transition-colors"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Github size={20} />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;