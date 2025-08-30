import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Code, Monitor, Palette } from 'lucide-react';

const About: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // GSAP animation setup
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
      contentRef.current,
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        delay: 0.2,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%'
        }
      }
    );

    gsap.fromTo(
      '.service-card',
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        stagger: 0.2,
        duration: 0.8,
        delay: 0.4,
        scrollTrigger: {
          trigger: cardsRef.current,
          start: 'top 80%'
        }
      }
    );
  }, []);

  return (
    <section id="about" ref={sectionRef} className="section bg-gray-50 dark:bg-gray-900">
      <div className="container">
        <h2 ref={headingRef} className="text-center mb-16">
          About <span className="text-primary">Me</span>
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div ref={contentRef} className="space-y-6">
            <p className="text-lg">
              I'm a passionate web application developer with over 6 years of professional experience. 
              I specialize in building modern, responsive, and performant web applications using 
              cutting-edge technologies.
            </p>
            <p className="text-lg">
              My journey began with a deep curiosity for creating things on the web. Over the years, 
              I've honed my skills across the full stack, from crafting beautiful UIs to building 
              robust APIs and backend systems.
            </p>
            <p className="text-lg">
              I believe in writing clean, maintainable code and creating intuitive user experiences 
              that solve real problems. When I'm not coding, you'll find me exploring new 
              technologies, contributing to open source, or sharing knowledge with the developer community.
            </p>
          </div>
          
          <div ref={cardsRef} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="service-card card hover:shadow-lg hover:-translate-y-2">
              <div className="mb-4">
                <Code size={40} className="text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Web Development</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Creating responsive and performance-optimized web applications with modern frameworks.
              </p>
            </div>
            
            <div className="service-card card hover:shadow-lg hover:-translate-y-2">
              <div className="mb-4">
                <Monitor size={40} className="text-secondary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Full-Stack Solutions</h3>
              <p className="text-gray-600 dark:text-gray-400">
                End-to-end development from front-end interfaces to robust backend systems.
              </p>
            </div>
            
            <div className="service-card card hover:shadow-lg hover:-translate-y-2 col-span-1 sm:col-span-2">
              <div className="mb-4">
                <Palette size={40} className="text-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-2">UI/UX Design</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Creating intuitive, user-centered designs with attention to detail and aesthetics.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;