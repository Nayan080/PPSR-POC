import Link from "next/link";
import type { ReactNode } from "react";

interface Crumb {
  label: string;
  href?: string;
}

export function PageHeader({
  title,
  description,
  crumbs,
  actions,
}: {
  title: ReactNode;
  description?: ReactNode;
  crumbs?: Crumb[];
  actions?: ReactNode;
}) {
  return (
    <div className="mb-6 border-b pb-5">
      {crumbs && (
        <nav aria-label="Breadcrumb" className="no-print mb-2 text-xs text-muted-foreground">
          {crumbs.map((c, i) => (
            <span key={c.label}>
              {i > 0 && <span className="mx-1.5">/</span>}
              {c.href ? (
                <Link href={c.href} className="hover:text-foreground hover:underline">
                  {c.label}
                </Link>
              ) : (
                <span className="text-foreground">{c.label}</span>
              )}
            </span>
          ))}
        </nav>
      )}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
          {description && <p className="mt-1 max-w-3xl text-sm text-muted-foreground">{description}</p>}
        </div>
        {actions && <div className="no-print flex flex-wrap items-center gap-2">{actions}</div>}
      </div>
    </div>
  );
}
