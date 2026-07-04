import { forwardRef } from 'react';
import { Link } from '@/lib/i18n/navigation';

type Variant = 'primary' | 'outline' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

const base =
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded font-semibold tracking-tight transition-colors duration-base ease-out-quart focus-visible:outline-offset-2 disabled:pointer-events-none disabled:opacity-50';

const variants: Record<Variant, string> = {
  // Gold fill, ink text — the primary industrial CTA
  primary: 'bg-accent text-ink hover:bg-beige',
  outline: 'border border-line/25 text-fg hover:border-accent/70 hover:text-accent',
  ghost: 'text-fg hover:text-accent',
};

const sizes: Record<Size, string> = {
  sm: 'h-9 px-4 text-sm',
  md: 'h-11 px-6 text-sm',
  lg: 'h-14 px-8 text-base',
};

interface CommonProps {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: React.ReactNode;
}

type ButtonAsButton = CommonProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof CommonProps> & {
    href?: undefined;
  };

type ButtonAsLink = CommonProps &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof CommonProps | 'href'> & {
    href: string;
  };

export type ButtonProps = ButtonAsButton | ButtonAsLink;

const cx = (...parts: Array<string | undefined>) => parts.filter(Boolean).join(' ');

/**
 * Bespoke button. Renders a locale-aware <Link> when `href` is given, otherwise a <button>.
 */
export const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  function Button({ variant = 'primary', size = 'md', className, children, ...rest }, ref) {
    const classes = cx(base, variants[variant], sizes[size], className);

    if ('href' in rest && rest.href !== undefined) {
      const { href, ...anchorRest } = rest as ButtonAsLink;
      return (
        <Link
          href={href}
          ref={ref as React.Ref<HTMLAnchorElement>}
          className={classes}
          {...anchorRest}
        >
          {children}
        </Link>
      );
    }

    const buttonRest = rest as ButtonAsButton;
    return (
      <button ref={ref as React.Ref<HTMLButtonElement>} className={classes} {...buttonRest}>
        {children}
      </button>
    );
  },
);
