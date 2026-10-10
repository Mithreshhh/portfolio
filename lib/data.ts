import { IProject } from '@/types';

export const GENERAL_INFO = {
    email: 'mithreshuttarwarmmvi@gmail.com',

    emailSubject: "Let's collaborate on a project",
    emailBody: 'Hi Mithresh, I am reaching out to you because...',

    oldPortfolio: '#',
    upworkProfile:
        'mailto:mithreshuttarwarmmvi@gmail.com?subject=Let%27s%20collaborate%20on%20a%20project&body=Hi%20Mithresh%2C%20I%20am%20reaching%20out%20to%20you%20because...',
    resume: '/Mithresh_Uttarwar_Resume.pdf',
};

export const SOCIAL_LINKS = [
    { name: 'github', url: 'https://github.com/Mithreshhh' },
    { name: 'linkedin', url: 'https://www.linkedin.com/in/mithresh-uttarwar/' },
];

// Skills mirror the "Technical Skills" section of the resume.
// An empty icon renders the first-letter badge in Skills.tsx.
export const MY_STACK = {
    languages: [
        { name: 'JavaScript', icon: '/logo/js.svg' },
        { name: 'TypeScript', icon: '/logo/ts.svg' },
        { name: 'Python', icon: '/logo/python.svg' },
        { name: 'Java', icon: '/logo/java.svg' },
    ],
    frontend: [
        { name: 'React', icon: '/logo/react.svg' },
        { name: 'Next.js', icon: '/logo/next.svg' },
        { name: 'Redux', icon: '/logo/redux.svg' },
        { name: 'HTML5', icon: '/logo/html5.svg' },
        { name: 'CSS3', icon: '/logo/css3.svg' },
        { name: 'Tailwind CSS', icon: '/logo/tailwind.svg' },
        { name: 'Bootstrap', icon: '/logo/bootstrap.svg' },
    ],
    backend: [
        { name: 'Node.js', icon: '/logo/node.svg' },
        { name: 'Express.js', icon: '/logo/express.svg' },
        { name: 'RESTful APIs', icon: '/logo/api.svg' },
    ],
    database: [
        { name: 'MongoDB', icon: '/logo/mongodb.svg' },
        { name: 'MySQL', icon: '/logo/mysql.svg' },
        { name: 'PostgreSQL', icon: '/logo/postgreSQL.svg' },
    ],
    'cloud & tools': [
        { name: 'Microsoft Azure', icon: '/logo/azure.svg' },
        { name: 'Vercel', icon: '/logo/vercel.svg' },
        { name: 'Docker', icon: '/logo/docker.svg' },
        { name: 'Git', icon: '/logo/git.svg' },
        { name: 'GitHub', icon: '/logo/github.svg' },
        { name: 'Postman', icon: '/logo/postman.svg' },
    ],
};

export const PROJECTS: IProject[] = [
    {
        title: 'Smart Student Hub',
        slug: 'smart-student-hub',
        year: 2026,
        description:
            'Full-stack student platform with role-based dashboards, approval workflows, JWT authentication, and shareable student portfolios. Backend on Azure App Service with Azure Database for PostgreSQL and Blob Storage (Managed Identity, RBAC, CORS); frontend on Vercel.',
        role: 'Full-Stack Developer',
        techStack: ['Next.js', 'React', 'Node.js', 'Express.js', 'PostgreSQL', 'Azure'],
        thumbnail: '/images/student-hub(1).png',
        longThumbnail: '/images/student-hub(1).png',
        images: ['/images/student-hub(1).png'],
        sourceCode: 'https://github.com/Mithreshhh',
        liveUrl: 'https://student-hub-three-pink.vercel.app/',
        status: 'live',
    },
    {
        title: 'College Website (MLRITM)',
        slug: 'mlritm-website',
        year: 2025,
        description:
            'Official website for Marri Laxman Reddy Institute of Technology and Management, with content managed by staff through Payload CMS.',
        role: 'Developer',
        techStack: ['Next.js', 'Payload CMS', 'Tailwind CSS'],
        thumbnail: '/images/mlritm(1).png',
        longThumbnail: '/images/mlritm(2).png',
        images: ['/images/mlritm(1).png', '/images/mlritm(2).png'],
        sourceCode: 'https://github.com/rochanreddy/mlritm_web',
        liveUrl: 'https://mlritm-web.vercel.app/',
        status: 'live',
    },
    {
        title: 'Voltworx',
        slug: 'voltworx',
        liveUrl: 'https://www.volt-worx.com/',
        year: 2025,
        description:
            'MERN stack platform connecting students with startups. Built the responsive UI, APIs, and optimized deployment.',
        role: 'CTO & Full‑Stack Developer',
        techStack: ['React', 'Node.js', 'Express.js', 'MongoDB'],
        thumbnail: '/images/voltworx(1).png',
        longThumbnail: '/images/voltworx(2).png',
        images: ['/images/voltworx(1).png', '/images/voltworx(2).png'],
        status: 'live',
    },
    {
        title: 'Browser Extension',
        slug: 'browser-extension',
        year: 2024,
        description:
            'DSA Helper — a Chrome extension that detects algorithms on coding sites and surfaces definitions, time/space complexities, and examples. Built UI first; packaging and store listing next.',
        role: 'Developer',
        techStack: ['JavaScript', 'Chrome API', 'HTML/CSS'],
        thumbnail: '/images/web-ext(1).png',
        longThumbnail: '/images/web-ext(2).png',
        images: ['/images/web-ext(1).png', '/images/web-ext(2).png'],
        status: 'in-progress',
    },
];

export type ExperienceType = 'Full-time' | 'Internship' | 'Leadership';

export interface ExperienceEntry {
    company: string;
    role: string;
    type: ExperienceType;
    start: string;
    /** null = present */
    end: string | null;
    url?: string;
    summary: string;
    highlights: string[];
    stack: string[];
}

// Mirrors the "Experience" section of the resume, newest first.
export const EXPERIENCE: ExperienceEntry[] = [
    {
        company: 'Menler Learning Systems',
        role: 'Full Stack Developer',
        type: 'Full-time',
        start: 'Jul 2026',
        end: null,
        url: 'https://menler.in/',
        summary: 'Building production LMS infrastructure at an early-stage AI EdTech startup.',
        highlights: [
            'Architected and built 3 core LMS modules used by ~30 users: an integrated PDF reader (pdf.js), Google Drive automation for content workflows, and Phase 2 of the assessment scoring system.',
            'Improved page speed score from 48 to 91 by converting image assets from PNG to WebP, reducing load times across the platform.',
            'Conducted a security audit that identified an exploitable webhook vulnerability, leading to secret rotation and removal of hardcoded fallbacks.',
            'Contributed to core LMS backend infrastructure and platform functionality end-to-end.',
            'Developed the Events page and contributed to an in-progress Blog module for the main Menler website.',
        ],
        stack: ['pdf.js', 'Google Drive automation', 'WebP'],
    },
    {
        company: 'Sleek Sky',
        role: 'Web Development Intern',
        type: 'Internship',
        start: 'Jan 2026',
        end: 'Feb 2026',
        summary: 'Client websites and CMS work for healthcare practices.',
        highlights: [
            'Worked on the CMS module, contributing to core content-management functionality.',
            'Built 2 industry-specific website templates (dental and cardiology practices) for client deployment.',
            'Gathered client requirements and delivered end-to-end websites aligned with practice needs.',
        ],
        stack: ['CMS', 'Client websites'],
    },
    {
        company: 'Institution Innovation Council, MLRITM',
        role: 'Technical Lead',
        type: 'Leadership',
        start: '2024',
        end: '2025',
        url: 'https://iic.mlritm.ac.in/',
        summary: 'Led the tech behind the college innovation council and its events.',
        highlights: [
            'Led development of the official IIC website and event-pass system using React, issuing ~150 event passes.',
            'Developed email campaign web pages and integrated a payment system into the event-pass platform.',
            'Actively participated in hosting and providing on-ground support during IIC events.',
            'Implemented responsive UI to improve accessibility and coordination.',
        ],
        stack: ['React', 'Payments', 'Email campaigns'],
    },
];

// --- Hero blueprints ---------------------------------------------------------
// The hero draws these as animated system diagrams. Every node and fact maps to a
// line on the résumé; don't add components that weren't actually built.
export type BlueprintKind = 'actor' | 'app' | 'service' | 'data' | 'external' | 'note';

export interface BlueprintNode {
    id: string;
    label: string;
    sub?: string;
    kind: BlueprintKind;
    /** Position in a 640 × 360 viewBox (node centre). */
    x: number;
    y: number;
}

export interface BlueprintEdge {
    from: string;
    to: string;
}

export interface Blueprint {
    key: string;
    title: string;
    /** Short status line shown under the title. */
    tag: string;
    href?: string;
    nodes: BlueprintNode[];
    edges: BlueprintEdge[];
    facts: string[];
}

export const BLUEPRINTS: Blueprint[] = [
    {
        key: 'menler',
        title: 'Menler LMS',
        tag: 'Now · Full Stack Developer',
        href: '#my-experience',
        nodes: [
            { id: 'users', label: '~30 users', sub: 'students & staff', kind: 'actor', x: 74, y: 180 },
            { id: 'app', label: 'LMS web app', sub: 'WebP · speed 48 → 91', kind: 'app', x: 236, y: 180 },
            { id: 'api', label: 'LMS backend', sub: 'core infrastructure', kind: 'service', x: 398, y: 180 },
            { id: 'pdf', label: 'PDF reader', sub: 'pdf.js, integrated', kind: 'service', x: 562, y: 70 },
            { id: 'drive', label: 'Google Drive', sub: 'content automation', kind: 'external', x: 562, y: 180 },
            { id: 'score', label: 'Scoring', sub: 'assessments · phase 2', kind: 'service', x: 562, y: 290 },
            { id: 'hooks', label: 'Webhooks', sub: 'audited · secrets rotated', kind: 'note', x: 236, y: 300 },
        ],
        edges: [
            { from: 'users', to: 'app' },
            { from: 'app', to: 'api' },
            { from: 'api', to: 'pdf' },
            { from: 'api', to: 'drive' },
            { from: 'api', to: 'score' },
            { from: 'hooks', to: 'api' },
        ],
        facts: ['3 core modules shipped to ~30 users', 'Page speed 48 → 91', 'Found and fixed an exploitable webhook'],
    },
    {
        key: 'student-hub',
        title: 'Smart Student Hub',
        tag: 'Live · 2026',
        href: '/projects/smart-student-hub',
        nodes: [
            { id: 'who', label: 'Students · Faculty', sub: 'role-based dashboards', kind: 'actor', x: 74, y: 180 },
            { id: 'web', label: 'Next.js', sub: 'on Vercel', kind: 'app', x: 236, y: 180 },
            { id: 'api', label: 'Express API', sub: 'Azure · JWT · RBAC', kind: 'service', x: 398, y: 180 },
            { id: 'db', label: 'PostgreSQL', sub: 'Azure Database', kind: 'data', x: 562, y: 100 },
            { id: 'blob', label: 'Blob Storage', sub: 'Managed Identity', kind: 'data', x: 562, y: 260 },
            { id: 'share', label: 'Shareable portfolio', sub: 'verified, public link', kind: 'note', x: 236, y: 300 },
        ],
        edges: [
            { from: 'who', to: 'web' },
            { from: 'web', to: 'api' },
            { from: 'api', to: 'db' },
            { from: 'api', to: 'blob' },
            { from: 'web', to: 'share' },
        ],
        facts: ['Approval workflows', 'JWT auth with RBAC', 'Azure backend, Vercel frontend'],
    },
    {
        key: 'voltworx',
        title: 'Voltworx',
        tag: 'Live · CTO & Full-Stack',
        href: '/projects/voltworx',
        nodes: [
            { id: 'students', label: 'Students', sub: 'micro-projects', kind: 'actor', x: 74, y: 110 },
            { id: 'startups', label: 'Startups', sub: 'post real work', kind: 'actor', x: 74, y: 250 },
            { id: 'ui', label: 'React UI', sub: 'responsive', kind: 'app', x: 236, y: 180 },
            { id: 'api', label: 'Node · Express', sub: 'REST APIs', kind: 'service', x: 398, y: 180 },
            { id: 'db', label: 'MongoDB', sub: 'documents', kind: 'data', x: 562, y: 180 },
        ],
        edges: [
            { from: 'students', to: 'ui' },
            { from: 'startups', to: 'ui' },
            { from: 'ui', to: 'api' },
            { from: 'api', to: 'db' },
        ],
        facts: ['MERN, end to end', 'Connects students with startups', 'Optimised deployment'],
    },
    {
        key: 'iic',
        title: 'IIC event passes',
        tag: 'Technical Lead · MLRITM',
        href: 'https://iic.mlritm.ac.in/',
        nodes: [
            { id: 'attendee', label: 'Attendees', sub: 'college events', kind: 'actor', x: 74, y: 180 },
            { id: 'site', label: 'IIC website', sub: 'React', kind: 'app', x: 236, y: 180 },
            { id: 'pay', label: 'Payments', sub: 'integrated gateway', kind: 'external', x: 398, y: 100 },
            { id: 'pass', label: 'Event pass', sub: '~150 issued', kind: 'service', x: 398, y: 260 },
            { id: 'mail', label: 'Email campaigns', sub: 'web pages', kind: 'note', x: 562, y: 180 },
        ],
        edges: [
            { from: 'attendee', to: 'site' },
            { from: 'site', to: 'pay' },
            { from: 'pay', to: 'pass' },
            { from: 'site', to: 'mail' },
        ],
        facts: ['~150 event passes issued', 'Payments integrated', 'Led the build and on-ground support'],
    },
];

export const EDUCATION = [
    {
        degree: 'B.Tech — Computer Science',
        school: 'Marri Laxman Reddy Institute of Technology and Management',
        period: '2023 – 2027',
        score: 'CGPA 8.66',
    },
    {
        degree: 'Class XII',
        school: 'Gyanville Academy',
        period: '2021 – 2023',
        score: '96.5%',
    },
    {
        degree: 'Class X',
        school: 'Excellaina Infinitum',
        period: '2021',
        score: 'GPA 10',
    },
];

export const ACHIEVEMENTS = [
    { title: 'Ideathon winner', detail: 'Geethanjali College' },
    { title: 'Hackathon participant', detail: 'Smart India Hackathon 2025' },
];

export const OTHER_WORK = [
    { title: 'Gym client website', detail: 'Freelance — built it, maintain it monthly' },
    { title: 'Join Eazy', detail: 'Frontend Developer Intern (1 month)' },
];
