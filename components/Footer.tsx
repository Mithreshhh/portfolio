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
                    className="mt-3 inline-block max-w-full break-all font-anton text-2xl hover:underline xs:text-3xl sm:text-4xl"
                >
                    {GENERAL_INFO.email}
                </a>

                <ul className="flex items-center justify-center gap-5 mt-6">
                    {socialLinks.map((link) => {
                        const Icon = iconFor(link.name);
                        return (
                            <li key={link.name}>
                                <a
                                    href={link.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="group relative inline-flex size-12 items-center justify-center overflow-hidden rounded-full border border-border/60 bg-background-light/50 transition-[border-color,color,transform] duration-200 ease-out hover:border-primary/60 hover:text-primary active:scale-[0.95]"
                                    aria-label={link.name}
                                >
                                    <span className="absolute inset-0 rounded-full bg-gradient-to-tr from-primary/20 to-secondary/20 opacity-0 blur-md transition-opacity duration-200 group-hover:opacity-100" />
                                    <Icon size={18} aria-hidden="true" className="relative transition-transform duration-200 ease-out group-hover:-translate-y-0.5" />
                                </a>
                            </li>
                        );
                    })}
                </ul>

                <div className="mt-6">
                    <Button
                        as="link"
                        href={GENERAL_INFO.resume}
                        target="_blank"
                        download
                        variant="no-color"
                        className="border border-foreground/40 px-8 text-foreground hover:border-foreground"
                    >
                        <FileDown size={18} aria-hidden="true" />
                        Download Resume
                    </Button>
                </div>

                <div className="mt-8 h-px w-full bg-border/40" />

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
