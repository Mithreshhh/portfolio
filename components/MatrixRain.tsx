'use client';

import { useEffect, useRef, useState } from 'react';

interface MatrixRainProps {
  isActive: boolean;
  onClose: () => void;
}

export default function MatrixRain({ isActive, onClose }: MatrixRainProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    if (!isActive || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Matrix characters
    const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
    const charArray = chars.split('');

    // Create columns
    const fontSize = 14;
    const columns = canvas.width / fontSize;
    const drops: number[] = [];

    // Initialize drops
    for (let i = 0; i < columns; i++) {
      drops[i] = Math.random() * -100;
    }

    let animationId: number;

    const draw = () => {
      // Semi-transparent black for trail effect
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Green text
      ctx.fillStyle = '#00ff41';
      ctx.font = `${fontSize}px monospace`;

      // Draw characters
      for (let i = 0; i < drops.length; i++) {
        const text = charArray[Math.floor(Math.random() * charArray.length)];
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        // Gradient effect (brighter at top)
        const opacity = Math.min(1, (canvas.height - y) / 200);
        ctx.fillStyle = `rgba(0, 255, 65, ${opacity})`;
        ctx.fillText(text, x, y);

        // Reset drop if it reaches bottom
        if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }

        drops[i]++;
      }
    };

    const animate = () => {
      if (fadeOut) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        return;
      }
      draw();
      animationId = requestAnimationFrame(animate);
    };

    animate();

    // Auto-close after 10 seconds
    const timeout = setTimeout(() => {
      setFadeOut(true);
      setTimeout(() => {
        onClose();
      }, 1000);
    }, 10000);

    return () => {
      if (animationId) cancelAnimationFrame(animationId);
      clearTimeout(timeout);
    };
  }, [isActive, fadeOut, onClose]);

  if (!isActive) return null;

  return (
    <div 
      className="fixed inset-0 z-[100] pointer-events-none transition-opacity duration-1000"
      style={{ opacity: fadeOut ? 0 : 1 }}
    >
      <canvas ref={canvasRef} className="w-full h-full" />
      <div className="absolute inset-0 flex items-center justify-center pointer-events-auto">
        <button
          onClick={() => {
            setFadeOut(true);
            setTimeout(() => onClose(), 1000);
          }}
          className="px-6 py-3 bg-black/80 border-2 border-green-400 text-green-400 font-mono rounded-lg hover:bg-green-400 hover:text-black transition-all duration-300"
        >
          EXIT MATRIX
        </button>
      </div>
    </div>
  );
}

