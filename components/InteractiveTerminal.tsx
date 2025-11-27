'use client';

import { useState, useRef, useEffect } from 'react';
import { X, Minimize2, Maximize2, Terminal as TerminalIcon, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PROJECTS, MY_STACK } from '@/lib/data';
import MatrixRain from './MatrixRain';

interface Command {
  input: string;
  output: string | JSX.Element;
  timestamp: number;
}

export default function InteractiveTerminal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [history, setHistory] = useState<Command[]>([]);
  const [currentInput, setCurrentInput] = useState('');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isTyping, setIsTyping] = useState(false);
  const [matrixActive, setMatrixActive] = useState(false);
  const [konamiUnlocked, setKonamiUnlocked] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);
  const scrollTimeoutRef = useRef<NodeJS.Timeout>();

  // Auto-focus input when terminal opens
  useEffect(() => {
    if (isOpen && !isMinimized && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen, isMinimized]);

  // Enhanced smooth scroll with parallax effect
  useEffect(() => {
    if (outputRef.current) {
      // Clear any pending scroll
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      const scrollToBottom = () => {
        if (!outputRef.current) return;
        
        const targetScroll = outputRef.current.scrollHeight;
        const currentScroll = outputRef.current.scrollTop;
        const distance = targetScroll - currentScroll;
        
        // Smooth scroll with easing
        const duration = Math.min(500, Math.abs(distance) * 2);
        const startTime = Date.now();
        const startScroll = currentScroll;

        const animateScroll = () => {
          const elapsed = Date.now() - startTime;
          const progress = Math.min(elapsed / duration, 1);
          
          // Easing function (ease-out)
          const easeOut = 1 - Math.pow(1 - progress, 3);
          
          if (outputRef.current) {
            outputRef.current.scrollTop = startScroll + distance * easeOut;
          }

          if (progress < 1) {
            requestAnimationFrame(animateScroll);
          }
        };

        requestAnimationFrame(animateScroll);
      };

      scrollTimeoutRef.current = setTimeout(scrollToBottom, 100);
    }

    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [history]);

  // Scroll fade effect on terminal content
  useEffect(() => {
    if (!outputRef.current || isMinimized) return;

    const handleScroll = () => {
      if (!outputRef.current) return;
      const { scrollTop, scrollHeight, clientHeight } = outputRef.current;
      
      // Add fade effect at top/bottom
      const fadeHeight = 50;
      const topFade = Math.min(scrollTop / fadeHeight, 1);
      const bottomFade = Math.min((scrollHeight - clientHeight - scrollTop) / fadeHeight, 1);
      
      outputRef.current.style.maskImage = `linear-gradient(to bottom, 
        transparent ${topFade * fadeHeight}px, 
        black ${fadeHeight}px, 
        black calc(100% - ${fadeHeight}px), 
        transparent calc(100% - ${bottomFade * fadeHeight}px)
      )`;
    };

    outputRef.current.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial call

    return () => {
      outputRef.current?.removeEventListener('scroll', handleScroll);
    };
  }, [isMinimized, history]);

  // Keyboard shortcuts for command history
  useEffect(() => {
    if (!isOpen || isMinimized) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp' && commandHistory.length > 0) {
        e.preventDefault();
        const newIndex = historyIndex < commandHistory.length - 1 ? historyIndex + 1 : historyIndex;
        setHistoryIndex(newIndex);
        setCurrentInput(commandHistory[commandHistory.length - 1 - newIndex] || '');
      } else if (e.key === 'ArrowDown' && historyIndex >= 0) {
        e.preventDefault();
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        if (newIndex < 0) {
          setCurrentInput('');
        } else {
          setCurrentInput(commandHistory[commandHistory.length - 1 - newIndex] || '');
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isMinimized, commandHistory, historyIndex]);

  const commands: Record<string, () => string | JSX.Element> = {
    help: () => (
      <div className="space-y-2 animate-in fade-in slide-in-from-left-2 duration-300">
        <p className="text-primary font-bold">Available Commands:</p>
        <p><span className="text-secondary">/help</span> - Show this help message</p>
        <p><span className="text-secondary">/skills</span> - Display my tech stack</p>
        <p><span className="text-secondary">/projects</span> - List all projects</p>
        <p><span className="text-secondary">/hire</span> - Get contact information</p>
        <p><span className="text-secondary">/matrix</span> - Activate Matrix mode 😎</p>
        <p><span className="text-secondary">/exitmatrix</span> - Exit Matrix mode</p>
        <p><span className="text-secondary">/konami</span> - Unlock special features 🎮</p>
        <p><span className="text-secondary">/easteregg</span> - Find a secret!</p>
        <p><span className="text-secondary">/clear</span> - Clear terminal</p>
        <p><span className="text-secondary">/about</span> - About this terminal</p>
      </div>
    ),
    skills: () => {
      const categories = Object.keys(MY_STACK);
      return (
        <div className="space-y-3">
          <p className="text-primary font-bold">Tech Stack:</p>
          {categories.map((category) => (
            <div key={category}>
              <p className="text-secondary capitalize">{category}:</p>
              <p className="ml-4 text-accent">
                {MY_STACK[category as keyof typeof MY_STACK].map((tech: any) => tech.name).join(', ')}
              </p>
            </div>
          ))}
        </div>
      );
    },
    projects: () => (
      <div className="space-y-2">
        <p className="text-primary font-bold">Featured Projects:</p>
        {PROJECTS.map((project, idx) => (
          <div key={project.slug} className="ml-4">
            <p>
              <span className="text-secondary">[{idx + 1}]</span>{' '}
              <span className="text-accent">{project.title}</span>
              {project.status === 'live' && <span className="text-green-400"> ● LIVE</span>}
            </p>
            <p className="text-muted-foreground text-sm ml-6">{project.description}</p>
          </div>
        ))}
      </div>
    ),
    hire: () => (
      <div className="space-y-2">
        <p className="text-primary font-bold">Let&apos;s Work Together!</p>
        <p>📧 Email: <span className="text-accent">mithreshuttarwarmmvi@gmail.com</span></p>
        <p>💼 Status: <span className="text-green-400">Open to opportunities</span></p>
        <p>🔗 LinkedIn: <a href="https://www.linkedin.com/in/mithresh-uttarwar/" target="_blank" className="text-secondary hover:underline">linkedin.com/in/mithresh-uttarwar</a></p>
        <p>🐙 GitHub: <a href="https://github.com/Mithreshhh" target="_blank" className="text-secondary hover:underline">github.com/Mithreshhh</a></p>
      </div>
    ),
    matrix: () => {
      setMatrixActive(true);
      return (
        <div className="space-y-2 animate-in fade-in zoom-in duration-500">
          <p className="text-green-400 font-bold text-lg">🔴 MATRIX MODE ACTIVATED</p>
          <p className="text-green-400/80">Wake up, Neo...</p>
          <p className="text-green-400/60 text-xs">The Matrix has you. Follow the white rabbit.</p>
          <p className="text-green-400/40 text-xs mt-2">Type /exitmatrix to close</p>
        </div>
      );
    },
    exitmatrix: () => {
      setMatrixActive(false);
      return <p className="text-green-400">Matrix mode deactivated. Welcome back to reality.</p>;
    },
    easteregg: () => (
      <div className="space-y-2">
        <p className="text-primary font-bold">🎉 You found the Easter Egg!</p>
        <p className="text-accent">Secret Achievement Unlocked: <span className="text-yellow-400">Curious Explorer</span></p>
        <p className="text-sm">Fun fact: This terminal was built with React, TypeScript, and lots of ☕</p>
        <p className="text-sm">Try typing <span className="text-secondary">/konami</span> for another surprise!</p>
      </div>
    ),
    konami: () => {
      const sequence = ['up', 'up', 'down', 'down', 'left', 'right', 'left', 'right', 'b', 'a'];
      
      setTimeout(() => {
        setKonamiUnlocked(true);
      }, 2000);

      return (
        <div className="space-y-3 animate-in fade-in zoom-in duration-500">
          <div className="flex gap-2 flex-wrap">
            {sequence.map((key, idx) => (
              <span 
                key={idx}
                className="px-2 py-1 bg-primary/20 text-primary rounded animate-in fade-in zoom-in duration-300"
                style={{ animationDelay: `${idx * 150}ms` }}
              >
                {key === 'up' ? '⬆️' : key === 'down' ? '⬇️' : key === 'left' ? '⬅️' : key === 'right' ? '➡️' : key === 'b' ? '🅱️' : '🅰️'}
              </span>
            ))}
          </div>
          <p className="text-primary font-bold text-lg">🎮 CHEAT CODE ACTIVATED!</p>
          <div className="space-y-1 text-sm">
            <p className="text-accent">✨ Unlocked Features:</p>
            <p className="text-secondary">• Terminal colors enhanced</p>
            <p className="text-secondary">• Special animations enabled</p>
            <p className="text-secondary">• Hidden commands revealed</p>
          </div>
        </div>
      );
    },
    about: () => (
      <div className="space-y-2">
        <p className="text-primary font-bold">Interactive Terminal v1.0</p>
        <p>Built by: <span className="text-accent">Mithresh Uttarwar</span></p>
        <p>Purpose: Making portfolios cool since 2025 😎</p>
        <p className="text-sm text-muted-foreground">Type /help to see all commands</p>
      </div>
    ),
    clear: () => '',
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const input = currentInput.trim();
    const inputLower = input.toLowerCase();
    
    if (!input) return;

    // Add to command history (only non-empty, non-duplicate commands)
    if (input && (!commandHistory.length || commandHistory[commandHistory.length - 1] !== input)) {
      setCommandHistory([...commandHistory, input]);
    }
    setHistoryIndex(-1);

    // Clear command
    if (inputLower === '/clear') {
      setHistory([]);
      setCurrentInput('');
      return;
    }

    // Exit matrix command
    if (inputLower === '/exitmatrix') {
      setMatrixActive(false);
      const output = commands['exitmatrix']();
      setHistory([...history, { 
        input: currentInput, 
        output,
        timestamp: Date.now()
      }]);
      setCurrentInput('');
      return;
    }

    // Show typing indicator
    setIsTyping(true);
    
    // Variable delay based on command (matrix needs more time)
    const delay = inputLower === '/matrix' ? 300 : inputLower === '/konami' ? 200 : 150;
    await new Promise(resolve => setTimeout(resolve, delay));

    const command = commands[inputLower.replace('/', '')];
    const output = command 
      ? command() 
      : <span className="text-red-400 animate-pulse">Command not found. Type <span className="text-secondary">/help</span> for available commands.</span>;

    setHistory([...history, { 
      input: currentInput, 
      output,
      timestamp: Date.now()
    }]);
    
    setCurrentInput('');
    setIsTyping(false);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 left-6 z-50 size-14 rounded-full bg-gradient-to-r from-primary to-secondary hover:scale-110 smooth-transition shadow-2xl shadow-primary/50 flex items-center justify-center group animate-in fade-in slide-in-from-left-4 duration-500"
        title="Open Terminal"
      >
        <TerminalIcon className="size-6 text-white group-hover:animate-pulse transition-transform group-hover:rotate-12" />
        <span className="absolute inset-0 rounded-full bg-primary/20 animate-ping opacity-0 group-hover:opacity-100" />
      </button>
    );
  }

  return (
    <>
      {/* Matrix Rain Effect */}
      <MatrixRain isActive={matrixActive} onClose={() => setMatrixActive(false)} />

      <div
        className={cn(
          'fixed z-50 bg-black/95 backdrop-blur-md border-2 rounded-lg shadow-2xl flex flex-col overflow-hidden transition-all duration-500 ease-out',
          'animate-in fade-in slide-in-from-bottom-4',
          konamiUnlocked 
            ? 'border-primary/80 shadow-primary/50 ring-2 ring-primary/30' 
            : 'border-primary/50 shadow-primary/30',
          isMinimized
            ? 'bottom-6 left-6 w-80 h-14'
            : 'bottom-6 left-6 w-[600px] max-w-[calc(100vw-3rem)] h-[500px] max-h-[calc(100vh-3rem)]'
        )}
        style={{
          transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
          transform: konamiUnlocked ? 'scale(1.02)' : 'scale(1)',
        }}
      >
      {/* Header */}
      <div className={cn(
        "flex items-center justify-between px-4 py-2 border-b transition-all duration-500",
        konamiUnlocked 
          ? "bg-gradient-to-r from-primary/30 via-secondary/20 to-primary/30 border-primary/50" 
          : "bg-gradient-to-r from-primary/20 to-secondary/20 border-primary/30"
      )}>
        <div className="flex items-center gap-2">
          <TerminalIcon className={cn(
            "size-4 transition-all duration-500",
            konamiUnlocked ? "text-primary animate-pulse" : "text-primary"
          )} />
          <span className={cn(
            "text-sm font-bold transition-all duration-500",
            konamiUnlocked ? "text-primary" : "text-primary"
          )}>
            TERMINAL
          </span>
          {konamiUnlocked && (
            <Sparkles className="size-3 text-yellow-400 animate-pulse" />
          )}
          <span className="text-xs text-muted-foreground">v1.0</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="hover:bg-primary/20 p-1 rounded smooth-transition"
            title={isMinimized ? 'Maximize' : 'Minimize'}
          >
            {isMinimized ? <Maximize2 className="size-4" /> : <Minimize2 className="size-4" />}
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="hover:bg-red-500/20 p-1 rounded smooth-transition"
            title="Close"
          >
            <X className="size-4" />
          </button>
        </div>
      </div>

      {/* Terminal Content */}
      {!isMinimized && (
        <>
          <div
            ref={outputRef}
            className="flex-1 overflow-y-auto p-4 space-y-3 font-mono text-sm scroll-smooth relative"
            style={{
              scrollBehavior: 'smooth',
              WebkitOverflowScrolling: 'touch',
            }}
          >
            {/* Scroll gradient overlays */}
            <div className="sticky top-0 left-0 right-0 h-8 bg-gradient-to-b from-black/95 to-transparent pointer-events-none z-10" />
            <div className="sticky bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-black/95 to-transparent pointer-events-none z-10" />
            {/* Welcome Message */}
            {history.length === 0 && (
              <div className="space-y-2 text-green-400 animate-in fade-in slide-in-from-bottom-2 duration-500">
                <p className="flex items-center gap-2">
                  <span className="animate-pulse">●</span>
                  Welcome to Mithresh&apos;s Interactive Terminal!
                </p>
                <p>Type <span className="text-secondary font-bold">/help</span> to see available commands.</p>
                <p className="text-muted-foreground text-xs">Tip: Try <span className="text-accent">/matrix</span> for something cool 😉</p>
              </div>
            )}

            {/* Command History */}
            {history.map((cmd, idx) => {
              const isMatrix = cmd.input.toLowerCase() === '/matrix';
              const isKonami = cmd.input.toLowerCase() === '/konami';
              
              return (
                <div 
                  key={`${cmd.timestamp}-${idx}`} 
                  className={cn(
                    "space-y-1 transition-all duration-500",
                    "animate-in fade-in slide-in-from-bottom-2",
                    isMatrix && "border-l-2 border-green-400/50 pl-2",
                    isKonami && konamiUnlocked && "border-l-2 border-primary/50 pl-2"
                  )}
                  style={{
                    animationDelay: `${idx * 50}ms`,
                  }}
                >
                  <p className={cn(
                    "flex items-center gap-1 transition-colors duration-300",
                    konamiUnlocked && "text-primary"
                  )}>
                    <span className={cn(
                      "transition-colors duration-300",
                      konamiUnlocked ? "text-accent" : "text-secondary"
                    )}>
                      mithresh@portfolio
                    </span>
                    <span className="text-muted-foreground">:</span>
                    <span className={cn(
                      "transition-colors duration-300",
                      konamiUnlocked ? "text-secondary" : "text-accent"
                    )}>
                      ~
                    </span>
                    <span className="text-muted-foreground">$</span>
                    <span className={cn(
                      "ml-1 transition-all duration-300",
                      isMatrix && "text-green-400",
                      isKonami && konamiUnlocked && "text-primary font-bold"
                    )}>
                      {cmd.input}
                    </span>
                  </p>
                  <div className={cn(
                    "ml-4 mt-1 transition-all duration-500",
                    "text-foreground/90",
                    isMatrix && "text-green-400/90",
                    konamiUnlocked && isKonami && "text-primary/90"
                  )}>
                    {cmd.output}
                  </div>
                </div>
              );
            })}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex items-center gap-2 text-muted-foreground animate-pulse">
                <span className="animate-bounce">●</span>
                <span>Processing command...</span>
              </div>
            )}
          </div>

          {/* Input */}
          <form 
            onSubmit={handleSubmit} 
            className="flex items-center gap-2 px-4 py-3 border-t border-primary/30 bg-background/50 transition-all duration-200 hover:bg-background/70"
          >
            <span className="text-secondary font-mono text-sm animate-pulse">$</span>
            <input
              ref={inputRef}
              type="text"
              value={currentInput}
              onChange={(e) => setCurrentInput(e.target.value)}
              className="flex-1 bg-transparent outline-none text-foreground font-mono text-sm placeholder:text-muted-foreground/50 transition-all duration-200 focus:placeholder:text-muted-foreground/30"
              placeholder="Type a command..."
              autoComplete="off"
              spellCheck="false"
            />
            {currentInput && (
              <button
                type="button"
                onClick={() => setCurrentInput('')}
                className="text-muted-foreground hover:text-foreground transition-colors"
                title="Clear input"
              >
                <X className="size-4" />
              </button>
            )}
          </form>
        </>
      )}
      </div>
    </>
  );
}

