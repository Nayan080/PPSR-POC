"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { useLogin } from "@/api/generated/endpoints/auth/auth";
import { ErrorSummary } from "@/components/error-summary";
import { FormField } from "@/components/form-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { loginSchema } from "@/lib/schemas";
import { useAuthStore } from "@/stores/auth-store";

type Values = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const signIn = useAuthStore((s) => s.signIn);
  const login = useLogin();
  const [expired, setExpired] = useState(false);

  useEffect(() => {
    setExpired(new URLSearchParams(window.location.search).has("expired"));
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Values>({ resolver: zodResolver(loginSchema), defaultValues: { email: "", password: "" } });

  const onSubmit = handleSubmit((data) =>
    login.mutate(
      { data },
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
      <h1 className="text-xl font-semibold">Account log in</h1>
      <p className="mt-1 text-sm text-muted-foreground">Log in to run PPSR and vehicle history searches.</p>

      <div className="mt-6">
        {expired && !login.error && (
          <p className="mb-5 rounded-md border bg-muted px-3 py-2 text-sm">Your session ended. Please log in again.</p>
        )}
        <ErrorSummary error={login.error} title="Unable to log in" />

        <form onSubmit={onSubmit} noValidate className="grid gap-4">
          <FormField id="email" label="Email address" error={errors.email?.message}>
            <Input
              id="email"
              type="email"
              autoComplete="username"
              aria-invalid={!!errors.email}
              {...register("email")}
            />
          </FormField>
          <FormField id="password" label="Password" error={errors.password?.message}>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              aria-invalid={!!errors.password}
              {...register("password")}
            />
          </FormField>
          <Button type="submit" size="lg" className="mt-2 w-full" disabled={login.isPending}>
            {login.isPending ? "Logging in…" : "Log in"}
          </Button>
        </form>
      </div>

      <div className="mt-6 border-t pt-5 text-sm">
        Don&apos;t have an account?{" "}
        <Link href="/create-account" className="font-medium text-primary underline-offset-4 hover:underline">
          Create an account
        </Link>
      </div>

      <div className="mt-5 rounded-md bg-muted px-3 py-2.5 text-xs text-muted-foreground">
        <span className="font-medium text-foreground">Demo account</span> — demo@ppsr.test / Password123!
      </div>
    </div>
  );
}
