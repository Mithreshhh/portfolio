# DisplayCards Component

A modern, interactive card stack component with glassmorphism effects, smooth animations, and a vibrant color scheme that matches your portfolio.

## Features

- 🎴 **Stacked Card Design** - 3D layered effect with transform offsets
- 🌈 **Glassmorphism** - Semi-transparent backgrounds with backdrop blur
- ✨ **Smooth Animations** - Grayscale to color transitions on hover
- 🎨 **Theme Integration** - Uses portfolio's purple/orange color scheme
- 📱 **Responsive** - Works seamlessly on all screen sizes
- 🔧 **Customizable** - Multiple variants and fully customizable cards

## Usage

### Basic Usage (Default Variant)

```tsx
import DisplayCards from '@/components/DisplayCards';

export default function MyComponent() {
  return <DisplayCards />;
}
```

### Pre-built Variants

```tsx
// Experience Variant (Professional highlights)
<DisplayCards variant="experience" />

// Projects Variant (Your projects)
<DisplayCards variant="projects" />

// Default Variant (General content)
<DisplayCards variant="default" />
```

### Custom Cards

```tsx
import DisplayCards from '@/components/DisplayCards';
import { Trophy, Code2, Rocket } from 'lucide-react';

export default function MyComponent() {
  return (
    <DisplayCards
      cards={[
        {
          icon: <Trophy className="size-5" />,
          title: "Achievement",
          description: "Won Hackathon 2024",
          date: "December 2024",
          iconClassName: "bg-primary/20 text-primary",
          titleClassName: "text-primary",
          bgGradient: "from-primary/15 to-accent/10",
          className: "[grid-area:stack] hover:-translate-y-12 before:absolute before:inset-0 before:rounded-2xl before:border before:border-border/30 before:content-[''] before:bg-background/60 before:backdrop-blur-sm grayscale-[80%] hover:before:opacity-0 before:transition-all before:duration-700 hover:grayscale-0 before:z-[-1]",
        },
        {
          icon: <Code2 className="size-5" />,
          title: "Development",
          description: "Full-Stack Projects",
          date: "2024 - Present",
          iconClassName: "bg-secondary/20 text-secondary",
          titleClassName: "text-secondary",
          bgGradient: "from-secondary/15 to-primary/10",
          className: "[grid-area:stack] translate-x-16 translate-y-12 hover:-translate-y-2 before:absolute before:inset-0 before:rounded-2xl before:border before:border-border/30 before:content-[''] before:bg-background/60 before:backdrop-blur-sm grayscale-[80%] hover:before:opacity-0 before:transition-all before:duration-700 hover:grayscale-0 before:z-[-1]",
        },
        {
          icon: <Rocket className="size-5" />,
          title: "Learning",
          description: "AI & Machine Learning",
          date: "Currently Exploring",
          iconClassName: "bg-accent/20 text-accent",
          titleClassName: "text-accent",
          bgGradient: "from-accent/15 to-secondary/10",
          className: "[grid-area:stack] translate-x-32 translate-y-24 hover:translate-y-14 transition-transform duration-700",
        },
      ]}
    />
  );
}
```

## Props

### DisplayCardsProps

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `cards` | `DisplayCardProps[]` | `undefined` | Array of custom card configurations |
| `variant` | `"default" \| "experience" \| "projects"` | `"default"` | Pre-built card variants |

### DisplayCardProps

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | `undefined` | Additional CSS classes for card positioning and effects |
| `icon` | `React.ReactNode` | `<Sparkles />` | Icon to display in the card |
| `title` | `string` | `"Featured"` | Card title |
| `description` | `string` | `"Discover amazing content"` | Card description |
| `date` | `string` | `"Just now"` | Date or time information |
| `iconClassName` | `string` | `"bg-primary/20 text-primary"` | Classes for icon container styling |
| `titleClassName` | `string` | `"text-primary"` | Classes for title styling |
| `bgGradient` | `string` | `"from-primary/10 to-secondary/10"` | Gradient classes for hover effect |

## Styling Guide

### Card Positioning Classes

The component uses CSS Grid with `grid-area: stack` to overlay cards. Use these transform classes for positioning:

- **Top Card**: `[grid-area:stack] hover:-translate-y-12` (moves up on hover)
- **Middle Card**: `[grid-area:stack] translate-x-16 translate-y-12 hover:-translate-y-2`
- **Bottom Card**: `[grid-area:stack] translate-x-32 translate-y-24 hover:translate-y-14`

### Glassmorphism Effect

The grayscale-to-color effect on hover:

```tsx
className="before:absolute before:inset-0 before:rounded-2xl before:border before:border-border/30 before:content-[''] before:bg-background/60 before:backdrop-blur-sm grayscale-[80%] hover:before:opacity-0 before:transition-all before:duration-700 hover:grayscale-0 before:z-[-1]"
```

### Color Scheme

Use these color combinations for consistency with your portfolio:

- **Primary (Purple)**: `bg-primary/20 text-primary` + `from-primary/15 to-accent/10`
- **Secondary (Orange)**: `bg-secondary/20 text-secondary` + `from-secondary/15 to-primary/10`
- **Accent (Blue)**: `bg-accent/20 text-accent` + `from-accent/15 to-secondary/10`

## Example Integration

### In a Section Component with GSAP

```tsx
'use client';

import DisplayCards from '@/components/DisplayCards';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/all';
import { useRef } from 'react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function Showcase() {
    const containerRef = useRef<HTMLDivElement>(null);

    useGSAP(
        () => {
            gsap.from('.showcase-cards', {
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: 'top 70%',
                },
                y: 50,
                opacity: 0,
                duration: 1,
            });
        },
        { scope: containerRef },
    );

    return (
        <section ref={containerRef} className="py-20">
            <div className="container">
                <h2 className="text-5xl font-anton text-center mb-16">
                    <span className="text-primary">RECENT</span> HIGHLIGHTS
                </h2>
                <div className="showcase-cards flex justify-center">
                    <DisplayCards variant="experience" />
                </div>
            </div>
        </section>
    );
}
```

## Demo

Visit `/showcase-demo` to see all variants and examples in action.

## Design Notes

- Cards have an 8-degree negative skew (`-skew-y-[8deg]`) for a dynamic look
- The gradient fade on the right side creates depth (`after:` pseudo-element)
- Hover effects include scale, rotation, and color transitions (700ms duration)
- Cards are designed to work with dark mode backgrounds

## Browser Compatibility

- Modern browsers (Chrome, Firefox, Safari, Edge)
- CSS Grid and Transforms support required
- Backdrop filter support for glassmorphism effect

