'use client';
import { GENERAL_INFO, SOCIAL_LINKS } from '@/lib/data';
import SectionTitle from '@/components/SectionTitle';

const HireMePage = () => {
    const linkedin = SOCIAL_LINKS.find((l) => l.name.toLowerCase() === 'linkedin')?.url || '#';

    return (
        <section className="pt-16 pb-24">
            <div className="container">
                <SectionTitle title="Hire Me" />
                <div className="max-w-xl">
                    <p className="text-muted-foreground mb-6">Connect with me on:</p>
                    <ul className="space-y-4">
                        <li>
                            <a
                                href={linkedin}
                                target="_blank"
                                rel="noreferrer noopener"
                                className="inline-flex items-center gap-3 text-xl hover:text-primary"
                            >
                                <span className="inline-block size-3 rounded-full bg-primary" />
                                LinkedIn
                            </a>
                        </li>
                        <li>
                            <a
                                href={`mailto:${GENERAL_INFO.email}`}
                                className="inline-flex items-center gap-3 text-xl hover:text-primary"
                            >
                                <span className="inline-block size-3 rounded-full bg-secondary" />
                                {GENERAL_INFO.email}
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </section>
    );
};

export default HireMePage;


