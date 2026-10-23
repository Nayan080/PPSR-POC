"use client";

import { keepPreviousData } from "@tanstack/react-query";
import { SearchIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useListSearches } from "@/api/generated/endpoints/searches/searches";
import { PageHeader } from "@/components/page-header";
import { SearchTable } from "@/components/search-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatMoney } from "@/lib/format";

export default function SearchHistoryScreen() {
  const [term, setTerm] = useState("");
  const [q, setQ] = useState("");

  // Debounce so each keystroke doesn't hit the API.
  useEffect(() => {
    const t = setTimeout(() => setQ(term.trim()), 300);
    return () => clearTimeout(t);
  }, [term]);

  const { data, isPending } = useListSearches(q ? { q } : undefined, {
    query: { placeholderData: keepPreviousData },
  });
  const total = data?.reduce((sum, s) => sum + s.feeCents, 0) ?? 0;

  return (
    <>
      <PageHeader
        title="Search history"
        description="Your most recent 100 searches. Open one to view or reprint the result."
        actions={
          <Button asChild>
            <Link href="/search">New search</Link>
          </Button>
        }
      />
      <div className="rounded-md border bg-card">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b p-4">
          <div className="relative w-full max-w-md">
            <SearchIcon className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              aria-label="Filter searches"
              placeholder="VIN, ACN, your reference or search number"
              className="pl-8"
              value={term}
              onChange={(e) => setTerm(e.target.value)}
            />
          </div>
          {data && (
            <p className="text-sm text-muted-foreground tabular">
              {data.length} search{data.length === 1 ? "" : "es"} · {formatMoney(total)}
            </p>
          )}
        </div>
        <SearchTable
          searches={data}
          loading={isPending}
          empty={q ? "No searches match this filter." : "You haven't searched yet."}
        />
      </div>
    </>
  );
}
