import { GENERAL_INFO, SOCIAL_LINKS } from '@/lib/data';
import { Facebook, Github, Linkedin, Link as LinkIcon, Mail, FileDown } from 'lucide-react';
import Button from '@/components/Button';

const Footer = async () => {

    // Ensure GitHub and LinkedIn always show (fallback to '#')
    const findUrl = (key: string) =>
        SOCIAL_LINKS.find((l) => l.name.toLowerCase() === key)?.url || '#';

    const socialLinks = [
        { name: 'GitHub', url: findUrl('github') },
        { name: 'LinkedIn', url: findUrl('linkedin') },
    ];

    const iconFor = (name: string) => {
        const n = name.toLowerCase();
        if (n.includes('github')) return Github;
        if (n.includes('linkedin')) return Linkedin;
        if (n.includes('facebook')) return Facebook;
        if (n.includes('mail')) return Mail;
        return LinkIcon;
    };

    return (
        <footer className="text-center pb-10 pt-12 border-t border-border/40 bg-gradient-to-b from-background-light/30 to-transparent" id="contact">
            <div className="container">
                <p className="text-lg text-muted-foreground">Have a project in mind?</p>
                <a
                    href={`mailto:${GENERAL_INFO.email}`}
                    className="text-3xl sm:text-4xl font-anton inline-block mt-3 hover:underline"
                >
                    {GENERAL_INFO.email}
                </a>

                <ul className="flex items-center justify-center gap-5 mt-8">
                    {socialLinks.map((link) => {
                        const Icon = iconFor(link.name);
                        return (
                            <li key={link.name}>
                                <a
                                    href={link.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="group relative inline-flex size-12 items-center justify-center rounded-full border border-border/60 bg-background-light/50 overflow-hidden transition-all duration-300 hover:border-primary/60 hover:text-primary hover:scale-105"
                                    aria-label={link.name}
                                >
                                    <span className="absolute inset-0 rounded-full bg-gradient-to-tr from-primary/20 to-secondary/20 opacity-0 blur-md transition-opacity duration-300 group-hover:opacity-100" />
                                    <Icon size={18} className="relative transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-0.5" />
                                    <span className="pointer-events-none absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs text-muted-foreground opacity-0 translate-y-1 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
                                        {link.name}
                                    </span>
                                </a>
                            </li>
                        );
                    })}
                </ul>

                <div className="mt-8">
                    <Button
                        as="link"
                        href="/mithreshhh resume.pdf"
                        target="_blank"
                        download
                        variant="secondary"
                        className="px-8 py-0 h-12 rounded-md shadow-[0_8px_0_theme(colors.border)] hover:translate-y-[1px] hover:shadow-[0_6px_0_theme(colors.border)] active:translate-y-[2px] active:shadow-[0_4px_0_theme(colors.border)]"
                    >
                        <FileDown size={18} />
                        Download Resume
                    </Button>
                </div>

                <div className="mt-10 h-px w-full bg-border/40" />

                <div className="pt-5 text-sm text-muted-foreground flex items-center justify-center gap-2 flex-wrap">
                    <span>© {new Date().getFullYear()} Mithresh</span>
                    <span>•</span>
                    <span>Made with Next.js & Tailwind CSS</span>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
