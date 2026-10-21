import Link from 'next/link';
import React, { ButtonHTMLAttributes, ComponentProps, ReactNode } from 'react';
import { Variant } from '@/types';
import { cn } from '@/lib/utils';

const Child = ({ icon }: any) => (
    <span className="flex items-center justify-center gap-3">
        <svg
            className="animate-spin h-5 w-5 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
        >
            <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
            ></circle>
            <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
        </svg>
        {!icon && 'Processing...'}
    </span>
);

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

type Props = {
    as?: 'link' | 'button';
    loading?: boolean;
    icon?: boolean;
    children: ReactNode | ReactNode[];
    className?: string;
    variant?: Variant;
} & (ComponentProps<typeof Link> | ButtonProps);

const Button = ({
    loading,
    variant,
    className,
    children,
    as = 'link',
    icon = false,
    ...rest
}: Props) => {
    const variantClasses = {
        primary: `bg-primary text-primary-foreground`,
        secondary: `bg-secondary text-secondary-foreground`,
        success: `bg-foreground text-background hover:bg-foreground/85`,
        warning: `bg-secondary text-secondary-foreground hover:bg-secondary/85`,
        danger: `bg-destructive text-destructive-foreground hover:bg-destructive/70`,
        info: `bg-accent text-accent-foreground hover:bg-accent/85`,
        light: `bg-background-active text-foreground hover:bg-background-active`,
        dark: `bg-foreground text-background hover:bg-foreground/80`,
        link: `text-foreground hover:text-primary`,
        'no-color': '',
    }[variant || 'primary'];

    const iconClasses = cn(
        'min-w-9 aspect-square text-xl p-0 inline-flex items-center justify-center rounded-md',
        variantClasses,
    );

    const buttonClasses = cn(
        `group h-12 px-8 inline-flex justify-center items-center gap-2 text-lg uppercase font-anton tracking-widest relative overflow-hidden`,
        'transition-[transform,color,background-color,border-color] duration-150 ease-out active:scale-[0.97]',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-foreground',
        variantClasses,
        { [iconClasses]: icon },
        className,
    );

    // The hover fill is a curved wash that rises from below. Its colour has to contrast with
    // the resting surface, and on the outline style the label flips dark to stay readable.
    const fillColor =
        variant === 'no-color' ? 'bg-foreground' : variant === 'secondary' ? 'bg-white' : 'bg-neutral-300';
    const fill = variant !== 'link' && (
        <span
            aria-hidden="true"
            className={cn(
                // scale-150 grows the wash 25% past each edge, so it has to park well below the button.
                'absolute inset-x-0 top-0 h-full scale-150 rounded-[50%] translate-y-[140%] transition-transform duration-200 ease-out group-hover:translate-y-0 group-hover:duration-300',
                fillColor,
            )}
        />
    );
    const label = (
        <span
            className={cn(
                'relative z-[1] inline-flex items-center gap-2',
                variant === 'no-color' && 'transition-colors duration-200 group-hover:text-background',
            )}
        >
            {loading ? <Child icon={icon} /> : children}
        </span>
    );

    if (as === 'link') {
        const props = rest as ComponentProps<typeof Link>;

        if (props.target === '_blank') {
            return (
                <a
                    className={buttonClasses}
                    {...props}
                    href={props.href.toString() || '#'}
                >
                    {fill}
                    {label}
                </a>
            );
        }

        return (
            <Link className={buttonClasses} {...props} href={props.href || '#'}>
                {fill}
                {label}
            </Link>
        );
    } else if (as === 'button') {
        const props = rest as ButtonProps;

        return (
            <button className={buttonClasses} {...props}>
                {fill}
                {label}
            </button>
        );
    }
};

export default Button;
