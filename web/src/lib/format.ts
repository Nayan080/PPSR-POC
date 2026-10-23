import { format, parseISO } from "date-fns";
import type {
  CollateralClass,
  CollateralType,
  OrganisationIdentifierType,
  PartyDto,
  SearchType,
  SerialNumberType,
} from "@/api/generated/model";

export const collateralTypeLabel: Record<CollateralType, string> = {
  CONSUMER: "Consumer property",
  COMMERCIAL: "Commercial property",
};

export const searchTypeLabel: Record<SearchType, string> = {
  SERIAL_NUMBER: "Serial number",
  ORGANISATION_GRANTOR: "Organisation grantor",
  REGISTRATION_NUMBER: "Registration number",
};

export const identifierTypes: OrganisationIdentifierType[] = ["ACN", "ABN", "ARBN", "ARSN"];

/** Labels are served by the API; these are fallbacks while reference data loads. */
export const collateralClassFallback: Record<CollateralClass, string> = {
  MOTOR_VEHICLE: "Motor vehicle",
  WATERCRAFT: "Watercraft",
  AIRCRAFT: "Aircraft",
  AGRICULTURE: "Agriculture",
  OTHER_GOODS: "Other goods",
  ALL_PAP: "All present and after-acquired property – no exceptions",
  ALL_PAP_EXCEPT: "All present and after-acquired property – with exceptions",
  ACCOUNT: "Account",
  INVESTMENT_INSTRUMENT: "Investment instrument",
  INTELLECTUAL_PROPERTY: "Intellectual property",
};

export const serialTypeFallback: Record<SerialNumberType, string> = {
  VIN: "VIN",
  CHASSIS_NUMBER: "Chassis number",
  MANUFACTURERS_NUMBER: "Manufacturer's number",
  HIN: "HIN",
  OFFICIAL_NUMBER: "Official number",
  AIRCRAFT_SERIAL: "Aircraft serial number",
};

export function formatDate(value?: string | null) {
  return value ? format(parseISO(value), "d MMM yyyy") : "—";
}

export function formatDateTime(value?: string | null) {
  return value ? format(parseISO(value), "d MMM yyyy, h:mm a") : "—";
}

const money = new Intl.NumberFormat("en-AU", { style: "currency", currency: "AUD" });
export function formatMoney(cents: number) {
  return money.format(cents / 100);
}

export function partyName(
  party?: Pick<PartyDto, "partyType" | "organisationName" | "givenNames" | "familyName"> | null,
) {
  if (!party) return "—";
  return party.partyType === "ORGANISATION"
    ? (party.organisationName ?? "—")
    : [party.givenNames, party.familyName].filter(Boolean).join(" ");
}

export function partyIdentifier(party?: Pick<PartyDto, "identifierType" | "identifierNumber"> | null) {
  if (!party?.identifierNumber) return null;
  return `${party.identifierType} ${groupDigits(party.identifierNumber)}`;
}

/** ABN: 11 222 333 444 · ACN: 123 456 789 */
export function groupDigits(value: string) {
  return value.length === 11
    ? `${value.slice(0, 2)} ${value.slice(2, 5)} ${value.slice(5, 8)} ${value.slice(8)}`
    : value.replace(/(\d{3})(?=\d)/g, "$1 ");
}
