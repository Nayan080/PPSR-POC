import {
  AlertTriangleIcon,
  BadgeCheckIcon,
  BuildingIcon,
  CarIcon,
  CheckIcon,
  FileSearchIcon,
  HandshakeIcon,
  HistoryIcon,
  KeyboardIcon,
  ShieldCheckIcon,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Brand } from "@/components/brand";
import { SiteHeader } from "@/components/landing/site-header";
import { Button } from "@/components/ui/button";
import { APP_NAME, APP_TAGLINE, INDEPENDENCE_NOTICE, PRICING, LANDING_SECTIONS as SECTIONS } from "@/lib/brand";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: { absolute: `${APP_NAME} — ${APP_TAGLINE}` },
  description:
    "Check a vehicle or business asset before you buy or lend: security interests on the PPSR, plus written-off and stolen checks for every VIN.",
};

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <Hero />
        <HowItWorks />
        <About />
        <Pricing />
        <ClosingCta />
      </main>
      <SiteFooter />
    </div>
  );
}

/* ---------------------------------------------------------------- Home */

function Hero() {
  return (
    <section id="home" className="scroll-mt-16 border-b bg-card">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 md:py-20">
        <div>
          <p className="text-sm font-medium text-primary">PPSR searches for buyers, dealers and lenders</p>
          <h1 className="mt-3 text-3xl leading-tight font-semibold tracking-tight text-balance sm:text-4xl lg:text-[2.75rem]">
            Know what&apos;s owed before you buy, lend or trade.
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Search the Personal Property Securities Register in seconds. Every VIN search also shows the vehicle&apos;s
            details and whether it has been written off or reported stolen.
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" className="h-11 px-5 text-[15px]">
              <Link href="/create-account">Start searching</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-11 px-5 text-[15px]">
              <a href="#how-it-works">See how it works</a>
            </Button>
          </div>
          <ul className="mt-8 grid gap-2 text-sm text-muted-foreground sm:grid-cols-3">
            {["Results in seconds", "From $4.00 per search", "No subscription needed"].map((t) => (
              <li key={t} className="flex items-center gap-2">
                <CheckIcon className="size-4 shrink-0 text-success" />
                {t}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- How it works */

function HowItWorks() {
  const steps = [
    {
      icon: KeyboardIcon,
      title: "Enter what you're checking",
      text: "A VIN or other serial number for a vehicle, boat or aircraft — or a company's ACN or ABN.",
    },
    {
      icon: FileSearchIcon,
      title: "We search the PPSR",
      text: "Your search runs against the Personal Property Securities Register, with vehicle data for every VIN.",
    },
    {
      icon: BadgeCheckIcon,
      title: "Get a clear answer",
      text: "See any security interests, who holds them and how to contact them, plus written-off and stolen status.",
    },
  ];

  return (
    <section id="how-it-works" className="scroll-mt-16 border-b">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 md:py-20">
        <SectionHeading eyebrow="How it works" title="Three steps, about a minute.">
          No forms to post and no waiting. Every result is saved to your history with its PPSR search number.
        </SectionHeading>
        <ol className="mt-10 grid gap-4 md:grid-cols-3 md:gap-6">
          {steps.map((s, i) => (
            <li key={s.title} className="rounded-md border bg-card p-5">
              <div className="flex items-center gap-3">
                <span className="flex size-8 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground tabular">
                  {i + 1}
                </span>
                <s.icon className="size-5 text-primary" aria-hidden="true" />
              </div>
              <h3 className="mt-4 font-semibold">{s.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{s.text}</p>
            </li>
          ))}
        </ol>

        <div className="mt-10 grid gap-x-8 gap-y-4 rounded-md border bg-card p-5 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              icon: ShieldCheckIcon,
              title: "Security interests",
              text: "Loans and finance registered against the asset.",
            },
            { icon: AlertTriangleIcon, title: "Written-off check", text: "State notifications, with damage details." },
            { icon: CarIcon, title: "Vehicle details", text: "Make, model, year, colour, engine and registration." },
            { icon: HistoryIcon, title: "Search history", text: "Reopen and reprint any past result at no charge." },
          ].map((f) => (
            <div key={f.title} className="flex gap-3">
              <f.icon className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden="true" />
              <div>
                <p className="text-sm font-semibold">{f.title}</p>
                <p className="text-sm text-muted-foreground">{f.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- About */

function About() {
  const audiences = [
    {
      icon: CarIcon,
      title: "Private buyers",
      text: "Buying a used car from a private seller? If there's finance owing, the lender may be able to repossess it — even after you've paid.",
    },
    {
      icon: HandshakeIcon,
      title: "Dealers",
      text: "Check every trade-in before it hits the lot. Tag each search with your stock number and keep the record.",
    },
    {
      icon: BuildingIcon,
      title: "Lenders and brokers",
      text: "See what's already registered against a company's assets before you lend, by ACN or ABN.",
    },
  ];

  return (
    <section id="about" className="scroll-mt-16 border-b bg-card">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:py-20 lg:grid-cols-[1fr_1.4fr]">
        <div>
          <SectionHeading eyebrow="About" title="Built for anyone who needs to check before they commit.">
            {APP_NAME} gives you fast, plain-English access to the Personal Property Securities Register — the national
            register of security interests over cars, equipment, stock and business assets.
          </SectionHeading>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            The PPSR is not a register of ownership. A clear result means no security interest is registered at the time
            of search — so always confirm the seller&apos;s identity and right to sell, too.
          </p>
          <p className="mt-4 rounded-md border bg-background p-3 text-xs leading-relaxed text-muted-foreground">
            {INDEPENDENCE_NOTICE}
          </p>
        </div>
        <ul className="grid gap-4">
          {audiences.map((a) => (
            <li key={a.title} className="flex gap-4 rounded-md border bg-background p-5">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-md bg-accent text-primary">
                <a.icon className="size-5" aria-hidden="true" />
              </span>
              <div>
                <h3 className="font-semibold">{a.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{a.text}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- Pricing */

function Pricing() {
  return (
    <section id="pricing" className="scroll-mt-16 border-b">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 md:py-20">
        <SectionHeading eyebrow="Pricing" title="Pay per search. No lock-in." center>
          Prices include GST and the government search fee. Reopening a past result is always free.
        </SectionHeading>
        <ul className="mt-10 grid gap-4 md:grid-cols-3 md:gap-6">
          {PRICING.map((tier) => (
            <li
              key={tier.name}
              className={cn(
                "relative flex flex-col rounded-md border bg-card p-6",
                tier.featured && "border-primary ring-1 ring-primary",
              )}
            >
              {tier.featured && (
                <span className="absolute -top-3 left-6 rounded-sm bg-primary px-2 py-0.5 text-xs font-medium text-primary-foreground">
                  Most popular
                </span>
              )}
              <h3 className="font-semibold">{tier.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{tier.description}</p>
              <p className="mt-5 flex items-baseline gap-1.5">
                <span className="text-3xl font-semibold tracking-tight tabular">{tier.price}</span>
                <span className="text-sm text-muted-foreground">{tier.unit}</span>
              </p>
              <ul className="mt-5 mb-6 grid gap-2 text-sm">
                {tier.features.map((f) => (
                  <li key={f} className="flex gap-2">
                    <CheckIcon className="mt-0.5 size-4 shrink-0 text-success" aria-hidden="true" />
                    {f}
                  </li>
                ))}
              </ul>
              <Button asChild size="lg" variant={tier.featured ? "default" : "outline"} className="mt-auto w-full">
                <Link href="/create-account">{tier.cta}</Link>
              </Button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function ClosingCta() {
  return (
    <section className="bg-brand text-brand-foreground">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-4 py-12 sm:px-6 md:flex-row md:items-center">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Run your first search in under a minute.</h2>
          <p className="mt-1 text-brand-foreground/80">Create a free account — you only pay when you search.</p>
        </div>
        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
          <Button asChild size="lg" className="h-11 bg-white px-5 text-brand hover:bg-white/90">
            <Link href="/create-account">Sign up free</Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="h-11 border-white/40 bg-transparent px-5 text-brand-foreground hover:bg-white/10 hover:text-brand-foreground"
          >
            <Link href="/login">Log in</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- Shared */

function SectionHeading({
  eyebrow,
  title,
  children,
  center,
}: {
  eyebrow: string;
  title: string;
  children: React.ReactNode;
  center?: boolean;
}) {
  return (
    <div className={cn("max-w-2xl", center && "mx-auto text-center")}>
      <p className="text-sm font-medium text-primary">{eyebrow}</p>
      <h2 className="mt-2 text-2xl font-semibold tracking-tight text-balance sm:text-3xl">{title}</h2>
      <p className="mt-3 leading-relaxed text-muted-foreground">{children}</p>
    </div>
  );
}

function SiteFooter() {
  return (
    <footer className="bg-[color-mix(in_oklch,var(--brand),black_25%)] text-brand-foreground">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-[1.5fr_1fr_1fr]">
        <div>
          <Brand href="/" />
          <p className="mt-4 max-w-md text-xs leading-relaxed text-brand-foreground/70">{INDEPENDENCE_NOTICE}</p>
        </div>
        <nav aria-label="Footer sections" className="grid content-start gap-2 text-sm">
          <p className="font-semibold">Product</p>
          {SECTIONS.map((s) => (
            <a key={s.href} href={s.href} className="text-brand-foreground/75 hover:text-brand-foreground">
              {s.label}
            </a>
          ))}
        </nav>
        <nav aria-label="Account" className="grid content-start gap-2 text-sm">
          <p className="font-semibold">Account</p>
          <Link href="/login" className="text-brand-foreground/75 hover:text-brand-foreground">
            Log in
          </Link>
          <Link href="/create-account" className="text-brand-foreground/75 hover:text-brand-foreground">
            Sign up
          </Link>
        </nav>
      </div>
      <p className="border-t border-white/10 px-4 py-4 text-center text-xs text-brand-foreground/60">
        © {APP_NAME}. Search results are obtained from the Personal Property Securities Register.
      </p>
    </footer>
  );
}
