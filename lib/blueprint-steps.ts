// Guided walkthroughs over the BLUEPRINTS diagrams. Every step cites node ids
// from its blueprint and every sentence maps to a line in lib/data.ts or the
// résumé; keep it that way when adding steps.

export interface BlueprintStep {
    title: string;
    body: string;
    /** Node ids (from the matching Blueprint) to emphasise for this step. */
    nodes: string[];
}

export const BLUEPRINT_STEPS: Record<string, BlueprintStep[]> = {
    menler: [
        {
            title: 'Who uses it',
            body: 'Around 30 students and staff use the LMS day to day, so every module below is production code, not a demo.',
            nodes: ['users'],
        },
        {
            title: 'The web app',
            body: 'Converting image assets from PNG to WebP took the page speed score from 48 to 91 and reduced load times across the platform.',
            nodes: ['app'],
        },
        {
            title: 'Backend and modules',
            body: 'Three core modules sit behind the LMS backend: an integrated pdf.js reader, Google Drive automation for content workflows, and phase 2 of the assessment scoring system.',
            nodes: ['api', 'pdf', 'drive', 'score'],
        },
        {
            title: 'Webhook audit',
            body: 'A security audit found an exploitable webhook. Secrets were rotated and the hardcoded fallbacks removed.',
            nodes: ['hooks', 'api'],
        },
    ],
    'student-hub': [
        {
            title: 'Students and faculty',
            body: 'Each role gets its own dashboard, and submissions move through approval workflows rather than landing unchecked.',
            nodes: ['who'],
        },
        {
            title: 'Next.js on Vercel',
            body: 'The frontend is a Next.js app deployed on Vercel, separate from the Azure backend it talks to over a CORS-configured API.',
            nodes: ['web'],
        },
        {
            title: 'Express API on Azure',
            body: 'An Express API on Azure App Service handles JWT authentication and role-based access control, so every request is checked before it reaches data.',
            nodes: ['api'],
        },
        {
            title: 'PostgreSQL and Blob Storage',
            body: 'Records live in Azure Database for PostgreSQL and files in Blob Storage, accessed through Managed Identity and RBAC.',
            nodes: ['db', 'blob'],
        },
        {
            title: 'Shareable portfolios',
            body: 'Every student gets a shareable portfolio: a verified, public link that presents their work outside the platform.',
            nodes: ['share', 'web'],
        },
    ],
    voltworx: [
        {
            title: 'Two kinds of users',
            body: 'Startups post real micro-projects and students pick them up. The platform exists to connect the two.',
            nodes: ['students', 'startups'],
        },
        {
            title: 'React UI',
            body: 'A responsive React front end serves both sides of the marketplace from one interface.',
            nodes: ['ui'],
        },
        {
            title: 'Node and Express APIs',
            body: 'REST APIs on Node and Express sit between the UI and the data, built end to end as part of the MERN stack.',
            nodes: ['api'],
        },
        {
            title: 'MongoDB',
            body: 'MongoDB stores the platform data as documents, completing the stack. Deployment was optimised as part of the CTO role.',
            nodes: ['db'],
        },
    ],
    iic: [
        {
            title: 'Attendees',
            body: 'College event attendees are the users: they pay and receive a pass through the site.',
            nodes: ['attendee'],
        },
        {
            title: 'IIC website',
            body: 'The official Institution Innovation Council website, built in React with a responsive UI and led as Technical Lead.',
            nodes: ['site'],
        },
        {
            title: 'Payments to passes',
            body: 'A payment gateway was integrated into the event-pass system, which issued around 150 passes.',
            nodes: ['pay', 'pass'],
        },
        {
            title: 'Email campaigns',
            body: 'Email campaign web pages were built alongside the site for IIC events, with on-ground support during the events themselves.',
            nodes: ['mail', 'site'],
        },
    ],
};

/** Case-study slug -> BLUEPRINTS key. Projects missing here have no stepper. */
export const PROJECT_BLUEPRINT: Record<string, string> = {
    'smart-student-hub': 'student-hub',
    voltworx: 'voltworx',
};
