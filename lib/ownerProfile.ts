export interface Metric {
  value: string;
  label: string;
  status: 'verified' | 'client-reported' | 'founder-reported' | 'estimated' | 'illustrative' | 'private';
  source: string;
  public: boolean;
  lastVerified: string;
}

export interface Project {
  id: string;
  name: string;
  client: string;
  category: string;
  dates: string;
  role: string;
  problem: string;
  intervention: string;
  outcome: string;
  outcomeStatus: 'verified' | 'client-reported' | 'founder-reported' | 'estimated';
  url?: string;
  repository?: string;
  image: string;
  images: string[];
  stack: string[];
  services: string[];
  featured: boolean;
}

export interface JourneyMilestone {
  year: string;
  title: string;
  story: string;
  role: string;
  upgrade: string;
  category: string;
}

export interface Achievement {
  id: string;
  title: string;
  category: 'audience' | 'attention' | 'shipped work' | 'client proof' | 'founder milestone' | 'technical milestone' | 'community';
  description: string;
  date: string;
  badgeText: string;
  iconName: string;
}

export const ownerProfile = {
  identity: {
    fullName: "Mithresh Uttarwar",
    shortName: "Mithresh",
    osName: "Mithresh OS v1.3",
    domain: "mithresh-web.vercel.app",
    location: "Hyderabad, India",
    timezone: "IST (UTC+05:30)",
    roles: [
      "CTO & Full-Stack Developer",
      "Lead Developer @ SIH 2025",
      "IIC MLRITM Developer",
      "AI & Web Systems Architect"
    ],
    headline: "Building Scalable Digital Products, Full-Stack Applications & Intelligent Systems.",
    intro: "CTO at Voltworx and Lead Developer for SIH 2025. Crafting production-ready web platforms with Next.js, React, Node.js, and modern AI automation tools.",
    portrait: "/images/voltworx(1).png",
    sprite: "/images/mithresh_avatar.png",
    resumeUrl: "/Mithresh_Uttarwar_Resume.pdf"
  },
  imageGeneration: {
    mode: "codex-native",
    provider: "Antigravity Native Generator",
    model: "Imagen-3 / Native API",
    apiKeyEnvironmentVariable: "NATIVE_IMAGE_GEN",
    approvedSourceImages: ["/images/voltworx(1).png", "/images/mlritm(1).png"],
    likenessNotes: "Tech founder look, modern minimalist aesthetic, developer context",
    requiredOutputs: ["avatar_hero", "avatar_happy", "avatar_excited", "avatar_sad"],
    finalApprovalBy: "Mithresh Uttarwar"
  },
  conversion: {
    primaryLabel: "Enter Portfolio",
    primaryUrl: "#projects",
    secondaryLabel: "Book a Strategy Call",
    secondaryUrl: "mailto:mithreshuttarwarmmvi@gmail.com?subject=Let%27s%20collaborate%20on%20a%20project",
    bookingUrl: "mailto:mithreshuttarwarmmvi@gmail.com?subject=Schedule%20a%20Meeting",
    whatsappUrl: "https://wa.me/?text=Hi%20Mithresh%2C%20I%20saw%20your%20portfolio",
    email: "mithreshuttarwarmmvi@gmail.com",
    emergencyLabel: "SOS / Direct Reach"
  },
  metrics: [
    {
      value: "100%",
      label: "Production Uptime Delivered",
      status: "verified",
      source: "Voltworx Production Systems",
      public: true,
      lastVerified: "2026-08-01"
    },
    {
      value: "4+",
      label: "Flagship Platforms Launched",
      status: "verified",
      source: "Deployed Web Applications",
      public: true,
      lastVerified: "2026-08-01"
    },
    {
      value: "1st Place",
      label: "Geethanjali Ideathon Winner",
      status: "verified",
      source: "Geethanjali College Competition",
      public: true,
      lastVerified: "2025-03-15"
    },
    {
      value: "1,000+",
      label: "Students & Users Reached",
      status: "client-reported",
      source: "MLRITM Official College Portal",
      public: true,
      lastVerified: "2026-07-20"
    }
  ] as Metric[],
  projects: [
    {
      id: "voltworx",
      name: "Voltworx",
      client: "Voltworx Inc.",
      category: "Full-Stack SaaS / Production Platform",
      dates: "2025 – Present",
      role: "CTO & Full-Stack Developer",
      problem: "Required an ultra-fast, modern, scalable digital architecture for real-world product delivery and branding.",
      intervention: "Engineered next-gen web platform using Next.js 15, React, Tailwind CSS, and custom responsive animation layers.",
      outcome: "Successfully launched live product with high client satisfaction and seamless multi-device performance.",
      outcomeStatus: "verified",
      url: "https://www.volt-worx.com/",
      image: "/images/voltworx(1).png",
      images: ["/images/voltworx(1).png", "/images/voltworx(2).png"],
      stack: ["Next.js", "React", "TypeScript", "Tailwind CSS", "GSAP"],
      services: ["Full-Stack Architecture", "UI/UX Design", "Performance Optimization"],
      featured: true
    },
    {
      id: "mlritm-website",
      name: "MLRITM College Website",
      client: "MLR Institute of Technology & Management",
      category: "Institutional Portal & CMS",
      dates: "2025",
      role: "Developer",
      problem: "Legacy college portal lacked dynamic content management and modern responsive user experience for thousands of students and faculty.",
      intervention: "Built dynamic web application powered by Next.js and Payload CMS with structured content architecture and high-contrast UI.",
      outcome: "Deployed live on Vercel servicing active college traffic with instant page updates.",
      outcomeStatus: "verified",
      url: "https://mlritm-web.vercel.app/",
      repository: "https://github.com/rochanreddy/mlritm_web",
      image: "/images/mlritm(1).png",
      images: ["/images/mlritm(1).png", "/images/mlritm(2).png"],
      stack: ["Next.js", "Payload CMS", "Tailwind CSS", "TypeScript"],
      services: ["CMS Development", "Web Portal Engineering"],
      featured: true
    },
    {
      id: "sih-2025",
      name: "SIH 2025 Innovation Project",
      client: "Smart India Hackathon 2025",
      category: "National Hackathon Platform",
      dates: "2025 – Present",
      role: "Lead Developer",
      problem: "Complex problem statement requiring real-time data processing, user role management, and scalable backend workflows.",
      intervention: "Led developer team to build a React and Node.js solution with MongoDB database pipelines and interactive control dashboards.",
      outcome: "Selected and advancing in national level competition with robust system architecture.",
      outcomeStatus: "verified",
      image: "/images/voltworx(2).png",
      images: ["/images/voltworx(2).png"],
      stack: ["React", "Node.js", "MongoDB", "Express.js", "REST API"],
      services: ["Backend Engineering", "Team Leadership"],
      featured: true
    },
    {
      id: "browser-extension",
      name: "DSA Helper Chrome Extension",
      client: "Developer Tool / Open Source",
      category: "Browser Extension / Developer Productivity",
      dates: "2024",
      role: "Creator & Developer",
      problem: "Students solving DSA problems on competitive platforms often lack instant context on algorithm definitions and space/time complexities.",
      intervention: "Built a browser extension leveraging Chrome APIs to detect problem types on coding sites and overlay clean algorithm reference cards.",
      outcome: "Fully working UI prototype with context parsing engine ready for Chrome Web Store publishing.",
      outcomeStatus: "verified",
      image: "/images/web-ext(1).png",
      images: ["/images/web-ext(1).png", "/images/web-ext(2).png"],
      stack: ["JavaScript", "Chrome Extension API", "HTML/CSS"],
      services: ["Browser Extension Engineering", "Developer Tools"],
      featured: true
    }
  ] as Project[],
  clientCases: [
    {
      client: "Voltworx Platform",
      challenge: "High performance requirements for flagship company launch.",
      delivered: "End-to-end Next.js application stack with responsive visual polish.",
      metric: "100% Client Approval & Live Web Presence",
      disclosure: "Live client deployment verified at volt-worx.com"
    },
    {
      client: "MLRITM College",
      challenge: "Institutional site needing dynamic CMS integration and mobile reflow.",
      delivered: "Payload CMS + Next.js web application built with modern component library.",
      metric: "Active deployment serving 1,000+ daily page views",
      disclosure: "Deployed on Vercel infrastructure"
    },
    {
      client: "Gym Client Project",
      challenge: "Monthly digital presence maintenance and client acquisition funnel.",
      delivered: "High-converting web page with contact and membership lead flows.",
      metric: "Ongoing monthly maintenance contract",
      disclosure: "Verified client project"
    }
  ],
  testimonials: [
    {
      quote: "Mithresh delivered an outstanding digital product for Voltworx with top-tier technical architecture and attention to detail.",
      author: "Voltworx Leadership",
      title: "Co-Founder",
      project: "Voltworx SaaS Platform"
    },
    {
      quote: "Strong technical leadership during SIH 2025 and reliable execution on the college web infrastructure.",
      author: "MLRITM Faculty Lead",
      title: "IIC Department",
      project: "College & Hackathon Infrastructure"
    }
  ],
  journey: [
    {
      year: "2023",
      title: "Foundations in Core Engineering & Computer Science",
      story: "Mastered Java, Data Structures & Algorithms, and Python fundamentals while building key problem-solving disciplines.",
      role: "Student & Developer",
      upgrade: "DSA, Java & Python Mastery",
      category: "Education"
    },
    {
      year: "2024",
      title: "Frontend Engineering & Industry Internship",
      story: "Interned at Join Eazy as a Frontend Developer. Built the DSA Helper Chrome Extension and expanded into full web app development.",
      role: "Frontend Developer @ Join Eazy",
      upgrade: "React, Chrome APIs & Professional Workflow",
      category: "Career"
    },
    {
      year: "2025",
      title: "CTO at Voltworx & SIH 2025 Hackathon Lead",
      story: "Appointed CTO at Voltworx driving full-stack delivery. Won 1st Place at Geethanjali Ideathon and led development for SIH 2025.",
      role: "CTO @ Voltworx | Lead Developer",
      upgrade: "Full-Stack Architecture & Leadership",
      category: "Leadership"
    }
  ] as JourneyMilestone[],
  achievements: [
    {
      id: "ach-1",
      title: "Ideathon Winner",
      category: "shipped work",
      description: "Won 1st place in the prestigious Geethanjali College Ideathon competition for innovative technical solution design.",
      date: "2025",
      badgeText: "1st Place",
      iconName: "Trophy"
    },
    {
      id: "ach-2",
      title: "CTO at Voltworx",
      category: "founder milestone",
      description: "Leading technical architecture, frontend polish, and full-stack engineering for Voltworx.",
      date: "2025",
      badgeText: "C-Level Executive",
      iconName: "ShieldCheck"
    },
    {
      id: "ach-3",
      title: "SIH 2025 Lead Developer",
      category: "technical milestone",
      description: "Selected to lead the development team for Smart India Hackathon 2025 building national-scale web solutions.",
      date: "2025",
      badgeText: "National Competitor",
      iconName: "Code2"
    },
    {
      id: "ach-4",
      title: "IIC MLRITM Platform Developer",
      category: "community",
      description: "Engineered web features and platform components for the Institutional Innovation Council at MLRITM.",
      date: "2024 - 2025",
      badgeText: "Institutional Developer",
      iconName: "Building2"
    }
  ] as Achievement[],
  services: [
    {
      title: "Full-Stack Web Engineering",
      description: "End-to-end web application development using Next.js 15, React, TypeScript, and Node.js with high performance and accessibility."
    },
    {
      title: "AI Workflows & Automation",
      description: "Integration of custom AI agents, n8n automation pipelines, and API integrations for modern business operations."
    },
    {
      title: "UI/UX Design Systems & OS Portfolios",
      description: "Crafting bespoke, interactive user interfaces with rich animations, glassmorphism, and responsive reflow."
    }
  ],
  socials: [
    { name: "GitHub", handle: "@Mithreshhh", url: "https://github.com/Mithreshhh", icon: "Github" },
    { name: "LinkedIn", handle: "Mithresh Uttarwar", url: "https://www.linkedin.com/in/mithresh-uttarwar/", icon: "Linkedin" },
    { name: "Email", handle: "mithreshuttarwarmmvi@gmail.com", url: "mailto:mithreshuttarwarmmvi@gmail.com", icon: "Mail" },
    { name: "Voltworx", handle: "volt-worx.com", url: "https://www.volt-worx.com/", icon: "Globe" }
  ],
  themes: {
    day: {
      bg: "bg-gradient-to-br from-rose-50 via-slate-50 to-sky-100",
      text: "text-slate-900",
      card: "bg-white/80 border-slate-200 shadow-lg backdrop-blur-md",
      nav: "bg-white/70 border-slate-200/60 backdrop-blur-xl text-slate-800"
    },
    night: {
      bg: "bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900",
      text: "text-slate-100",
      card: "bg-slate-900/80 border-indigo-500/20 shadow-2xl backdrop-blur-md",
      nav: "bg-slate-950/80 border-indigo-500/30 backdrop-blur-xl text-slate-100"
    },
    dark: {
      bg: "bg-slate-950",
      text: "text-emerald-400",
      card: "bg-slate-900 border-slate-800 shadow-xl backdrop-blur-md",
      nav: "bg-slate-900/90 border-slate-800 backdrop-blur-xl text-slate-100"
    }
  },
  legal: {
    copyrightOwner: "Mithresh Uttarwar",
    assetLicenses: ["Voltworx Property", "MLRITM Open Data", "Personal Work"],
    metricDisclaimer: "Metrics are verified or client-reported as indicated."
  }
};
