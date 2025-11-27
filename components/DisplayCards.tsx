"use client";

import { cn } from "@/lib/utils";
import { Sparkles, Briefcase, Code2, Award, Rocket } from "lucide-react";
import { useState } from "react";

interface DisplayCardProps {
  className?: string;
  icon?: React.ReactNode;
  title?: string;
  description?: string;
  date?: string;
  iconClassName?: string;
  titleClassName?: string;
  bgGradient?: string;
}

function DisplayCard({
  className,
  icon = <Sparkles className="size-4" />,
  title = "Featured",
  description = "Discover amazing content",
  date = "Just now",
  iconClassName = "bg-primary/20 text-primary",
  titleClassName = "text-primary",
  bgGradient = "from-primary/10 to-secondary/10",
}: DisplayCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "group relative flex h-40 w-[23rem] -skew-y-[8deg] select-none flex-col justify-between rounded-2xl border-2 border-border/40 bg-gradient-to-br backdrop-blur-md px-5 py-4 transition-all duration-700 ease-out",
        "after:absolute after:-right-1 after:top-[-5%] after:h-[110%] after:w-[22rem] after:bg-gradient-to-l after:from-background after:via-background/80 after:to-transparent after:content-[''] after:pointer-events-none",
        "hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/20",
        "[&>*]:flex [&>*]:items-center [&>*]:gap-2.5",
        className
      )}
      style={{
        background: isHovered 
          ? `linear-gradient(135deg, hsl(var(--primary) / 0.15), hsl(var(--secondary) / 0.15))`
          : `linear-gradient(135deg, hsl(var(--muted) / 0.7), hsl(var(--background-light) / 0.9))`,
      }}
    >
      <div className="z-10">
        <span className={cn(
          "relative inline-flex items-center justify-center rounded-xl p-2.5 transition-all duration-500",
          "group-hover:scale-110 group-hover:rotate-6",
          iconClassName
        )}>
          {icon}
        </span>
        <p className={cn(
          "text-xl font-bold tracking-tight transition-colors duration-500",
          titleClassName
        )}>
          {title}
        </p>
      </div>
      
      <p className="z-10 whitespace-nowrap text-lg font-medium text-foreground/90 group-hover:text-foreground transition-colors duration-500">
        {description}
      </p>
      
      <p className="z-10 text-sm text-muted-foreground group-hover:text-foreground/70 transition-colors duration-500">
        {date}
      </p>

      {/* Animated gradient overlay */}
      <div className={cn(
        "absolute inset-0 rounded-2xl bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-700 -z-10",
        bgGradient
      )} />
    </div>
  );
}

interface DisplayCardsProps {
  cards?: DisplayCardProps[];
  variant?: "default" | "experience" | "projects";
}

export default function DisplayCards({ 
  cards, 
  variant = "default" 
}: DisplayCardsProps) {
  // Default cards based on variant
  const getDefaultCards = (): DisplayCardProps[] => {
    switch (variant) {
      case "experience":
        return [
          {
            icon: <Briefcase className="size-5" />,
            title: "Professional",
            description: "CTO @ Voltworx",
            date: "2025 - Present",
            iconClassName: "bg-primary/20 text-primary",
            titleClassName: "text-primary",
            bgGradient: "from-primary/15 to-accent/10",
            className: "[grid-area:stack] hover:-translate-y-12 before:absolute before:inset-0 before:rounded-2xl before:border before:border-border/30 before:content-[''] before:bg-background/60 before:backdrop-blur-sm grayscale-[80%] hover:before:opacity-0 before:transition-all before:duration-700 hover:grayscale-0 before:z-[-1]",
          },
          {
            icon: <Code2 className="size-5" />,
            title: "Development",
            description: "Full-Stack Developer",
            date: "Multiple Projects",
            iconClassName: "bg-secondary/20 text-secondary",
            titleClassName: "text-secondary",
            bgGradient: "from-secondary/15 to-primary/10",
            className: "[grid-area:stack] translate-x-16 translate-y-12 hover:-translate-y-2 before:absolute before:inset-0 before:rounded-2xl before:border before:border-border/30 before:content-[''] before:bg-background/60 before:backdrop-blur-sm grayscale-[80%] hover:before:opacity-0 before:transition-all before:duration-700 hover:grayscale-0 before:z-[-1]",
          },
          {
            icon: <Award className="size-5" />,
            title: "Achievement",
            description: "Ideathon Winner",
            date: "2024",
            iconClassName: "bg-accent/20 text-accent",
            titleClassName: "text-accent",
            bgGradient: "from-accent/15 to-secondary/10",
            className: "[grid-area:stack] translate-x-32 translate-y-24 hover:translate-y-14 transition-transform duration-700",
          },
        ];
      
      case "projects":
        return [
          {
            icon: <Rocket className="size-5" />,
            title: "Voltworx",
            description: "Live Production Platform",
            date: "2025",
            iconClassName: "bg-primary/20 text-primary",
            titleClassName: "text-primary",
            bgGradient: "from-primary/15 to-accent/10",
            className: "[grid-area:stack] hover:-translate-y-12 before:absolute before:inset-0 before:rounded-2xl before:border before:border-border/30 before:content-[''] before:bg-background/60 before:backdrop-blur-sm grayscale-[80%] hover:before:opacity-0 before:transition-all before:duration-700 hover:grayscale-0 before:z-[-1]",
          },
          {
            icon: <Code2 className="size-5" />,
            title: "SIH 2025",
            description: "Smart India Hackathon",
            date: "In Progress",
            iconClassName: "bg-secondary/20 text-secondary",
            titleClassName: "text-secondary",
            bgGradient: "from-secondary/15 to-primary/10",
            className: "[grid-area:stack] translate-x-16 translate-y-12 hover:-translate-y-2 before:absolute before:inset-0 before:rounded-2xl before:border before:border-border/30 before:content-[''] before:bg-background/60 before:backdrop-blur-sm grayscale-[80%] hover:before:opacity-0 before:transition-all before:duration-700 hover:grayscale-0 before:z-[-1]",
          },
          {
            icon: <Sparkles className="size-5" />,
            title: "MLRITM Web",
            description: "College Website",
            date: "Live",
            iconClassName: "bg-accent/20 text-accent",
            titleClassName: "text-accent",
            bgGradient: "from-accent/15 to-secondary/10",
            className: "[grid-area:stack] translate-x-32 translate-y-24 hover:translate-y-14 transition-transform duration-700",
          },
        ];
      
      default:
        return [
          {
            icon: <Sparkles className="size-5" />,
            title: "Featured",
            description: "Discover amazing work",
            date: "Latest",
            iconClassName: "bg-primary/20 text-primary",
            titleClassName: "text-primary",
            bgGradient: "from-primary/15 to-accent/10",
            className: "[grid-area:stack] hover:-translate-y-12 before:absolute before:inset-0 before:rounded-2xl before:border before:border-border/30 before:content-[''] before:bg-background/60 before:backdrop-blur-sm grayscale-[80%] hover:before:opacity-0 before:transition-all before:duration-700 hover:grayscale-0 before:z-[-1]",
          },
          {
            icon: <Code2 className="size-5" />,
            title: "Projects",
            description: "View my latest work",
            date: "2025",
            iconClassName: "bg-secondary/20 text-secondary",
            titleClassName: "text-secondary",
            bgGradient: "from-secondary/15 to-primary/10",
            className: "[grid-area:stack] translate-x-16 translate-y-12 hover:-translate-y-2 before:absolute before:inset-0 before:rounded-2xl before:border before:border-border/30 before:content-[''] before:bg-background/60 before:backdrop-blur-sm grayscale-[80%] hover:before:opacity-0 before:transition-all before:duration-700 hover:grayscale-0 before:z-[-1]",
          },
          {
            icon: <Award className="size-5" />,
            title: "Experience",
            description: "Professional journey",
            date: "Career",
            iconClassName: "bg-accent/20 text-accent",
            titleClassName: "text-accent",
            bgGradient: "from-accent/15 to-secondary/10",
            className: "[grid-area:stack] translate-x-32 translate-y-24 hover:translate-y-14 transition-transform duration-700",
          },
        ];
    }
  };

  const displayCards = cards || getDefaultCards();

  return (
    <div className="grid [grid-template-areas:'stack'] place-items-center animate-in fade-in duration-1000">
      {displayCards.map((cardProps, index) => (
        <DisplayCard key={index} {...cardProps} />
      ))}
    </div>
  );
}

