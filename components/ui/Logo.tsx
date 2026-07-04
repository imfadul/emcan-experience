import Image from 'next/image';
import { Link } from '@/lib/i18n/navigation';

/**
 * Emcan Group logo, linking home. The source PNG is the colour-on-light lockup;
 * on the dark UI we render the brand-approved 100% reversed-out (white) version
 * via a brightness/invert filter. Replace with the official white vector when
 * supplied (see docs/ASSET-MANIFEST.md).
 */
export function Logo({
  className,
  label,
  priority = false,
}: {
  className?: string;
  label: string;
  priority?: boolean;
}) {
  return (
    <Link
      href="/"
      aria-label={label}
      className="inline-flex items-center rounded focus-visible:outline-offset-4"
    >
      <Image
        src="/brand/emcan-group.png"
        alt="Emcan Group"
        width={3697}
        height={2448}
        priority={priority}
        sizes="160px"
        className={`w-auto [filter:brightness(0)_invert(1)] ${className ?? 'h-10'}`}
      />
    </Link>
  );
}
