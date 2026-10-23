"use client";

import { AlertTriangleIcon, CheckCircle2Icon, PrinterIcon } from "lucide-react";
import type { RegistrationSummaryDto, SearchResultDto, VehicleDto } from "@/api/generated/model";
import { DetailList } from "@/components/panel";
import { Button } from "@/components/ui/button";
import { useReference } from "@/hooks/use-reference";
import {
  collateralTypeLabel,
  formatDate,
  formatDateTime,
  formatMoney,
  partyIdentifier,
  partyName,
  searchTypeLabel,
} from "@/lib/format";
import { cn } from "@/lib/utils";

/** A search outcome laid out for reading and printing: summary, vehicle history, then registrations. */
export function SearchCertificate({ search }: { search: SearchResultDto }) {
  const found = search.resultCount > 0;
  const vehicle = search.vehicle;

  return (
    <article className="grid gap-6">
      {search.source === "MOCK" && (
        <p className="rounded-md border border-dashed border-warning bg-warning/10 px-4 py-2 text-xs">
          <span className="font-semibold">Test data.</span> This result came from the built-in test register, not the
          PPSR. It is not a valid search certificate.
        </p>
      )}

      <section className="rounded-md border bg-card">
        <header className="flex flex-wrap items-start justify-between gap-4 border-b px-4 py-4 sm:px-5">
          <div>
            <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">PPSR search number</p>
            <h2 className="mt-1 font-mono text-lg font-medium">{search.ppsrSearchNumber}</h2>
          </div>
          <Button variant="outline" size="sm" className="no-print" onClick={() => window.print()}>
            <PrinterIcon />
            Print
          </Button>
        </header>
        <div className="px-4 py-4 sm:px-5">
          <DetailList
            columns={3}
            items={[
              ["Search type", searchTypeLabel[search.searchType]],
              [
                "Search criteria",
                <span key="c" className="font-mono text-[13px]">
                  {search.criteriaSummary}
                </span>,
              ],
              ["Searched", formatDateTime(search.searchedAt)],
              ["Your reference", search.clientReference ?? "—"],
              [
                "Order reference",
                <span key="r" className="font-mono text-[13px]">
                  {search.reference}
                </span>,
              ],
              ["Fee", `${formatMoney(search.feeCents)} incl. GST`],
            ]}
          />
        </div>
      </section>

      <div className="grid gap-3 sm:grid-cols-2">
        <Outcome
          tone={found ? "warn" : "ok"}
          title={
            found
              ? `${search.resultCount} security interest${search.resultCount === 1 ? "" : "s"} registered`
              : "No security interests registered"
          }
          text={
            found
              ? "Money may be owed. Contact the secured party before you buy or lend against this property."
              : "No current registrations match these search criteria at the time of search."
          }
        />
        {vehicle && <VehicleOutcome vehicle={vehicle} />}
      </div>

      {vehicle && <VehiclePanel vehicle={vehicle} />}

      {found && (
        <section className="rounded-md border bg-card">
          <h3 className="border-b px-4 py-3 text-sm font-semibold sm:px-5">Registrations</h3>
          <ol className="divide-y">
            {search.registrations.map((r, i) => (
              <RegistrationItem key={r.registrationNumber} index={i + 1} registration={r} />
            ))}
          </ol>
        </section>
      )}
    </article>
  );
}

function Outcome({ tone, title, text }: { tone: "ok" | "warn" | "bad"; title: string; text: string }) {
  const Icon = tone === "ok" ? CheckCircle2Icon : AlertTriangleIcon;
  return (
    <div
      className={cn(
        "flex gap-3 rounded-md border border-l-4 p-4 text-sm",
        tone === "ok" && "border-success/30 border-l-success bg-success/5",
        tone === "warn" && "border-warning/40 border-l-warning bg-warning/10",
        tone === "bad" && "border-destructive/30 border-l-destructive bg-destructive/5",
      )}
    >
      <Icon
        className={cn(
          "mt-0.5 size-4 shrink-0",
          tone === "ok" && "text-success",
          tone === "warn" && "text-[oklch(0.5_0.12_70)]",
          tone === "bad" && "text-destructive",
        )}
      />
      <div>
        <p className="font-semibold">{title}</p>
        <p className="text-muted-foreground">{text}</p>
      </div>
    </div>
  );
}

function VehicleOutcome({ vehicle }: { vehicle: VehicleDto }) {
  if (vehicle.stolen.length) {
    return (
      <Outcome tone="bad" title="Reported stolen" text="Do not proceed. Contact the police in the reporting state." />
    );
  }
  if (vehicle.writtenOff.length) {
    return (
      <Outcome
        tone="bad"
        title="Recorded as written off"
        text="The vehicle has a written-off notification. Check repair and re-registration history."
      />
    );
  }
  return <Outcome tone="ok" title="Not written off or stolen" text="No notifications recorded for this VIN." />;
}

function VehiclePanel({ vehicle: v }: { vehicle: VehicleDto }) {
  return (
    <section className="rounded-md border bg-card">
      <h3 className="border-b px-4 py-3 text-sm font-semibold sm:px-5">Vehicle details</h3>
      <div className="grid gap-5 px-4 py-4 sm:px-5">
        <DetailList
          columns={3}
          items={[
            ["Vehicle", [v.year, v.make, v.model].filter(Boolean).join(" ") || "—"],
            [
              "VIN",
              <span key="v" className="font-mono text-[13px]">
                {v.vin}
              </span>,
            ],
            ["Body / colour", [v.bodyType, v.colour].filter(Boolean).join(" · ") || "—"],
            ["Engine number", v.engineNumber ?? "—"],
            [
              "Registration",
              v.registrationPlate ? `${v.registrationPlate} (${v.registrationState})` : "Not registered",
            ],
            ["Registration expiry", formatDate(v.registrationExpiry)],
          ]}
        />
        {v.writtenOff.map((w) => (
          <div
            key={`${w.jurisdiction}-${w.incidentDate}`}
            className="rounded-md border border-destructive/30 p-3 text-sm"
          >
            <p className="font-medium text-destructive">
              {w.category} · {w.jurisdiction} · {formatDate(w.incidentDate)}
            </p>
            <p className="text-muted-foreground">Damage: {w.damage.join(", ")}</p>
          </div>
        ))}
        {v.stolen.map((s) => (
          <div
            key={`${s.jurisdiction}-${s.reportedDate}`}
            className="rounded-md border border-destructive/30 p-3 text-sm"
          >
            <p className="font-medium text-destructive">
              Stolen · {s.jurisdiction} · reported {formatDate(s.reportedDate)}
            </p>
            <p className="text-muted-foreground">{s.summary}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function RegistrationItem({ index, registration: r }: { index: number; registration: RegistrationSummaryDto }) {
  const { classLabel, serialLabel } = useReference();
  return (
    <li className="px-4 py-5 sm:px-5">
      <div className="mb-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <span className="text-xs text-muted-foreground tabular">{index}</span>
        <span className="font-mono text-sm font-medium">{r.registrationNumber}</span>
        {r.isPmsi && (
          <span className="rounded-sm border px-1.5 py-0.5 text-[11px] font-medium text-muted-foreground">PMSI</span>
        )}
      </div>
      <DetailList
        columns={3}
        items={[
          ["Collateral", `${classLabel(r.collateralClass)} · ${collateralTypeLabel[r.collateralType]}`],
          [
            "Serial number",
            r.serialNumber ? (
              <span key="s">
                <span className="font-mono text-[13px]">{r.serialNumber}</span>
                <span className="block text-xs text-muted-foreground">{serialLabel(r.serialNumberType)}</span>
              </span>
            ) : (
              "Not applicable"
            ),
          ],
          ["Description", r.collateralDescription ?? "—"],
          [
            "Grantor",
            r.grantor ? (
              <span key="g">
                {partyName(r.grantor)}
                {partyIdentifier(r.grantor) && (
                  <span className="block text-xs text-muted-foreground">{partyIdentifier(r.grantor)}</span>
                )}
              </span>
            ) : (
              "Not disclosed (consumer property)"
            ),
          ],
          [
            "Secured party",
            <span key="sp">
              {r.securedParties.join(", ")}
              <span className="block text-xs text-muted-foreground">{r.addressForService.postalAddress}</span>
              {r.addressForService.email && (
                <span className="block text-xs text-muted-foreground">{r.addressForService.email}</span>
              )}
            </span>,
          ],
          [
            "Registration period",
            <span key="p">
              {formatDate(r.startTime)}
              <span className="block text-xs text-muted-foreground">
                to {r.endTime ? formatDate(r.endTime) : "no stated end time"}
              </span>
            </span>,
          ],
        ]}
      />
    </li>
  );
}
