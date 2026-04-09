"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, HeartPulse, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { registerUser } from "@/lib/api";

const registerSchema = z
  .object({
    tenant_name: z
      .string()
      .min(3, "Pharmacy name must be at least 3 characters"),
    tenant_slug: z
      .string()
      .min(3, "Pharmacy ID must be at least 3 characters")
      .max(80)
      .regex(
        /^[a-z0-9-]+$/,
        "Only lowercase letters, numbers, and hyphens allowed",
      ),
    full_name: z.string().min(3, "Full name must be at least 3 characters"),
    email: z
      .string()
      .min(1, "Email is required")
      .email("Invalid email address"),
    phone: z.string().optional(),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(64, "Password must be at most 64 characters"),
    confirm_password: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  async function onSubmit(values: RegisterFormValues) {
    setServerError(null);
    try {
      await registerUser({
        tenant_name: values.tenant_name,
        tenant_slug: values.tenant_slug,
        full_name: values.full_name,
        email: values.email,
        password: values.password,
        phone: values.phone,
      });
      router.push("/login?registered=1");
    } catch (err: unknown) {
      const raw = (err as { response?: { data?: { detail?: unknown } } })
        ?.response?.data?.detail;
      if (Array.isArray(raw)) {
        setServerError(raw.map((e: { msg?: string }) => e.msg).join(", "));
      } else if (typeof raw === "string") {
        setServerError(raw);
      } else {
        setServerError("Registration failed. Please try again.");
      }
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-10">
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
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Create an account</CardTitle>
            <CardDescription>Set up your pharmacy workspace</CardDescription>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-4"
              noValidate
            >
              {/* Pharmacy name */}
              <div className="space-y-1">
                <label
                  className="text-sm font-medium text-foreground"
                  htmlFor="tenant_name"
                >
                  Pharmacy Name
                </label>
                <Input
                  id="tenant_name"
                  type="text"
                  placeholder="Acme Pharmacy"
                  aria-invalid={!!errors.tenant_name}
                  {...register("tenant_name")}
                />
                {errors.tenant_name && (
                  <p className="text-xs text-destructive">
                    {errors.tenant_name.message}
                  </p>
                )}
              </div>

              {/* Tenant slug */}
              <div className="space-y-1">
                <label
                  className="text-sm font-medium text-foreground"
                  htmlFor="tenant_slug"
                >
                  Pharmacy ID
                  <span className="ml-1 text-xs font-normal text-muted-foreground">
                    (used to log in)
                  </span>
                </label>
                <Input
                  id="tenant_slug"
                  type="text"
                  placeholder="acme-pharmacy"
                  aria-invalid={!!errors.tenant_slug}
                  {...register("tenant_slug")}
                />
                {errors.tenant_slug && (
                  <p className="text-xs text-destructive">
                    {errors.tenant_slug.message}
                  </p>
                )}
              </div>

              {/* Full name */}
              <div className="space-y-1">
                <label
                  className="text-sm font-medium text-foreground"
                  htmlFor="full_name"
                >
                  Full Name
                </label>
                <Input
                  id="full_name"
                  type="text"
                  placeholder="Juan dela Cruz"
                  autoComplete="name"
                  aria-invalid={!!errors.full_name}
                  {...register("full_name")}
                />
                {errors.full_name && (
                  <p className="text-xs text-destructive">
                    {errors.full_name.message}
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

              {/* Phone (optional) */}
              <div className="space-y-1">
                <label
                  className="text-sm font-medium text-foreground"
                  htmlFor="phone"
                >
                  Phone
                  <span className="ml-1 text-xs font-normal text-muted-foreground">
                    (optional)
                  </span>
                </label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+63 912 345 6789"
                  autoComplete="tel"
                  {...register("phone")}
                />
              </div>

              {/* Password */}
              <div className="space-y-1">
                <label
                  className="text-sm font-medium text-foreground"
                  htmlFor="password"
                >
                  Password
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="min. 8 characters"
                    autoComplete="new-password"
                    aria-invalid={!!errors.password}
                    {...register("password")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute inset-y-0 right-2.5 flex items-center text-muted-foreground hover:text-foreground"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-destructive">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Confirm password */}
              <div className="space-y-1">
                <label
                  className="text-sm font-medium text-foreground"
                  htmlFor="confirm_password"
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <Input
                    id="confirm_password"
                    type={showConfirm ? "text" : "password"}
                    placeholder="••••••••"
                    autoComplete="new-password"
                    aria-invalid={!!errors.confirm_password}
                    {...register("confirm_password")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm((v) => !v)}
                    className="absolute inset-y-0 right-2.5 flex items-center text-muted-foreground hover:text-foreground"
                    aria-label={showConfirm ? "Hide password" : "Show password"}
                  >
                    {showConfirm ? (
                      <EyeOff className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}
                  </button>
                </div>
                {errors.confirm_password && (
                  <p className="text-xs text-destructive">
                    {errors.confirm_password.message}
                  </p>
                )}
              </div>

              {serverError && (
                <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                  {serverError}
                </p>
              )}

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting && (
                  <Loader2 className="mr-2 size-4 animate-spin" />
                )}
                Create account
              </Button>
            </form>

            <p className="mt-4 text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-medium text-primary hover:underline"
              >
                Sign in
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
