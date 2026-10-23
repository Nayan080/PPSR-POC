"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useGetSearch } from "@/api/generated/endpoints/searches/searches";
import { ErrorSummary } from "@/components/error-summary";
import { PageHeader } from "@/components/page-header";
import { SearchCertificate } from "@/components/search-certificate";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function SearchResultScreen() {
  const { id } = useParams<{ id: string }>();
  const { data, error, isPending } = useGetSearch(id);

  return (
    <>
      <PageHeader
        title="Search result"
        description={data?.criteriaSummary}
        crumbs={[{ label: "Search history", href: "/search/history" }, { label: data?.reference ?? "…" }]}
        actions={
          <Button asChild>
            <Link href="/search">New search</Link>
          </Button>
        }
      />
      <ErrorSummary error={error} />
      {isPending && <Skeleton className="h-96" />}
      {data && <SearchCertificate search={data} />}
    </>
  );
}
