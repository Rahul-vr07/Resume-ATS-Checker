import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ArrowDownIcon, Github, Linkedin, Twitter } from 'lucide-react';

const Hero: React.FC = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const socialRef = useRef<HTMLDivElement>(null);
  const shapeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Hero animation timeline
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    tl.from(titleRef.current, {
      y: 80,
      opacity: 0.5,
      duration: 1,
      delay: 0.2
    })
    .from(subtitleRef.current, {
      y: 50,
      opacity: 0.5,
      duration: 0.8
    }, '-=0.4')
    .from(ctaRef.current, {
      y: 30,
      opacity: 0.5,
      duration: 0.8
    }, '-=0.4')
    .from(socialRef.current?.children, {
      opacity: 0.5,
      x: -20,
      stagger: 0.1,
      duration: 0.6
    }, '-=0.6')
    .from(shapeRef.current, {
      scale: 0.8,
      opacity: 0.5,
      duration: 1,
      ease: 'elastic.out(1, 0.5)'
    }, '-=0.8');

    // Parallax effect on scroll
    gsap.to(shapeRef.current, {
      y: 100,
      scrollTrigger: {
        trigger: heroRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: true
      }
    });

    // Floating animation for the shape
    gsap.to(shapeRef.current, {
      y: 20,
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    });
  }, []);

  const scrollToAbout = () => {
    const aboutSection = document.getElementById('about');
    if (aboutSection) {
      window.scrollTo({
        top: aboutSection.offsetTop - 80,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section
      id="home"
      ref={heroRef}
      className="section min-h-screen flex flex-col justify-center relative overflow-hidden bg-background"
    >
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="max-w-3xl">
          <h1 ref={titleRef} className="mb-6 font-bold text-text">
            <span className="text-primary">Hello, I'm</span> <br />
            Rahul
          </h1>
          <p ref={subtitleRef} className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 mb-8 opacity-90">
            A passionate web app developer specializing in crafting immersive digital experiences with
            modern technologies and elegant designs.
          </p>
          
          <div ref={ctaRef} className="flex flex-wrap gap-4 mb-12">
            <button className="btn btn-primary">View Projects</button>
            <button className="btn btn-outline">Download Resume</button>
          </div>
          
          <div ref={socialRef} className="flex space-x-6">
            <a href="#" className="text-gray-700 hover:text-primary dark:text-gray-300 dark:hover:text-primary transition-colors">
              <Github size={24} />
            </a>
            <a href="#" className="text-gray-700 hover:text-primary dark:text-gray-300 dark:hover:text-primary transition-colors">
              <Linkedin size={24} />
            </a>
            <a href="#" className="text-gray-700 hover:text-primary dark:text-gray-300 dark:hover:text-primary transition-colors">
              <Twitter size={24} />
            </a>
          </div>
        </div>
      </div>
      
      {/* Background elements */}
      <div ref={shapeRef} className="absolute top-1/4 right-[-5%] md:right-[10%] w-72 h-72 md:w-96 md:h-96 bg-primary/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-28 left-1/2 transform -translate-x-1/2 animate-bounce">
        <button onClick={scrollToAbout} className="p-2 rounded-full bg-primary/20 text-primary hover:bg-primary/30 transition-colors">
          <ArrowDownIcon size={24} />
        </button>
      </div>
    </section>
  );
};

export default Hero;