import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const useGSAPAnimation = () => {
  const heroRef = useRef(null);
  const formRef = useRef(null);
  const destinationsRef = useRef(null);
  const mapRef = useRef(null);

  useEffect(() => {
    // Initial page load animations
    gsap.from(heroRef.current, {
      opacity: 0,
      y: 50,
      duration: 1,
      ease: 'power3.out'
    });

    gsap.from(formRef.current, {
      opacity: 0,
      y: 30,
      duration: 1,
      delay: 0.5,
      ease: 'power3.out'
    });

    // Scroll-triggered animations
    gsap.from(destinationsRef.current, {
      scrollTrigger: {
        trigger: destinationsRef.current,
        start: 'top 80%',
        toggleActions: 'play none none reverse'
      },
      opacity: 0,
      y: 30,
      duration: 0.8,
      stagger: 0.2
    });

    gsap.from(mapRef.current, {
      scrollTrigger: {
        trigger: mapRef.current,
        start: 'top 80%',
        toggleActions: 'play none none reverse'
      },
      opacity: 0,
      scale: 0.95,
      duration: 1,
      ease: 'power3.out'
    });
  }, []);

  return { heroRef, formRef, destinationsRef, mapRef };
};