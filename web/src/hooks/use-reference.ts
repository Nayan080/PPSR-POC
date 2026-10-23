import { useGetReferenceData } from "@/api/generated/endpoints/reference/reference";
import type { CollateralClass, SerialNumberType } from "@/api/generated/model";
import { collateralClassFallback, serialTypeFallback } from "@/lib/format";

/** Collateral classes and serial number types, served by the API and cached for the session. */
export function useReference() {
  const { data } = useGetReferenceData({ query: { staleTime: Number.POSITIVE_INFINITY } });

  const classLabel = (value: CollateralClass) =>
    data?.collateralClasses.find((c) => c.value === value)?.label ?? collateralClassFallback[value];
  const serialLabel = (value: SerialNumberType | null | undefined) =>
    value ? (data?.serialNumberTypes.find((s) => s.value === value)?.label ?? serialTypeFallback[value]) : "—";

  return {
    serialNumberTypes:
      data?.serialNumberTypes ??
      Object.entries(serialTypeFallback).map(([value, label]) => ({ value: value as SerialNumberType, label })),
    classLabel,
    serialLabel,
  };
}
