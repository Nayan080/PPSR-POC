"use client";

import Link from "next/link";
import { useGetDashboardSummary } from "@/api/generated/endpoints/dashboard/dashboard";
import { PageHeader } from "@/components/page-header";
import { Panel } from "@/components/panel";
import { SearchTable } from "@/components/search-table";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { formatMoney } from "@/lib/format";
import { useAuthStore } from "@/stores/auth-store";

export default function DashboardScreen() {
  const account = useAuthStore((s) => s.account);
  const { data, isPending } = useGetDashboardSummary();

  const stats = [
    { label: "Searches this month", value: data?.searchesThisMonth },
    { label: "Spend this month", value: data && formatMoney(data.spendThisMonthCents) },
    { label: "With security interests (30 days)", value: data?.withInterests30Days },
    { label: "Written-off or stolen (30 days)", value: data?.vehicleAlerts30Days },
  ];

  return (
    <>
      <PageHeader
        title={`Welcome, ${account?.givenName ?? ""}`}
        description={account?.organisationName ?? undefined}
        actions={
          <Button variant="outline" asChild>
            <Link href="/search?tab=grantor">Search an organisation</Link>
          </Button>
        }
      />

      <dl className="grid grid-cols-2 divide-x divide-y rounded-md border bg-card lg:grid-cols-4 lg:divide-y-0">
        {stats.map((s) => (
          <div key={s.label} className="px-5 py-4">
            <dt className="text-xs text-muted-foreground">{s.label}</dt>
            <dd className="mt-1 text-2xl font-semibold tabular">
              {isPending ? <Skeleton className="h-7 w-12" /> : (s.value ?? 0)}
            </dd>
          </div>
        ))}
      </dl>

      <Panel
        className="mt-6"
        title="Recent searches"
        bodyClassName="p-0"
        actions={
          <Button variant="link" size="sm" className="h-auto p-0" asChild>
            <Link href="/search/history">All searches</Link>
          </Button>
        }
      >
        <SearchTable
          searches={data?.recentSearches}
          loading={isPending}
          showFee={false}
          empty="No searches yet. Start a new search."
        />
      </Panel>
    </>
  );
}
