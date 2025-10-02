import { IProject } from '@/types';

export const GENERAL_INFO = {
    email: 'mithreshuttarwarmmvi@gmail.com',

    emailSubject: "Let's collaborate on a project",
    emailBody: 'Hi Mithresh, I am reaching out to you because...',

    oldPortfolio: '#',
    upworkProfile:
        'mailto:mithreshuttarwarmmvi@gmail.com?subject=Let%27s%20collaborate%20on%20a%20project&body=Hi%20Mithresh%2C%20I%20am%20reaching%20out%20to%20you%20because...'
};

export const SOCIAL_LINKS = [
    { name: 'github', url: 'https://github.com/Mithreshhh' },
    { name: 'linkedin', url: 'https://www.linkedin.com/in/mithresh-uttarwar/' },
];

export const MY_STACK = {
    frontend: [
        {
            name: 'JavaScript',
            icon: '/logo/js.svg',
        },
        {
            name: 'TypeScript',
            icon: '/logo/ts.svg',
        },
        {
            name: 'React',
            icon: '/logo/react.svg',
        },
        {
            name: 'Next.js',
            icon: '/logo/next.svg',
        },
        {
            name: 'Redux',
            icon: '/logo/redux.svg',
        },
        {
            name: 'Tailwind CSS',
            icon: '/logo/tailwind.svg',
        },
        // Removed animation and preprocessor badges per request
        {
            name: 'Bootstrap',
            icon: '/logo/bootstrap.svg',
        },
    ],
    backend: [
        {
            name: 'Node.js',
            icon: '/logo/node.svg',
        },
        {
            name: 'NestJS',
            icon: '/logo/nest.svg',
        },
        {
            name: 'Express.js',
            icon: '/logo/express.svg',
        },
    ],
    database: [
        {
            name: 'MySQL',
            icon: '/logo/mysql.svg',
        },
        {
            name: 'PostgreSQL',
            icon: '/logo/postgreSQL.svg',
        },
        {
            name: 'MongoDB',
            icon: '/logo/mongodb.svg',
        },
    ],
    tools: [
        {
            name: 'Git',
            icon: '/logo/git.svg',
        },
        {
            name: 'Docker',
            icon: '/logo/docker.svg',
        },
        {
            name: 'AWS',
            icon: '/logo/aws.svg',
        },
        {
            name: 'n8n',
            icon: '/logo/n8n.svg',
        },
    ],
    languages: [
        { name: 'Java', icon: '/logo/java.svg' },
        { name: 'Python', icon: '/logo/python.svg' },
    ],
    ml: [
        { name: 'NumPy', icon: '/logo/numpy.svg' },
        { name: 'Pandas', icon: '/logo/pandas.svg' },
        { name: 'Jupyter', icon: '/logo/jupyter.svg' },
    ],
};

export const PROJECTS: IProject[] = [
    {
        title: 'Voltworx',
        slug: 'voltworx',
        liveUrl: 'https://www.volt-worx.com/',
        year: 2025,
        description:
            'Main live product showcasing real-world delivery and polish.',
        role: 'CTO & Full‑Stack Developer',
        techStack: ['Next.js', 'React', 'Tailwind CSS'],
        thumbnail: '/projects/thumbnail/placeholder.svg',
        longThumbnail: '/projects/long/placeholder.svg',
        images: ['/images/voltworx(1).png', '/images/voltworx(2).png'],
        status: 'live',
    },
    {
        title: 'SIH 2025 Project',
        slug: 'sih-2025',
        year: 2025,
        description: 'Significant ongoing work for Smart India Hackathon.',
        role: 'Lead Developer',
        techStack: ['React', 'Node.js', 'MongoDB'],
        thumbnail: '/projects/thumbnail/placeholder.svg',
        longThumbnail: '/projects/long/placeholder.svg',
        images: ['/projects/long/placeholder.svg'],
        status: 'in-progress',
    },
    {
        title: 'College Website (MLRITM)',
        slug: 'mlritm-website',
        year: 2025,
        description: 'Official college website project. Live on Vercel.',
        role: 'Developer',
        techStack: ['Next.js', 'Payload CMS', 'Tailwind CSS'],
        thumbnail: '/projects/thumbnail/placeholder.svg',
        longThumbnail: '/projects/long/placeholder.svg',
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
        title: 'Freelance / Client Work',
        items: ['Gym Client Website (monthly)'],
    },
    {
        title: 'College Projects',
        items: [
            { label: 'IIC MLRITM Platform (Developer)', url: 'https://iic.mlritm.ac.in/' },
            'MLRITM College Website',
            'SIH Project (Lead Developer)',
        ],
    },
    {
        title: 'Personal Projects',
        items: [
            { label: 'voltworx.com (CTO)', url: 'https://www.volt-worx.com/' },
        ],
    },
    {
        title: 'Competitions',
        items: ['Ideathon Winner (Geethanjali)', 'Participated in one hackathon'],
    },
    {
        title: 'Club / Leadership Roles',
        items: ['IIC MLRITM (Developer)'],
    },
    {
        title: 'Internships',
        items: ['Join Eazy — Frontend Developer (1 month)'],
    },
];
