"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, CheckCircle2, HeartPulse, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { forgotPassword } from "@/lib/api";

const forgotSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  tenant_slug: z.string().min(3, "Pharmacy ID must be at least 3 characters"),
});

type ForgotFormValues = z.infer<typeof forgotSchema>;

export default function ForgotPasswordPage() {
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotFormValues>({
    resolver: zodResolver(forgotSchema),
  });

  async function onSubmit(values: ForgotFormValues) {
    setServerError(null);
    try {
      await forgotPassword(values);
      setSubmitted(true);
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { detail?: string } } })?.response?.data
          ?.detail ?? "Something went wrong. Please try again.";
      setServerError(
        typeof msg === "string"
          ? msg
          : "Something went wrong. Please try again.",
      );
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center gap-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
            <HeartPulse className="size-6 text-primary-foreground" />
          </div>
          <h1 className="text-xl font-semibold tracking-tight text-foreground">
            Pharmacy System
          </h1>
        </div>

        <Card>
          {submitted ? (
            <>
              <CardHeader className="pb-2">
                <div className="mb-1 flex items-center gap-2 text-emerald-600">
                  <CheckCircle2 className="size-5" />
                  <CardTitle className="text-base text-emerald-700">
                    Check your inbox
                  </CardTitle>
                </div>
                <CardDescription>
                  If that email exists in our system, you&apos;ll receive a
                  password reset link shortly.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/login">
                  <Button variant="outline" className="w-full">
                    <ArrowLeft className="mr-2 size-4" />
                    Back to sign in
                  </Button>
                </Link>
              </CardContent>
            </>
          ) : (
            <>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Reset your password</CardTitle>
                <CardDescription>
                  Enter your email and pharmacy ID. We&apos;ll send a reset link
                  if the account exists.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="space-y-4"
                  noValidate
                >
                  {/* Tenant slug */}
                  <div className="space-y-1">
                    <label
                      className="text-sm font-medium text-foreground"
                      htmlFor="tenant_slug"
                    >
                      Pharmacy ID
                    </label>
                    <Input
                      id="tenant_slug"
                      type="text"
                      placeholder="your-pharmacy"
                      autoComplete="organization"
                      aria-invalid={!!errors.tenant_slug}
                      {...register("tenant_slug")}
                    />
                    {errors.tenant_slug && (
                      <p className="text-xs text-destructive">
                        {errors.tenant_slug.message}
                      </p>
                    )}
                  </div>

                  {/* Email */}
                  <div className="space-y-1">
                    <label
                      className="text-sm font-medium text-foreground"
                      htmlFor="email"
                    >
                      Email
                    </label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      autoComplete="email"
                      aria-invalid={!!errors.email}
                      {...register("email")}
                    />
                    {errors.email && (
                      <p className="text-xs text-destructive">
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  {serverError && (
                    <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                      {serverError}
                    </p>
                  )}

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting && (
                      <Loader2 className="mr-2 size-4 animate-spin" />
                    )}
                    Send reset link
                  </Button>
                </form>

                <p className="mt-4 text-center text-sm text-muted-foreground">
                  Remember your password?{" "}
                  <Link
                    href="/login"
                    className="font-medium text-primary hover:underline"
                  >
                    Sign in
                  </Link>
                </p>
              </CardContent>
            </>
          )}
        </Card>
      </div>
    </main>
  );
}
