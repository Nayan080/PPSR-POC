"use client";

import { MenuIcon } from "lucide-react";
import Link from "next/link";
import { useRef, useState } from "react";
import { Brand } from "@/components/brand";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { APP_NAME, LANDING_SECTIONS as SECTIONS } from "@/lib/brand";
import { useAuthHydrated, useAuthStore } from "@/stores/auth-store";

/** Sticky landing header: section links, and log in / sign up (or dashboard when already signed in). */
export function SiteHeader() {
  const [open, setOpen] = useState(false);
  // The sheet locks page scroll while open, so a tapped section is scrolled to once it has closed.
  const pendingSection = useRef<string | null>(null);
  const hydrated = useAuthHydrated();
  const signedIn = useAuthStore((s) => Boolean(s.accessToken));
  const showDashboard = hydrated && signedIn;

  const authButtons = (stacked: boolean) =>
    showDashboard ? (
      <Button asChild size={stacked ? "lg" : "default"} className={stacked ? "w-full" : undefined}>
        <Link href="/dashboard">Go to dashboard</Link>
      </Button>
    ) : (
      <>
        <Button
          asChild
          variant={stacked ? "outline" : "ghost"}
          size={stacked ? "lg" : "default"}
          className={stacked ? "w-full" : "text-brand-foreground hover:bg-white/10 hover:text-brand-foreground"}
        >
          <Link href="/login">Log in</Link>
        </Button>
        <Button
          asChild
          size={stacked ? "lg" : "default"}
          className={stacked ? "w-full" : "bg-white text-brand hover:bg-white/90"}
        >
          <Link href="/create-account">Sign up</Link>
        </Button>
      </>
    );

  return (
    <header className="sticky top-0 z-40 bg-brand text-brand-foreground shadow-sm">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Brand href="/" />

        <nav aria-label="Sections" className="hidden items-center gap-1 md:flex">
          {SECTIONS.map((s) => (
            <a
              key={s.href}
              href={s.href}
              className="rounded-md px-3 py-2 text-sm text-brand-foreground/80 hover:bg-white/10 hover:text-brand-foreground"
            >
              {s.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">{authButtons(false)}</div>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon-lg"
              className="text-brand-foreground hover:bg-white/10 hover:text-brand-foreground md:hidden"
              aria-label="Open menu"
            >
              <MenuIcon className="size-5" />
            </Button>
          </SheetTrigger>
          <SheetContent
            side="right"
            className="w-[min(20rem,85vw)]"
            onCloseAutoFocus={(e) => {
              const target = pendingSection.current;
              if (!target) return;
              e.preventDefault();
              pendingSection.current = null;
              document.querySelector(target)?.scrollIntoView();
              history.replaceState(null, "", target);
            }}
          >
            <SheetHeader>
              <SheetTitle>{APP_NAME}</SheetTitle>
              <SheetDescription className="sr-only">Site navigation</SheetDescription>
            </SheetHeader>
            <nav aria-label="Sections" className="grid px-4">
              {SECTIONS.map((s) => (
                <a
                  key={s.href}
                  href={s.href}
                  onClick={(e) => {
                    e.preventDefault();
                    pendingSection.current = s.href;
                    setOpen(false);
                  }}
                  className="border-b py-3 text-base font-medium last:border-b-0"
                >
                  {s.label}
                </a>
              ))}
            </nav>
            <div className="mt-auto grid gap-2 p-4">{authButtons(true)}</div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
