import { Brand } from "@/components/brand";
import { INDEPENDENCE_NOTICE } from "@/lib/brand";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="bg-brand">
        <div className="mx-auto flex h-16 max-w-6xl items-center px-4 sm:px-6">
          <Brand />
        </div>
      </header>
      <main className="mx-auto grid w-full max-w-6xl flex-1 gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_420px] lg:py-16">
        <section className="order-2 max-w-xl lg:order-1">
          <h2 className="text-lg font-semibold">Check before you buy, lend or trade</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Search the Personal Property Securities Register for security interests over vehicles, equipment and
            business assets, with vehicle history for every VIN search.
          </p>
          <ul className="mt-6 space-y-4 text-sm">
            {[
              ["Security interests", "See whether money is owed on a vehicle or asset, and who to contact."],
              [
                "Written-off and stolen checks",
                "Vehicle details and written-off or stolen notifications with every VIN.",
              ],
              ["Official certificate details", "Every result carries the PPSR search number for your records."],
              ["Search history", "Reopen and reprint any past search, tagged with your own reference."],
            ].map(([title, text]) => (
              <li key={title} className="border-l-2 border-primary/40 pl-3">
                <span className="font-medium">{title}</span>
                <span className="block text-muted-foreground">{text}</span>
              </li>
            ))}
          </ul>
        </section>
        <div className="order-1 lg:order-2">{children}</div>
      </main>
      <footer className="border-t bg-card">
        <p className="mx-auto max-w-6xl px-4 py-4 text-xs text-muted-foreground sm:px-6">{INDEPENDENCE_NOTICE}</p>
      </footer>
    </div>
  );
}
