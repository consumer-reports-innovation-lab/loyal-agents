import React, { useState, useEffect, useRef, useCallback } from "react";

interface DotProps {
  x: number;
  y: number;
  mouseX: number;
  mouseY: number;
}

const Dot: React.FC<DotProps> = ({ x, y, mouseX, mouseY }) => {
  // Calculate distance from dot to mouse
  const distance = Math.sqrt(Math.pow(x - mouseX, 2) + Math.pow(y - mouseY, 2));

  // Maximum influence distance
  const maxDistance = 120;

  // Calculate scale and opacity based on distance
  const influence = Math.max(0, (maxDistance - distance) / maxDistance);
  const scale = 1 + influence * 1.5;
  const opacity = 0.3 + influence * 0.7;

  return (
    <div
      className="absolute rounded-full bg-white transition-all duration-300 ease-out"
      style={{
        left: x,
        top: y,
        width: "3px",
        height: "3px",
        transform: `translate(-50%, -50%) scale(${scale})`,
        opacity: opacity,
      }}
    />
  );
};

export const DotBackground: React.FC = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [dots, setDots] = useState<Array<{ x: number; y: number; id: string }>>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  // Generate dot grid
  useEffect(() => {
    const generateDots = () => {
      const spacing = 35;
      const newDots: Array<{ x: number; y: number; id: string }> = [];

      if (!containerRef.current) return;

      const containerWidth = window.innerWidth;
      const containerHeight = window.innerHeight;

      for (let x = spacing; x < containerWidth; x += spacing) {
        for (let y = spacing; y < containerHeight; y += spacing) {
          newDots.push({
            x,
            y,
            id: `${x}-${y}`,
          });
        }
      }

      setDots(newDots);
    };

    generateDots();

    // Regenerate dots on window resize
    const handleResize = () => {
      generateDots();
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Track mouse movement
  const handleMouseMove = useCallback((e: MouseEvent) => {
    setMousePosition({
      x: e.clientX,
      y: e.clientY,
    });
  }, []);

  useEffect(() => {
    // Track mouse movement on the entire document
    document.addEventListener("mousemove", handleMouseMove);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, [handleMouseMove]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none opacity-80"
      style={{ zIndex: 0 }}
    >
      {dots.map((dot) => (
        <Dot
          key={dot.id}
          x={dot.x}
          y={dot.y}
          mouseX={mousePosition.x}
          mouseY={mousePosition.y}
        />
      ))}
    </div>
  );
};

export default DotBackground;
