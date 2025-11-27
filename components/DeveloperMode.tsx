'use client';

import { useState, useEffect } from 'react';
import { Code2, Zap, Activity, Eye, EyeOff } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function DeveloperMode() {
  const [isActive, setIsActive] = useState(false);
  const [fps, setFps] = useState(60);
  const [renderTime, setRenderTime] = useState(0);
  const [floatingComments, setFloatingComments] = useState<Array<{id: number, text: string, x: number, y: number}>>([]);

  const comments = [
    "// TODO: Make this even cooler",
    "// Bug: Too awesome",
    "/* React magic happens here */",
    "// console.log('Hello, curious visitor!')",
    "// Easter egg: You found me!",
    "/* Performance: ⚡ Blazing fast */",
    "// GSAP animations FTW",
    "/* Tailwind CSS = 💙 */",
    "// TypeScript > JavaScript",
    "// Next.js is amazing",
  ];

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'D') {
        e.preventDefault();
        setIsActive(!isActive);
        
        if (!isActive) {
          // Generate floating comments
          const newComments = Array.from({ length: 15 }, (_, i) => ({
            id: i,
            text: comments[Math.floor(Math.random() * comments.length)],
            x: Math.random() * 90 + 5,
            y: Math.random() * 90 + 5,
          }));
          setFloatingComments(newComments);
        } else {
          setFloatingComments([]);
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isActive]);

  // Simulate FPS and render time
  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      setFps(Math.floor(Math.random() * 5) + 58);
      setRenderTime(Math.random() * 2 + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive]);

  if (!isActive) return null;

  return (
    <>
      {/* Matrix-style code rain overlay */}
      <div className="fixed inset-0 pointer-events-none z-[100]">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent animate-pulse" />
      </div>

      {/* Floating Code Comments */}
      {floatingComments.map((comment) => (
        <div
          key={comment.id}
          className="fixed pointer-events-none z-[100] text-xs font-mono text-green-400/60 whitespace-nowrap animate-pulse"
          style={{
            left: `${comment.x}%`,
            top: `${comment.y}%`,
            animation: `float ${5 + Math.random() * 5}s ease-in-out infinite`,
          }}
        >
          {comment.text}
        </div>
      ))}

      {/* Developer Console */}
      <div className="fixed bottom-0 left-0 right-0 z-[99] bg-black/95 backdrop-blur-md border-t-2 border-green-400/50 p-4 font-mono text-xs">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Code2 className="size-4 text-green-400" />
                <span className="text-green-400 font-bold">DEVELOPER MODE ACTIVE</span>
              </div>
              <div className="flex items-center gap-2">
                <Activity className="size-3 text-primary" />
                <span className="text-primary">FPS: {fps}</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="size-3 text-secondary" />
                <span className="text-secondary">Render: {renderTime.toFixed(2)}ms</span>
              </div>
            </div>
            <button
              onClick={() => setIsActive(false)}
              className="flex items-center gap-2 px-3 py-1 bg-red-500/20 hover:bg-red-500/30 rounded smooth-transition text-red-400"
            >
              <EyeOff className="size-3" />
              <span>Exit (Ctrl+Shift+D)</span>
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-foreground/80">
            <div>
              <p className="text-muted-foreground">Framework</p>
              <p className="text-accent font-bold">Next.js 15</p>
            </div>
            <div>
              <p className="text-muted-foreground">Styling</p>
              <p className="text-accent font-bold">Tailwind CSS</p>
            </div>
            <div>
              <p className="text-muted-foreground">Language</p>
              <p className="text-accent font-bold">TypeScript</p>
            </div>
            <div>
              <p className="text-muted-foreground">Animations</p>
              <p className="text-accent font-bold">GSAP + Framer</p>
            </div>
          </div>

          <div className="mt-3 p-2 bg-background/50 rounded border border-primary/20">
            <p className="text-green-400">
              <span className="text-secondary">[LOG]</span> You discovered the hidden developer mode! 🎉
            </p>
            <p className="text-green-400">
              <span className="text-secondary">[INFO]</span> This portfolio was crafted with ❤️ and lots of ☕
            </p>
            <p className="text-green-400">
              <span className="text-secondary">[TIP]</span> Try opening the terminal (bottom-left) for more secrets!
            </p>
          </div>
        </div>
      </div>

      {/* Floating keyframes for animation */}
      <style jsx global>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0) translateX(0);
          }
          25% {
            transform: translateY(-20px) translateX(10px);
          }
          50% {
            transform: translateY(-10px) translateX(-10px);
          }
          75% {
            transform: translateY(-15px) translateX(5px);
          }
        }
      `}</style>
    </>
  );
}

