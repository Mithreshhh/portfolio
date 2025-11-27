"use client";

import { cn } from "@/lib/utils";
import { Sparkles } from "lucide-react";
import { useState, useEffect } from "react";

interface EnhancedDisplayCardProps {
  className?: string;
  icon?: React.ReactNode;
  title?: string;
  description?: string;
  date?: string;
  iconClassName?: string;
  titleClassName?: string;
  index?: number;
}

function EnhancedDisplayCard({
  className,
  icon = <Sparkles className="size-5" />,
  title = "Featured",
  description = "Discover amazing content",
  date = "Just now",
  iconClassName = "bg-primary/20 text-primary",
  titleClassName = "text-primary",
  index = 0,
}: EnhancedDisplayCardProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePosition({ x, y });
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "group relative flex h-44 w-96 -skew-y-[8deg] select-none flex-col justify-between rounded-2xl border-2 backdrop-blur-xl px-6 py-5 transition-all duration-700 ease-out overflow-hidden",
        "hover:border-primary/60 hover:shadow-2xl",
        "[&>*]:flex [&>*]:items-center [&>*]:gap-3 [&>*]:relative [&>*]:z-20",
        className
      )}
      style={{
        borderColor: isHovered ? 'hsl(var(--primary) / 0.6)' : 'hsl(var(--border) / 0.4)',
        background: `
          radial-gradient(
            600px circle at ${mousePosition.x}% ${mousePosition.y}%,
            hsl(var(--primary) / 0.15),
            transparent 40%
          ),
          linear-gradient(135deg, hsl(var(--muted) / 0.8), hsl(var(--background-light) / 0.95))
        `,
      }}
    >
      {/* Animated gradient orb that follows mouse */}
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
        style={{
          background: `radial-gradient(400px circle at ${mousePosition.x}% ${mousePosition.y}%, hsl(var(--primary) / 0.2), transparent 60%)`,
        }}
      />

      {/* Shimmer effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000">
        <div 
          className="absolute w-full h-full"
          style={{
            background: `linear-gradient(110deg, transparent 0%, transparent 40%, hsl(var(--primary) / 0.3) 50%, transparent 60%, transparent 100%)`,
            animation: isHovered ? 'shimmer 2s ease-in-out infinite' : 'none',
          }}
        />
      </div>

      {/* Content fade gradient */}
      <div className="absolute -right-1 top-[-5%] h-[110%] w-96 bg-gradient-to-l from-background via-background/80 to-transparent pointer-events-none z-10" />

      <div className="z-20">
        <span className={cn(
          "relative inline-flex items-center justify-center rounded-xl p-3 transition-all duration-500",
          "group-hover:scale-110 group-hover:rotate-6 group-hover:shadow-lg",
          iconClassName
        )}>
          {icon}
          {/* Icon glow */}
          <span className="absolute inset-0 rounded-xl blur-lg opacity-0 group-hover:opacity-50 transition-opacity duration-500" 
            style={{ background: 'currentColor' }}
          />
        </span>
        <p className={cn(
          "text-2xl font-bold tracking-tight transition-all duration-500",
          "group-hover:text-shadow-lg",
          titleClassName
        )}>
          {title}
        </p>
      </div>
      
      <p className="z-20 whitespace-nowrap text-lg font-medium text-foreground/80 group-hover:text-foreground transition-all duration-500 group-hover:translate-x-1">
        {description}
      </p>
      
      <div className="z-20 flex justify-between items-center w-full">
        <p className="text-sm text-muted-foreground group-hover:text-primary/70 transition-colors duration-500">
          {date}
        </p>
        <div className="w-8 h-8 rounded-full border border-border/40 group-hover:border-primary/60 transition-all duration-500 flex items-center justify-center text-xs font-bold text-muted-foreground group-hover:text-primary">
          {index + 1}
        </div>
      </div>

      {/* Border glow effect */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
        style={{
          boxShadow: `0 0 30px hsl(var(--primary) / 0.3), inset 0 0 20px hsl(var(--primary) / 0.1)`,
        }}
      />
    </div>
  );
}

interface EnhancedDisplayCardsProps {
  cards?: EnhancedDisplayCardProps[];
}

export default function DisplayCardsEnhanced({ cards }: EnhancedDisplayCardsProps) {
  const defaultCards: EnhancedDisplayCardProps[] = [
    {
      icon: <Sparkles className="size-5" />,
      title: "Featured Work",
      description: "Explore my latest projects",
      date: "2025",
      iconClassName: "bg-primary/20 text-primary shadow-primary/20",
      titleClassName: "text-primary",
      className: "[grid-area:stack] hover:-translate-y-12 transition-transform duration-700",
    },
    {
      icon: <Sparkles className="size-5" />,
      title: "Experience",
      description: "Professional journey",
      date: "Career Path",
      iconClassName: "bg-secondary/20 text-secondary shadow-secondary/20",
      titleClassName: "text-secondary",
      className: "[grid-area:stack] translate-x-16 translate-y-12 hover:translate-y-2 transition-transform duration-700",
    },
    {
      icon: <Sparkles className="size-5" />,
      title: "Achievements",
      description: "Awards and recognition",
      date: "Highlights",
      iconClassName: "bg-accent/20 text-accent shadow-accent/20",
      titleClassName: "text-accent",
      className: "[grid-area:stack] translate-x-32 translate-y-24 hover:translate-y-16 transition-transform duration-700",
    },
  ];

  const displayCards = cards || defaultCards;

  return (
    <>
      <style jsx global>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
      <div className="grid [grid-template-areas:'stack'] place-items-center animate-in fade-in duration-1000">
        {displayCards.map((cardProps, index) => (
          <EnhancedDisplayCard key={index} index={index} {...cardProps} />
        ))}
      </div>
    </>
  );
}

