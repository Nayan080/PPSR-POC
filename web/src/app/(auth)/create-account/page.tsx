"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import type { z } from "zod";
import { useRegisterAccount } from "@/api/generated/endpoints/auth/auth";
import { ErrorSummary } from "@/components/error-summary";
import { FormField } from "@/components/form-field";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { createAccountSchema } from "@/lib/schemas";
import { useAuthStore } from "@/stores/auth-store";

type Values = z.infer<typeof createAccountSchema>;

export default function CreateAccountPage() {
  const router = useRouter();
  const signIn = useAuthStore((s) => s.signIn);
  const registerAccount = useRegisterAccount();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<Values>({
    resolver: zodResolver(createAccountSchema),
    defaultValues: {
      givenName: "",
      familyName: "",
      organisationName: "",
      email: "",
      password: "",
      confirmPassword: "",
      acceptTerms: false,
    },
  });

  const onSubmit = handleSubmit(({ confirmPassword: _, acceptTerms: __, ...data }) =>
    registerAccount.mutate(
      { data: { ...data, organisationName: data.organisationName || undefined } },
      {
        onSuccess: ({ accessToken, account }) => {
          signIn(accessToken, account);
          router.replace("/dashboard");
        },
      },
    ),
  );

  return (
    <div className="rounded-md border bg-card p-6 sm:p-8">
      <h1 className="text-xl font-semibold">Create an account</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Create an account to search the PPSR and keep a history of your certificates.
      </p>

      <div className="mt-6">
        <ErrorSummary error={registerAccount.error} />
        <form onSubmit={onSubmit} noValidate className="grid gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField id="givenName" label="Given name" error={errors.givenName?.message}>
              <Input id="givenName" autoComplete="given-name" {...register("givenName")} />
            </FormField>
            <FormField id="familyName" label="Family name" error={errors.familyName?.message}>
              <Input id="familyName" autoComplete="family-name" {...register("familyName")} />
            </FormField>
          </div>
          <FormField id="organisationName" label="Organisation" optional>
            <Input id="organisationName" autoComplete="organization" {...register("organisationName")} />
          </FormField>
          <FormField id="email" label="Email address" error={errors.email?.message}>
            <Input id="email" type="email" autoComplete="email" {...register("email")} />
          </FormField>
          <FormField id="password" label="Password" hint="At least 8 characters" error={errors.password?.message}>
            <Input id="password" type="password" autoComplete="new-password" {...register("password")} />
          </FormField>
          <FormField id="confirmPassword" label="Confirm password" error={errors.confirmPassword?.message}>
            <Input id="confirmPassword" type="password" autoComplete="new-password" {...register("confirmPassword")} />
          </FormField>
          <div className="grid gap-1.5">
            <div className="flex items-start gap-2.5">
              <Controller
                control={control}
                name="acceptTerms"
                render={({ field }) => (
                  <Checkbox
                    id="acceptTerms"
                    checked={field.value}
                    onCheckedChange={(v) => field.onChange(v === true)}
                    className="mt-0.5"
                  />
                )}
              />
              <label htmlFor="acceptTerms" className="text-sm">
                I accept the account customer terms and conditions of use.
              </label>
            </div>
            {errors.acceptTerms && <p className="text-xs font-medium text-destructive">{errors.acceptTerms.message}</p>}
          </div>
          <Button type="submit" size="lg" className="mt-2 w-full" disabled={registerAccount.isPending}>
            {registerAccount.isPending ? "Creating account…" : "Create account"}
          </Button>
        </form>
      </div>

      <div className="mt-6 border-t pt-5 text-sm">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-primary underline-offset-4 hover:underline">
          Log in
        </Link>
      </div>
    </div>
  );
}
