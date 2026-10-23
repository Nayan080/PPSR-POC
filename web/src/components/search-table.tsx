"use client";

import { AlertTriangleIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { SearchDto } from "@/api/generated/model";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDateTime, formatMoney, searchTypeLabel } from "@/lib/format";
import { cn } from "@/lib/utils";

/** Search history rows, shared by the dashboard and the history page. */
export function SearchTable({
  searches,
  loading,
  empty,
  showFee = true,
}: {
  searches?: SearchDto[];
  loading: boolean;
  empty: string;
  showFee?: boolean;
}) {
  const router = useRouter();
  const columns = showFee ? 6 : 5;

  return (
    <>
      {/* Phones: one card per search, so nothing hides behind a horizontal scroll. */}
      <ul className="divide-y md:hidden">
        {loading &&
          [0, 1, 2].map((i) => (
            <li key={i} className="p-4">
              <Skeleton className="h-12" />
            </li>
          ))}
        {searches?.map((s) => (
          <li key={s.id}>
            <Link href={`/search/${s.id}`} className="block px-4 py-3 active:bg-muted/60">
              <span className="flex items-start justify-between gap-3">
                <span className="min-w-0">
                  <span className="block truncate font-mono text-[13px] text-primary">
                    {s.criteriaSummary.replace(/^.*?: /, "")}
                  </span>
                  <span className="block text-xs text-muted-foreground">
                    {searchTypeLabel[s.searchType]}
                    {s.clientReference && ` · ${s.clientReference}`}
                  </span>
                </span>
                {showFee && <span className="shrink-0 text-sm tabular">{formatMoney(s.feeCents)}</span>}
              </span>
              <span className="mt-2 flex flex-wrap items-center justify-between gap-2">
                <ResultBadge count={s.resultCount} alert={s.hasVehicleAlert} />
                <span className="text-xs text-muted-foreground">{formatDateTime(s.createdAt)}</span>
              </span>
            </Link>
          </li>
        ))}
        {searches?.length === 0 && <li className="px-4 py-10 text-center text-sm text-muted-foreground">{empty}</li>}
      </ul>

      <div className="hidden md:block">
        <SearchRowsTable
          searches={searches}
          loading={loading}
          empty={empty}
          showFee={showFee}
          columns={columns}
          onOpen={(id) => router.push(`/search/${id}`)}
        />
      </div>
    </>
  );
}

function SearchRowsTable({
  searches,
  loading,
  empty,
  showFee,
  columns,
  onOpen,
}: {
  searches?: SearchDto[];
  loading: boolean;
  empty: string;
  showFee: boolean;
  columns: number;
  onOpen: (id: string) => void;
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="pl-5">Searched</TableHead>
          <TableHead>Criteria</TableHead>
          <TableHead className="hidden md:table-cell">Your reference</TableHead>
          <TableHead>Result</TableHead>
          <TableHead className="hidden lg:table-cell">PPSR search number</TableHead>
          {showFee && <TableHead className="pr-5 text-right">Fee</TableHead>}
        </TableRow>
      </TableHeader>
      <TableBody>
        {loading &&
          [0, 1, 2].map((i) => (
            <TableRow key={i}>
              <TableCell colSpan={columns} className="px-5">
                <Skeleton className="h-5" />
              </TableCell>
            </TableRow>
          ))}
        {searches?.map((s) => (
          <TableRow key={s.id} className="cursor-pointer" onClick={() => onOpen(s.id)}>
            <TableCell className="pl-5 whitespace-nowrap text-muted-foreground">
              {formatDateTime(s.createdAt)}
            </TableCell>
            <TableCell className="max-w-72">
              <Link
                href={`/search/${s.id}`}
                onClick={(e) => e.stopPropagation()}
                className="block truncate font-mono text-[13px] text-primary hover:underline"
              >
                {s.criteriaSummary.replace(/^.*?: /, "")}
              </Link>
              <span className="block text-xs text-muted-foreground">{searchTypeLabel[s.searchType]}</span>
            </TableCell>
            <TableCell className="hidden max-w-48 truncate md:table-cell">{s.clientReference ?? "—"}</TableCell>
            <TableCell>
              <ResultBadge count={s.resultCount} alert={s.hasVehicleAlert} />
            </TableCell>
            <TableCell className="hidden font-mono text-[13px] lg:table-cell">{s.ppsrSearchNumber}</TableCell>
            {showFee && <TableCell className="pr-5 text-right tabular">{formatMoney(s.feeCents)}</TableCell>}
          </TableRow>
        ))}
        {searches?.length === 0 && (
          <TableRow>
            <TableCell colSpan={columns} className="px-5 py-10 text-center text-muted-foreground">
              {empty}
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}

function ResultBadge({ count, alert }: { count: number; alert: boolean }) {
  return (
    <span className="flex flex-wrap items-center gap-1.5">
      <span
        className={cn(
          "inline-flex rounded-sm border px-1.5 py-0.5 text-xs font-medium whitespace-nowrap",
          count
            ? "border-warning/40 bg-warning/15 text-[oklch(0.45_0.1_70)]"
            : "border-success/30 bg-success/10 text-success",
        )}
      >
        {count ? `${count} interest${count === 1 ? "" : "s"}` : "No interests"}
      </span>
      {alert && (
        <span className="inline-flex items-center gap-1 rounded-sm border border-destructive/30 bg-destructive/5 px-1.5 py-0.5 text-xs font-medium whitespace-nowrap text-destructive">
          <AlertTriangleIcon className="size-3" />
          Vehicle alert
        </span>
      )}
    </span>
  );
}
