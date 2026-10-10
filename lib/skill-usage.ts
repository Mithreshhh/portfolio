// "Where I used it" matrix data. Every cell maps to a line in lib/data.ts or the
// résumé; an absent cell means the résumé does not tie that tool to that system.

export type SystemKey = 'menler' | 'student-hub' | 'voltworx' | 'mlritm' | 'perception';

export interface SkillSystem {
    key: SystemKey;
    /** Full name, used in the legend and tooltips. */
    title: string;
    /** Column header on sm+ screens. */
    short: string;
    /** Column header on narrow screens. */
    abbr: string;
    /** Where the column header links to. */
    href: string;
    /** Extra line in the header tooltip. */
    note?: string;
}

export const SKILL_SYSTEMS: SkillSystem[] = [
    {
        key: 'menler',
        title: 'Menler LMS',
        short: 'Menler',
        abbr: 'ML',
        href: '#my-experience',
        // The résumé names pdf.js, Google Drive automation and WebP, not the app framework.
        note: 'Full stack not public',
    },
    {
        key: 'student-hub',
        title: 'Smart Student Hub',
        short: 'Student Hub',
        abbr: 'SH',
        href: '/projects/smart-student-hub',
    },
    {
        key: 'voltworx',
        title: 'Voltworx',
        short: 'Voltworx',
        abbr: 'VW',
        href: '/projects/voltworx',
    },
    {
        key: 'mlritm',
        title: 'MLRITM website',
        short: 'MLRITM',
        abbr: 'MR',
        href: '/projects/mlritm-website',
    },
    {
        key: 'perception',
        title: 'On-Device Perception Agent',
        short: 'Agent',
        abbr: 'PA',
        href: '/projects/perception-agent',
    },
];

export type SkillUsage = Partial<Record<SystemKey, string>>;

const ALL: SkillUsage = {
    menler: 'Version control on the LMS',
    'student-hub': 'Repo and deploys',
    voltworx: 'Repo and deploys',
    mlritm: 'Shared repo with the team',
    perception: 'Open-source repo',
};

/** Technology name (as in MY_STACK) -> system -> what it was used for. */
export const SKILL_USAGE: Record<string, SkillUsage> = {
    JavaScript: {
        menler: 'Integrated PDF reader built on pdf.js',
    },
    TypeScript: {
        perception: 'MV3 extension, perception pipeline and shared contracts',
    },
    Python: {
        perception: 'FastAPI server, model training and quantization',
    },
    React: {
        'student-hub': 'Dashboard UI components',
        voltworx: 'Responsive UI',
    },
    'Next.js': {
        'student-hub': 'Frontend, hosted on Vercel',
        mlritm: 'Site with Payload CMS',
    },
    'Tailwind CSS': {
        mlritm: 'Site styling',
    },
    'Node.js': {
        'student-hub': 'Backend on Azure App Service',
        voltworx: 'Platform APIs',
    },
    'Express.js': {
        'student-hub': 'API with JWT auth and RBAC',
        voltworx: 'REST APIs',
    },
    'RESTful APIs': {
        'student-hub': 'REST API behind the dashboards',
        voltworx: 'APIs for students and startups',
    },
    MongoDB: {
        voltworx: 'Document store for the MERN stack',
    },
    PostgreSQL: {
        'student-hub': 'Azure Database for PostgreSQL',
    },
    'Microsoft Azure': {
        'student-hub': 'App Service, Blob Storage, Managed Identity, RBAC, CORS',
    },
    Vercel: {
        'student-hub': 'Frontend hosting',
        mlritm: 'Live deployment',
    },
    Git: ALL,
    GitHub: ALL,
};

/** Row note for technologies the résumé does not tie to any of the listed systems. */
export const NO_USAGE_NOTE = 'learning / coursework';

export const getUsage = (tech: string): SkillUsage => SKILL_USAGE[tech] ?? {};

export const countUsage = (tech: string): number =>
    SKILL_SYSTEMS.filter((s) => Boolean(getUsage(tech)[s.key])).length;
