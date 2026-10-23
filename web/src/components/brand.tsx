import Link from "next/link";
import { APP_NAME, APP_TAGLINE } from "@/lib/brand";

/** Product wordmark: a document with a magnifier. Deliberately not government-styled. */
export function Brand({ href = "/" }: { href?: string }) {
  return (
    <Link href={href} className="flex items-center gap-3 text-brand-foreground">
      <svg viewBox="0 0 32 32" aria-hidden="true" className="size-8 shrink-0">
        <rect x="4" y="3" width="18" height="24" rx="2.5" fill="currentColor" opacity="0.14" />
        <rect x="4" y="3" width="18" height="24" rx="2.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
        <path d="M8.5 9h9M8.5 13h6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        <circle cx="20" cy="19.5" r="5" fill="var(--brand)" stroke="currentColor" strokeWidth="2" />
        <path d="m23.6 23.1 4.2 4.2" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
      </svg>
      <span className="leading-tight">
        <span className="block text-[15px] font-semibold tracking-wide">{APP_NAME}</span>
        <span className="block text-[11px] opacity-75">{APP_TAGLINE}</span>
      </span>
    </Link>
  );
}
