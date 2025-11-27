'use client';

import DisplayCards from '@/components/DisplayCards';
import DisplayCardsEnhanced from '@/components/DisplayCardsEnhanced';
import { Briefcase, Code2, Award, Rocket, Sparkles, Trophy, GraduationCap } from 'lucide-react';

export default function ShowcaseDemo() {
    return (
        <div className="min-h-screen py-20 md:py-32">
            <div className="container">
                <h1 className="text-5xl md:text-7xl font-anton text-center mb-4">
                    <span className="text-primary">DISPLAY CARDS</span> SHOWCASE
                </h1>
                <p className="text-center text-muted-foreground text-lg mb-20 max-w-2xl mx-auto">
                    Interactive card stack component with glassmorphism effects and smooth animations
                </p>

                {/* Default Variant */}
                <section className="mb-32">
                    <h2 className="text-3xl md:text-4xl font-anton mb-8">
                        <span className="text-primary">DEFAULT</span> VARIANT
                    </h2>
                    <div className="flex justify-center">
                        <DisplayCards />
                    </div>
                </section>

                {/* Experience Variant */}
                <section className="mb-32">
                    <h2 className="text-3xl md:text-4xl font-anton mb-8">
                        <span className="text-secondary">EXPERIENCE</span> VARIANT
                    </h2>
                    <div className="flex justify-center">
                        <DisplayCards variant="experience" />
                    </div>
                </section>

                {/* Projects Variant */}
                <section className="mb-32">
                    <h2 className="text-3xl md:text-4xl font-anton mb-8">
                        <span className="text-accent">PROJECTS</span> VARIANT
                    </h2>
                    <div className="flex justify-center">
                        <DisplayCards variant="projects" />
                    </div>
                </section>

                {/* Enhanced Version with Mouse Tracking */}
                <section className="mb-32">
                    <h2 className="text-3xl md:text-4xl font-anton mb-4">
                        <span className="text-primary">ENHANCED</span> VERSION
                    </h2>
                    <p className="text-muted-foreground mb-8 text-center">
                        With mouse tracking, shimmer effects, and dynamic gradients
                    </p>
                    <div className="flex justify-center">
                        <DisplayCardsEnhanced />
                    </div>
                </section>

                {/* Custom Cards */}
                <section className="mb-32">
                    <h2 className="text-3xl md:text-4xl font-anton mb-8">
                        <span className="text-secondary">CUSTOM</span> CARDS
                    </h2>
                    <div className="flex justify-center">
                        <DisplayCards
                            cards={[
                                {
                                    icon: <Trophy className="size-5" />,
                                    title: "Winner",
                                    description: "Ideathon Champion 2024",
                                    date: "December 2024",
                                    iconClassName: "bg-yellow-500/20 text-yellow-500",
                                    titleClassName: "text-yellow-500",
                                    bgGradient: "from-yellow-500/15 to-orange-500/10",
                                    className: "[grid-area:stack] hover:-translate-y-12 before:absolute before:inset-0 before:rounded-2xl before:border before:border-border/30 before:content-[''] before:bg-background/60 before:backdrop-blur-sm grayscale-[80%] hover:before:opacity-0 before:transition-all before:duration-700 hover:grayscale-0 before:z-[-1]",
                                },
                                {
                                    icon: <GraduationCap className="size-5" />,
                                    title: "Education",
                                    description: "Computer Science Student",
                                    date: "2023 - Present",
                                    iconClassName: "bg-green-500/20 text-green-500",
                                    titleClassName: "text-green-500",
                                    bgGradient: "from-green-500/15 to-emerald-500/10",
                                    className: "[grid-area:stack] translate-x-16 translate-y-12 hover:-translate-y-2 before:absolute before:inset-0 before:rounded-2xl before:border before:border-border/30 before:content-[''] before:bg-background/60 before:backdrop-blur-sm grayscale-[80%] hover:before:opacity-0 before:transition-all before:duration-700 hover:grayscale-0 before:z-[-1]",
                                },
                                {
                                    icon: <Sparkles className="size-5" />,
                                    title: "Learning",
                                    description: "Machine Learning & AI",
                                    date: "Currently Exploring",
                                    iconClassName: "bg-pink-500/20 text-pink-500",
                                    titleClassName: "text-pink-500",
                                    bgGradient: "from-pink-500/15 to-purple-500/10",
                                    className: "[grid-area:stack] translate-x-32 translate-y-24 hover:translate-y-14 transition-transform duration-700",
                                },
                            ]}
                        />
                    </div>
                </section>

                {/* Features List */}
                <section className="max-w-4xl mx-auto mt-32 p-8 rounded-2xl border border-border/40 bg-muted/30 backdrop-blur-sm">
                    <h2 className="text-3xl font-anton mb-6">
                        <span className="text-primary">FEATURES</span>
                    </h2>
                    <ul className="space-y-3 text-muted-foreground">
                        <li className="flex items-start gap-3">
                            <span className="text-primary mt-1">▸</span>
                            <span><strong className="text-foreground">Stacked Card Design:</strong> Cards are stacked with transform offsets for a 3D layered effect</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="text-primary mt-1">▸</span>
                            <span><strong className="text-foreground">Glassmorphism:</strong> Semi-transparent backgrounds with backdrop blur for modern aesthetics</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="text-primary mt-1">▸</span>
                            <span><strong className="text-foreground">Smooth Hover Animations:</strong> Grayscale to color transition on hover with smooth transforms</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="text-secondary mt-1">▸</span>
                            <span><strong className="text-foreground">Mouse Tracking (Enhanced):</strong> Dynamic gradients that follow your cursor position</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="text-secondary mt-1">▸</span>
                            <span><strong className="text-foreground">Shimmer Effect (Enhanced):</strong> Animated light sweep across cards on hover</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="text-secondary mt-1">▸</span>
                            <span><strong className="text-foreground">Border Glow (Enhanced):</strong> Luminous borders with box shadows for depth</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="text-primary mt-1">▸</span>
                            <span><strong className="text-foreground">Multiple Variants:</strong> Pre-built variants for different use cases (default, experience, projects)</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="text-primary mt-1">▸</span>
                            <span><strong className="text-foreground">Fully Customizable:</strong> Pass custom cards with icons, colors, and gradients</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="text-primary mt-1">▸</span>
                            <span><strong className="text-foreground">Responsive Design:</strong> Works seamlessly on all screen sizes</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="text-primary mt-1">▸</span>
                            <span><strong className="text-foreground">Purple/Orange Theme:</strong> Matches your portfolio's vibrant color scheme</span>
                        </li>
                    </ul>
                </section>

                {/* Usage Example */}
                <section className="max-w-4xl mx-auto mt-12 p-8 rounded-2xl border border-border/40 bg-muted/30 backdrop-blur-sm">
                    <h2 className="text-3xl font-anton mb-6">
                        <span className="text-secondary">USAGE</span>
                    </h2>
                    <div className="bg-background/60 rounded-lg p-6 font-mono text-sm overflow-x-auto">
                        <pre className="text-foreground/90">
{`// Basic Usage
<DisplayCards />

// Enhanced Version (with mouse tracking)
<DisplayCardsEnhanced />

// With Variant
<DisplayCards variant="experience" />
<DisplayCards variant="projects" />

// Custom Cards
<DisplayCards
  cards={[
    {
      icon: <Trophy className="size-5" />,
      title: "Achievement",
      description: "Won Hackathon",
      date: "2024",
      iconClassName: "bg-primary/20 text-primary",
      titleClassName: "text-primary",
      bgGradient: "from-primary/15 to-accent/10",
      className: "...",
    },
    // More cards...
  ]}
/>`}
                        </pre>
                    </div>
                </section>
            </div>
        </div>
    );
}

