"use client";

import { useQueryClient } from "@tanstack/react-query";
import { ChevronDownIcon, LogOutIcon } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { type ReactNode, Suspense, useEffect } from "react";
import { useGetPpsrStatus } from "@/api/generated/endpoints/ppsr/ppsr";
import { Brand } from "@/components/brand";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { INDEPENDENCE_NOTICE } from "@/lib/brand";
import { cn } from "@/lib/utils";
import { useAuthHydrated, useAuthStore } from "@/stores/auth-store";

const NAV = [
  { href: "/dashboard", label: "Dashboard", exact: true },
  { href: "/search", label: "New search", exact: true },
  { href: "/search/history", label: "Search history" },
];

export function AppShell({ children }: { children: ReactNode }) {
  const { accessToken, account, signOut } = useAuthStore();
  const hydrated = useAuthHydrated();
  const router = useRouter();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (hydrated && !accessToken) router.replace("/login");
  }, [hydrated, accessToken, router]);

  const logOut = () => {
    signOut();
    queryClient.clear();
    router.replace("/login");
  };

  return (
    <div className="flex min-h-screen flex-col">
      <header className="no-print bg-brand text-brand-foreground">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Brand href="/dashboard" />
          {hydrated && account && (
            <DropdownMenu>
              <DropdownMenuTrigger
                aria-label="Account menu"
                className="flex min-h-10 items-center gap-2 rounded-md px-2 py-1.5 text-sm outline-none hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-white/40"
              >
                <span
                  className="flex size-8 items-center justify-center rounded-full bg-white/15 text-xs font-semibold sm:hidden"
                  aria-hidden="true"
                >
                  {account.givenName[0]}
                  {account.familyName[0]}
                </span>
                <span className="hidden text-right leading-tight sm:block">
                  <span className="block font-medium">
                    {account.givenName} {account.familyName}
                  </span>
                  <span className="block text-[11px] opacity-75">Customer {account.customerNumber}</span>
                </span>
                <ChevronDownIcon className="size-4 opacity-75" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-60">
                <DropdownMenuLabel className="font-normal">
                  <span className="block text-sm font-medium sm:hidden">
                    {account.givenName} {account.familyName}
                  </span>
                  <span className="block text-sm font-medium">{account.organisationName ?? "Individual account"}</span>
                  <span className="block text-xs text-muted-foreground">{account.email}</span>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={logOut}>
                  <LogOutIcon />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
        <nav aria-label="Main" className="bg-[color-mix(in_oklch,var(--brand),black_18%)]">
          {/* The current path is only known at request time, so the highlighted nav sits in its own boundary. */}
          <Suspense fallback={<NavLinks pathname={null} />}>
            <ActiveNavLinks />
          </Suspense>
        </nav>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6">
        {hydrated && accessToken ? children : <ShellLoading />}
      </main>

      <footer className="no-print border-t bg-card">
        <div className="mx-auto grid max-w-6xl gap-2 px-4 py-4 text-xs text-muted-foreground sm:px-6">
          <DataSourceStatus />
          <p className="max-w-3xl">{INDEPENDENCE_NOTICE}</p>
        </div>
      </footer>
    </div>
  );
}

/** Makes it obvious whether results come from the live register or the built-in test data. */
function DataSourceStatus() {
  const { data } = useGetPpsrStatus({ query: { staleTime: 60_000 } });
  if (!data) return null;
  const live = data.source === "B2G" && data.connected;
  return (
    <p className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
      <span
        className={cn(
          "size-2 shrink-0 rounded-full",
          live ? "bg-success" : data.connected ? "bg-warning" : "bg-destructive",
        )}
        aria-hidden="true"
      />
      <span className="font-medium text-foreground">
        {data.source === "MOCK" ? "Test data — not connected to the PPSR" : "PPSR B2G"}
      </span>
      <span className="basis-full pl-4 sm:basis-auto sm:pl-0">{data.detail}</span>
    </p>
  );
}

function ActiveNavLinks() {
  return <NavLinks pathname={usePathname()} />;
}

function NavLinks({ pathname }: { pathname: string | null }) {
  const isActive = (item: (typeof NAV)[number]) =>
    pathname !== null &&
    (item.exact ? pathname === item.href : pathname === item.href || pathname.startsWith(`${item.href}/`));

  return (
    <ul className="mx-auto flex max-w-6xl overflow-x-auto px-2 sm:gap-1 sm:px-6">
      {NAV.map((item) => (
        <li key={item.href}>
          <Link
            href={item.href}
            aria-current={isActive(item) ? "page" : undefined}
            className={cn(
              "block border-b-2 border-transparent px-2.5 py-2.5 text-sm sm:px-3 whitespace-nowrap text-brand-foreground/80 transition-colors hover:text-brand-foreground",
              isActive(item) && "border-white font-medium text-brand-foreground",
            )}
          >
            {item.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}

function ShellLoading() {
  return (
    <div className="space-y-4" aria-busy="true">
      <div className="h-8 w-64 animate-pulse rounded bg-muted" />
      <div className="h-40 animate-pulse rounded-md bg-muted" />
    </div>
  );
}
