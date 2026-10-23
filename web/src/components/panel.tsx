import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** A bordered content section with an optional title bar, used instead of floating cards. */
export function Panel({
  title,
  description,
  actions,
  children,
  className,
  bodyClassName,
}: {
  title?: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
}) {
  return (
    <section className={cn("rounded-md border bg-card", className)}>
      {title && (
        <header className="flex items-start justify-between gap-4 border-b px-4 py-3 sm:px-5">
          <div>
            <h2 className="text-sm font-semibold">{title}</h2>
            {description && <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>}
          </div>
          {actions}
        </header>
      )}
      <div className={cn("p-4 sm:p-5", bodyClassName)}>{children}</div>
    </section>
  );
}

/** Label/value pairs laid out like a register extract. */
export function DetailList({ items, columns = 2 }: { items: [string, ReactNode][]; columns?: 1 | 2 | 3 }) {
  return (
    <dl
      className={cn(
        "grid gap-x-4 gap-y-4 text-sm sm:gap-x-8",
        // Two columns on all but the narrowest phones: short register values read better side by side.
        columns === 2 && "min-[360px]:grid-cols-2",
        columns === 3 && "min-[360px]:grid-cols-2 lg:grid-cols-3",
      )}
    >
      {items.map(([label, value]) => (
        <div key={label} className="min-w-0">
          <dt className="text-xs font-medium text-muted-foreground">{label}</dt>
          <dd className="mt-0.5 break-words">{value ?? "—"}</dd>
        </div>
      ))}
    </dl>
  );
}
