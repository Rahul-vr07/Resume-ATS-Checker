import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

// Smooth scroll to section
export const smoothScrollTo = (id: string) => {
  const element = document.getElementById(id);
  if (element) {
    gsap.to(window, {
      duration: 1,
      scrollTo: {
        y: element.offsetTop - 80,
        autoKill: false
      },
      ease: 'power3.inOut'
    });
  }
};

// Text reveal animation
export const textReveal = (element: HTMLElement, delay = 0) => {
  gsap.fromTo(
    element,
    {
      y: 50,
      opacity: 0
    },
    {
      y: 0,
      opacity: 1,
      duration: 0.8,
      delay,
      ease: 'power3.out'
    }
  );
};

// Stagger animation for multiple elements
export const staggerElements = (elements: NodeListOf<Element> | HTMLElement[], delay = 0) => {
  gsap.fromTo(
    elements,
    {
      y: 30,
      opacity: 0
    },
    {
      y: 0,
      opacity: 1,
      stagger: 0.1,
      duration: 0.6,
      delay,
      ease: 'power2.out'
    }
  );
};

// Setup scroll-triggered animations
export const setupScrollAnimations = () => {
  // Fade in elements on scroll
  gsap.utils.toArray<HTMLElement>('.fade-in').forEach(element => {
    ScrollTrigger.create({
      trigger: element,
      start: 'top 80%',
      onEnter: () => {
        gsap.to(element, {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power3.out'
        });
      },
      once: true
    });
  });

  // Reveal animations
  gsap.utils.toArray<HTMLElement>('.reveal').forEach(element => {
    ScrollTrigger.create({
      trigger: element,
      start: 'top 80%',
      onEnter: () => {
        element.classList.add('active');
      },
      once: true
    });
  });
};

// Parallax effect
export const setupParallax = (element: HTMLElement, speed = 0.5) => {
  gsap.to(element, {
    y: () => 100 * speed,
    scrollTrigger: {
      trigger: element,
      start: 'top bottom',
      end: 'bottom top',
      scrub: true
    }
  });
};

// Counter animation
export const animateCounter = (element: HTMLElement, endValue: number, duration = 2, delay = 0) => {
  gsap.fromTo(
    element,
    { innerText: '0' },
    {
      innerText: endValue,
      duration,
      delay,
      ease: 'power1.inOut',
      snap: { innerText: 1 },
      onUpdate: () => {
        element.innerText = Math.ceil(parseFloat(element.innerText)).toString();
      }
    }
  );
};