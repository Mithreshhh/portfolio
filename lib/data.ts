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
        { name: 'HTML5', icon: '' },
        { name: 'CSS3', icon: '' },
        { name: 'Tailwind CSS', icon: '/logo/tailwind.svg' },
        { name: 'Bootstrap', icon: '/logo/bootstrap.svg' },
    ],
    backend: [
        { name: 'Node.js', icon: '/logo/node.svg' },
        { name: 'Express.js', icon: '/logo/express.svg' },
        { name: 'RESTful APIs', icon: '' },
    ],
    database: [
        { name: 'MongoDB', icon: '/logo/mongodb.svg' },
        { name: 'MySQL', icon: '/logo/mysql.svg' },
        { name: 'PostgreSQL', icon: '/logo/postgreSQL.svg' },
    ],
    'cloud & tools': [
        { name: 'Microsoft Azure', icon: '' },
        { name: 'Vercel', icon: '' },
        { name: 'Docker', icon: '/logo/docker.svg' },
        { name: 'Git', icon: '/logo/git.svg' },
        { name: 'GitHub', icon: '' },
        { name: 'Postman', icon: '' },
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
        title: 'College Website (MLRITM)',
        slug: 'mlritm-website',
        year: 2025,
        description: 'Official college website project. Live on Vercel.',
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

export const EXPERIENCE_GROUPS = [
    {
        title: 'Work Experience',
        items: [
            {
                label: 'Menler Learning Systems — Full Stack Developer (Jul 2026 – Present)',
                url: 'https://menler.in/',
            },
        ],
    },
    {
        title: 'Internships',
        items: [
            'Sleek Sky — Web Development Intern (Jan – Feb 2026)',
            'Join Eazy — Frontend Developer (1 month)',
        ],
    },
    {
        title: 'Club / Leadership Roles',
        items: [
            { label: 'IIC MLRITM — Technical Lead (2024 – 2025)', url: 'https://iic.mlritm.ac.in/' },
        ],
    },
    {
        title: 'College Projects',
        items: [
            { label: 'Smart Student Hub', url: 'https://student-hub-three-pink.vercel.app/' },
            'MLRITM College Website',
        ],
    },
    {
        title: 'Personal Projects',
        items: [
            { label: 'voltworx.com (CTO)', url: 'https://www.volt-worx.com/' },
        ],
    },
    {
        title: 'Freelance / Client Work',
        items: ['Gym Client Website (monthly)'],
    },
    {
        title: 'Competitions',
        items: ['Ideathon Winner (Geethanjali)', 'Participated in one hackathon'],
    },
];
