import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Custom hook for performant mouse position tracking.
 * Uses requestAnimationFrame to throttle updates and avoid jank.
 * Returns normalised coordinates (-1 to 1) centered on the viewport.
 */
const useMousePosition = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const rafRef = useRef(null);
  const latestRef = useRef({ x: 0, y: 0 });

  const handleMouseMove = useCallback((e) => {
    // Normalise to -1…1 range (center = 0)
    latestRef.current = {
      x: (e.clientX / window.innerWidth) * 2 - 1,
      y: (e.clientY / window.innerHeight) * 2 - 1,
    };

    if (!rafRef.current) {
      rafRef.current = requestAnimationFrame(() => {
        setPosition({ ...latestRef.current });
        rafRef.current = null;
      });
    }
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [handleMouseMove]);

  return position;
};

export default useMousePosition;
