import React, { useEffect, useState } from 'react';
import { gsap } from 'gsap';

const Cursor: React.FC = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [isPointer, setIsPointer] = useState(false);

  useEffect(() => {
    // Only run cursor effect on devices with mouse pointers
    if (window.matchMedia('(pointer: fine)').matches) {
      const onMouseMove = (e: MouseEvent) => {
        setPosition({ x: e.clientX, y: e.clientY });
        
        // Check if cursor is over a clickable element
        const target = e.target as HTMLElement;
        const isClickable = 
          target.tagName.toLowerCase() === 'a' || 
          target.tagName.toLowerCase() === 'button' ||
          target.closest('a') || 
          target.closest('button') ||
          window.getComputedStyle(target).cursor === 'pointer';
        
        setIsPointer(isClickable);
      };
      
      const onMouseDown = () => setIsActive(true);
      const onMouseUp = () => setIsActive(false);
      const onMouseEnter = () => setIsVisible(true);
      const onMouseLeave = () => setIsVisible(false);
      
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mousedown', onMouseDown);
      document.addEventListener('mouseup', onMouseUp);
      document.addEventListener('mouseenter', onMouseEnter);
      document.addEventListener('mouseleave', onMouseLeave);
      
      // Create the custom cursor elements
      const cursorOuter = document.createElement('div');
      cursorOuter.className = 'custom-cursor outer';
      cursorOuter.style.width = '30px';
      cursorOuter.style.height = '30px';
      cursorOuter.style.border = '2px solid rgba(59, 130, 246, 0.8)';
      cursorOuter.style.position = 'fixed';
      cursorOuter.style.pointerEvents = 'none';
      cursorOuter.style.zIndex = '9999';
      cursorOuter.style.borderRadius = '50%';
      cursorOuter.style.transition = 'transform 0.1s ease-out, opacity 0.2s ease';
      cursorOuter.style.transformOrigin = 'center';
      cursorOuter.style.transform = 'translate(-50%, -50%)';
      
      const cursorDot = document.createElement('div');
      cursorDot.className = 'custom-cursor dot';
      cursorDot.style.width = '8px';
      cursorDot.style.height = '8px';
      cursorDot.style.backgroundColor = 'rgba(59, 130, 246, 1)';
      cursorDot.style.position = 'fixed';
      cursorDot.style.pointerEvents = 'none';
      cursorDot.style.zIndex = '10000';
      cursorDot.style.borderRadius = '50%';
      cursorDot.style.transition = 'width 0.2s, height 0.2s, transform 0.1s';
      cursorDot.style.transformOrigin = 'center';
      cursorDot.style.transform = 'translate(-50%, -50%)';
      
      document.body.appendChild(cursorOuter);
      document.body.appendChild(cursorDot);
      
      // Hide the default cursor
      document.body.style.cursor = 'none';
      
      // GSAP animations for the cursor
      const updateCursor = () => {
        gsap.to(cursorOuter, {
          x: position.x,
          y: position.y,
          opacity: isVisible ? 1 : 0,
          scale: isActive ? 0.8 : isPointer ? 1.5 : 1,
          border: isPointer ? '2px solid rgba(59, 130, 246, 1)' : '2px solid rgba(59, 130, 246, 0.8)',
          duration: 0.15
        });
        
        gsap.to(cursorDot, {
          x: position.x,
          y: position.y,
          opacity: isVisible ? 1 : 0,
          width: isPointer ? '12px' : '8px',
          height: isPointer ? '12px' : '8px',
          backgroundColor: isPointer ? 'rgba(59, 130, 246, 1)' : 'rgba(59, 130, 246, 0.8)',
          duration: 0.1
        });
        
        requestAnimationFrame(updateCursor);
      };
      
      updateCursor();
      
      return () => {
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mousedown', onMouseDown);
        document.removeEventListener('mouseup', onMouseUp);
        document.removeEventListener('mouseenter', onMouseEnter);
        document.removeEventListener('mouseleave', onMouseLeave);
        
        document.body.removeChild(cursorOuter);
        document.body.removeChild(cursorDot);
        document.body.style.cursor = 'auto';
      };
    }
  }, [position, isVisible, isActive, isPointer]);

  return null;
};

export default Cursor;