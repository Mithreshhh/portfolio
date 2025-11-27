import { ReactNode } from 'react';
import { SectionFlower } from './icons';
import { cn } from '@/lib/utils';

interface Props {
    icon?: ReactNode;
    className?: string;
    classNames?: {
        container?: string;
        title?: string;
        icon?: string;
    };
    title: string;
}

const SectionTitle = ({ icon, title, className, classNames }: Props) => {
    return (
        <div
            className={cn(
                'flex items-center gap-4 mb-14 relative',
                className,
                classNames?.container,
            )}
        >
            {icon ? (
                icon
            ) : (
                <SectionFlower
                    width={25}
                    className={cn(
                        'animate-spin duration-7000 text-primary',
                        classNames?.icon,
                    )}
                />
            )}
            <h2
                className={cn(
                    'text-xl uppercase leading-none hover:text-primary smooth-transition',
                    classNames?.title,
                )}
            >
                {title}
            </h2>
            <div className="flex-1 h-px bg-gradient-to-r from-border/50 to-transparent ml-4"></div>
        </div>
    );
};

export default SectionTitle;
