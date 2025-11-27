'use client';

import { useState, useRef, useEffect } from 'react';
import { Music, Volume2, VolumeX, Minimize2, Radio } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MusicVisualizerProps {
  youtubeVideoId: string;
  songTitle?: string;
  artist?: string;
}

export default function MusicVisualizer({
  youtubeVideoId,
  songTitle = 'Line Without a Hook',
  artist = 'Ricky Montgomery',
}: MusicVisualizerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [bars, setBars] = useState<number[]>(Array(20).fill(0));
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!isPlaying) return;

    // Simulate audio visualization
    const interval = setInterval(() => {
      setBars(Array.from({ length: 20 }, () => Math.random() * 100));
    }, 100);

    return () => clearInterval(interval);
  }, [isPlaying]);

  useEffect(() => {
    if (!canvasRef.current || !isExpanded) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    let animationId: number;
    const particles: Array<{
      x: number;
      y: number;
      radius: number;
      vx: number;
      vy: number;
      color: string;
    }> = [];

    // Create particles
    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 2 + 1,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        color: i % 2 === 0 ? '#a855f7' : '#ff7f57',
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw particles
      particles.forEach((particle) => {
        particle.x += particle.vx;
        particle.y += particle.vy;

        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.shadowBlur = 10;
        ctx.shadowColor = particle.color;
        ctx.fill();
      });

      animationId = requestAnimationFrame(animate);
    };

    if (isPlaying) animate();

    return () => {
      if (animationId) cancelAnimationFrame(animationId);
    };
  }, [isExpanded, isPlaying]);

  return (
    <>
      {/* Hidden YouTube iframe */}
      {isPlaying && (
        <iframe
          width="0"
          height="0"
          style={{ border: 0, display: 'block', position: 'absolute', opacity: 0 }}
          src={`https://www.youtube.com/embed/${youtubeVideoId}?autoplay=1&loop=1&playlist=${youtubeVideoId}&controls=0&rel=0&showinfo=0${
            isMuted ? '&mute=1' : ''
          }`}
          allow="autoplay; encrypted-media"
          frameBorder="0"
          allowFullScreen
        />
      )}

      {/* Main player button */}
      {!isExpanded && (
        <div className="fixed bottom-8 right-8 z-50 group">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="relative w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary shadow-lg hover:shadow-2xl transition-all duration-300 flex items-center justify-center hover:scale-110"
          >
            {isPlaying && (
              <>
                <span className="absolute inset-0 rounded-full bg-primary/30 animate-ping" />
                <span className="absolute inset-0 rounded-full bg-primary/20 animate-pulse" />
              </>
            )}
            <Music className={cn('w-6 h-6 text-white relative z-10', isPlaying && 'animate-pulse')} />
          </button>

          {/* Mini info panel */}
          {isPlaying && (
            <div className="absolute bottom-full right-0 mb-4 bg-black/90 backdrop-blur-md rounded-2xl p-4 shadow-xl border border-primary/30 min-w-[280px] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="mb-3">
                <p className="text-sm font-bold text-primary">{songTitle}</p>
                <p className="text-xs text-muted-foreground">{artist}</p>
              </div>

              <div className="flex items-center gap-2 mb-3">
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="px-4 py-2 rounded-lg bg-muted/50 hover:bg-muted transition-colors flex items-center gap-2"
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  <span className="text-xs">{isMuted ? 'Unmute' : 'Mute'}</span>
                </button>

                <button
                  onClick={() => setIsExpanded(true)}
                  className="px-4 py-2 rounded-lg bg-primary/20 hover:bg-primary/30 transition-colors flex items-center gap-2"
                >
                  <Radio className="w-4 h-4" />
                  <span className="text-xs">Visualizer</span>
                </button>
              </div>

              {/* Mini bars */}
              <div className="flex items-end justify-center gap-1 h-12">
                {bars.slice(0, 12).map((height, i) => (
                  <div
                    key={i}
                    className="w-1 bg-gradient-to-t from-primary via-secondary to-accent rounded-full transition-all duration-150"
                    style={{ height: `${height}%` }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Expanded Visualizer Dashboard */}
      {isExpanded && (
        <div className="fixed inset-0 z-[60] bg-black/95 backdrop-blur-xl flex items-center justify-center p-6">
          <div className="w-full max-w-4xl bg-gradient-to-br from-background/90 to-background-light/90 rounded-3xl border-2 border-primary/30 shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-primary/20 to-secondary/20 border-b border-primary/30">
              <div className="flex items-center gap-3">
                <Radio className="w-6 h-6 text-primary animate-pulse" />
                <div>
                  <h3 className="font-bold text-lg text-primary">{songTitle}</h3>
                  <p className="text-sm text-muted-foreground">{artist}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="p-2 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </button>

                <button
                  onClick={() => setIsExpanded(false)}
                  className="p-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 transition-colors"
                >
                  <Minimize2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Visualizer Canvas */}
            <div className="relative h-64 bg-gradient-to-br from-background to-background-light overflow-hidden">
              <canvas ref={canvasRef} className="w-full h-full" />

              {/* Frequency Bars Overlay */}
              <div className="absolute bottom-0 left-0 right-0 flex items-end justify-center gap-2 p-6">
                {bars.map((height, i) => (
                  <div
                    key={i}
                    className="w-4 bg-gradient-to-t from-primary via-secondary to-accent rounded-t-lg shadow-lg transition-all duration-150"
                    style={{
                      height: `${height * 1.5}px`,
                      boxShadow: `0 0 20px ${
                        i % 3 === 0 ? '#a855f7' : i % 3 === 1 ? '#ff7f57' : '#3b82f6'
                      }`,
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Controls */}
            <div className="px-6 py-4 bg-background/50">
              <div className="flex items-center justify-center gap-6">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary hover:scale-110 transition-transform flex items-center justify-center shadow-lg shadow-primary/50"
                >
                  <Music className="w-6 h-6 text-white" />
                </button>

                <div className="text-center">
                  <p className="text-xs text-muted-foreground mb-1">Status</p>
                  <p className="text-sm font-bold text-primary">{isPlaying ? '▶ Playing' : '⏸ Paused'}</p>
                </div>

                <div className="text-center">
                  <p className="text-xs text-muted-foreground mb-1">Quality</p>
                  <p className="text-sm font-bold text-secondary">HD Audio</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

