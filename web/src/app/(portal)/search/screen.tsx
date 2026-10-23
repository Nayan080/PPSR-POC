"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ErrorSummary } from "@/components/error-summary";
import { PageHeader } from "@/components/page-header";
import { GrantorSearchForm, RegistrationNumberForm, SerialSearchForm, useRunSearch } from "@/components/search-forms";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const TABS = ["serial", "grantor", "registration"] as const;
type Tab = (typeof TABS)[number];

export default function SearchScreen() {
  const params = useSearchParams();
  const router = useRouter();
  const tab: Tab = TABS.includes(params.get("tab") as Tab) ? (params.get("tab") as Tab) : "serial";
  const { serial, grantor, registration } = useRunSearch();
  const active = { serial, grantor, registration }[tab];

  return (
    <>
      <PageHeader
        title="New search"
        description="Search the Personal Property Securities Register. Each search is charged and saved to your history."
      />
      <ErrorSummary error={active.error} title="The search could not be completed" />
      <Tabs value={tab} onValueChange={(v) => router.replace(`/search?tab=${v}`, { scroll: false })}>
        {/* Full-width, evenly split tabs with short labels on phones. */}
        <TabsList className="grid w-full grid-cols-3 group-data-horizontal/tabs:h-10 sm:inline-flex sm:w-fit sm:group-data-horizontal/tabs:h-9">
          <TabsTrigger value="serial">
            <span className="sm:hidden">Serial no.</span>
            <span className="hidden sm:inline">Serial number</span>
          </TabsTrigger>
          <TabsTrigger value="grantor">
            <span className="sm:hidden">Organisation</span>
            <span className="hidden sm:inline">Organisation grantor</span>
          </TabsTrigger>
          <TabsTrigger value="registration">
            <span className="sm:hidden">Reg. no.</span>
            <span className="hidden sm:inline">Registration number</span>
          </TabsTrigger>
        </TabsList>
        <div className="mt-4 rounded-md border bg-card p-4 sm:p-5">
          <TabsContent value="serial">
            <SerialSearchForm onSearch={(data) => serial.mutate({ data })} pending={serial.isPending} />
          </TabsContent>
          <TabsContent value="grantor">
            <GrantorSearchForm onSearch={(data) => grantor.mutate({ data })} pending={grantor.isPending} />
          </TabsContent>
          <TabsContent value="registration">
            <RegistrationNumberForm
              onSearch={(data) => registration.mutate({ data })}
              pending={registration.isPending}
            />
          </TabsContent>
        </div>
      </Tabs>
    </>
  );
}
