"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Controller, type UseFormRegisterReturn, useForm } from "react-hook-form";
import type { z } from "zod";
import { getGetDashboardSummaryQueryKey } from "@/api/generated/endpoints/dashboard/dashboard";
import {
  getGetSearchQueryKey,
  getListSearchesQueryKey,
  useSearchByOrganisationGrantor,
  useSearchByRegistrationNumber,
  useSearchBySerialNumber,
} from "@/api/generated/endpoints/searches/searches";
import type { SearchResultDto } from "@/api/generated/model";
import { FormField } from "@/components/form-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useReference } from "@/hooks/use-reference";
import { identifierTypes } from "@/lib/format";
import { grantorSearchSchema, registrationNumberSearchSchema, serialSearchSchema } from "@/lib/schemas";
import { cn } from "@/lib/utils";

/** The three search mutations; each opens the result page when it completes. */
export function useRunSearch() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const onSuccess = (result: SearchResultDto) => {
    queryClient.setQueryData(getGetSearchQueryKey(result.id), result);
    queryClient.invalidateQueries({ queryKey: getListSearchesQueryKey() });
    queryClient.invalidateQueries({ queryKey: getGetDashboardSummaryQueryKey() });
    router.push(`/search/${result.id}`);
  };
  return {
    serial: useSearchBySerialNumber({ mutation: { onSuccess } }),
    grantor: useSearchByOrganisationGrantor({ mutation: { onSuccess } }),
    registration: useSearchByRegistrationNumber({ mutation: { onSuccess } }),
  };
}

interface FormProps<S extends z.ZodType> {
  onSearch: (values: z.output<S>) => void;
  pending: boolean;
  /** Compact layout for the dashboard: no hint text or reference field. */
  compact?: boolean;
}

export function SerialSearchForm({ onSearch, pending, compact }: FormProps<typeof serialSearchSchema>) {
  const { serialNumberTypes } = useReference();
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<z.input<typeof serialSearchSchema>, unknown, z.output<typeof serialSearchSchema>>({
    resolver: zodResolver(serialSearchSchema),
    defaultValues: { serialNumberType: "VIN", serialNumber: "", clientReference: "" },
  });

  return (
    <form onSubmit={handleSubmit(onSearch)} noValidate className="grid gap-4">
      {!compact && (
        <p className="text-sm text-muted-foreground">
          VIN searches include vehicle details and written-off and stolen checks. Try{" "}
          <span className="font-mono">6T1BF3FK40X012345</span>, <span className="font-mono">KMHCT41DAEU123456</span> or{" "}
          <span className="font-mono">WVWZZZ1KZ6W654321</span>.
        </p>
      )}
      <div
        className={cn(
          "grid items-start gap-4",
          compact
            ? "md:grid-cols-[minmax(0,19rem)_1fr] lg:grid-cols-[minmax(0,19rem)_1fr_auto]"
            : "md:grid-cols-[minmax(0,19rem)_1fr]",
        )}
      >
        <FormField id="serialNumberType" label="Serial number type">
          <Controller
            control={control}
            name="serialNumberType"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger
                  id="serialNumberType"
                  className="w-full min-w-0 *:data-[slot=select-value]:block *:data-[slot=select-value]:truncate"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {serialNumberTypes.map((t) => (
                    <SelectItem key={t.value} value={t.value}>
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </FormField>
        <FormField id="serialNumber" label="Serial number" error={errors.serialNumber?.message}>
          <Input
            id="serialNumber"
            className="font-mono uppercase"
            autoComplete="off"
            spellCheck={false}
            aria-invalid={!!errors.serialNumber}
            {...register("serialNumber")}
          />
        </FormField>
        {compact && <SubmitButton pending={pending} inline />}
      </div>
      {!compact && (
        <FormFooter pending={pending} error={errors.clientReference?.message} register={register("clientReference")} />
      )}
    </form>
  );
}

export function GrantorSearchForm({ onSearch, pending }: FormProps<typeof grantorSearchSchema>) {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<z.input<typeof grantorSearchSchema>, unknown, z.output<typeof grantorSearchSchema>>({
    resolver: zodResolver(grantorSearchSchema),
    defaultValues: { identifierType: "ACN", identifierNumber: "", clientReference: "" },
  });

  return (
    <form onSubmit={handleSubmit(onSearch)} noValidate className="grid gap-4">
      <p className="text-sm text-muted-foreground">
        Find security interests over a company&apos;s assets. An ABN search also matches the ACN it contains. Try ACN{" "}
        <span className="font-mono">604 512 378</span>.
      </p>
      <div className="grid items-start gap-4 md:grid-cols-[minmax(0,19rem)_1fr]">
        <FormField id="identifierType" label="Identifier type">
          <Controller
            control={control}
            name="identifierType"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger id="identifierType" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {identifierTypes.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </FormField>
        <FormField id="identifierNumber" label="Identifier number" error={errors.identifierNumber?.message}>
          <Input
            id="identifierNumber"
            inputMode="numeric"
            className="font-mono"
            aria-invalid={!!errors.identifierNumber}
            {...register("identifierNumber")}
          />
        </FormField>
      </div>
      <FormFooter pending={pending} error={errors.clientReference?.message} register={register("clientReference")} />
    </form>
  );
}

export function RegistrationNumberForm({ onSearch, pending }: FormProps<typeof registrationNumberSearchSchema>) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.input<typeof registrationNumberSearchSchema>, unknown, z.output<typeof registrationNumberSearchSchema>>(
    {
      resolver: zodResolver(registrationNumberSearchSchema),
      defaultValues: { registrationNumber: "", clientReference: "" },
    },
  );

  return (
    <form onSubmit={handleSubmit(onSearch)} noValidate className="grid gap-4">
      <p className="text-sm text-muted-foreground">
        Retrieve a single current registration by its 15-digit number. Try{" "}
        <span className="font-mono">202307190311045</span>.
      </p>
      <FormField
        id="registrationNumber"
        label="Registration number"
        error={errors.registrationNumber?.message}
        className="md:max-w-md"
      >
        <Input
          id="registrationNumber"
          inputMode="numeric"
          className="font-mono"
          aria-invalid={!!errors.registrationNumber}
          {...register("registrationNumber")}
        />
      </FormField>
      <FormFooter pending={pending} error={errors.clientReference?.message} register={register("clientReference")} />
    </form>
  );
}

/** Optional reference and the submit button, separated from the criteria by a rule. */
function FormFooter({
  pending,
  error,
  register,
}: {
  pending: boolean;
  error?: string;
  register: UseFormRegisterReturn;
}) {
  return (
    <div className="grid items-end gap-4 border-t pt-4 md:grid-cols-[minmax(0,24rem)_1fr]">
      <FormField
        id="clientReference"
        label="Your reference"
        optional
        hint="Shown on the result and in your history, e.g. a stock or deal number."
        error={error}
      >
        <Input id="clientReference" autoComplete="off" {...register} />
      </FormField>
      <div className="md:justify-self-end">
        <SubmitButton pending={pending} />
      </div>
    </div>
  );
}

function SubmitButton({ pending, inline }: { pending: boolean; inline?: boolean }) {
  return (
    <Button
      type="submit"
      size="lg"
      className={cn(
        "w-full md:w-auto md:min-w-32",
        inline && "md:col-span-2 md:w-full lg:col-span-1 lg:w-auto lg:self-end",
      )}
      disabled={pending}
    >
      {pending ? "Searching…" : "Search"}
    </Button>
  );
}
