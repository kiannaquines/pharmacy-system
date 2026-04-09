import { Building2, CheckCircle2, MoreHorizontal, Plus, ServerCrash, Users } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PharmacyShell } from "@/components/pharmacy-shell";

type Plan   = "Free" | "Pro" | "Enterprise";
type Status = "Active" | "Suspended" | "Trial";

const TENANTS: {
  id: string;
  name: string;
  initials: string;
  plan: Plan;
  status: Status;
  members: number;
  storageGB: number;
  city: string;
  createdAt: string;
}[] = [
  { id: "1", name: "MedPlus Pharmacy",     initials: "MP", plan: "Enterprise", status: "Active",    members: 24, storageGB: 18, city: "Manila",    createdAt: "Jan 2023" },
  { id: "2", name: "Wellness Drug Store",  initials: "WD", plan: "Pro",        status: "Active",    members:  9, storageGB:  6, city: "Cebu",      createdAt: "Mar 2023" },
  { id: "3", name: "CityRx Dispensary",    initials: "CR", plan: "Pro",        status: "Trial",     members:  5, storageGB:  3, city: "Davao",     createdAt: "Aug 2024" },
  { id: "4", name: "HealthFirst Pharmacy", initials: "HF", plan: "Free",       status: "Active",    members:  3, storageGB:  1, city: "Makati",    createdAt: "Feb 2024" },
  { id: "5", name: "QuickMeds",            initials: "QM", plan: "Pro",        status: "Suspended", members:  7, storageGB:  4, city: "Quezon City",createdAt: "Nov 2023" },
  { id: "6", name: "Apex Pharma",          initials: "AP", plan: "Enterprise", status: "Active",    members: 18, storageGB: 14, city: "Taguig",    createdAt: "Jun 2022" },
  { id: "7", name: "OneStop Chemist",      initials: "OS", plan: "Free",       status: "Active",    members:  2, storageGB:  1, city: "Pasig",     createdAt: "Jan 2025" },
];

const PLAN_STYLES: Record<Plan, { badge: string; bg: string }> = {
  Free:       { badge: "bg-muted text-muted-foreground border-border",        bg: "bg-muted/50" },
  Pro:        { badge: "bg-primary/10 text-primary border-primary/20",        bg: "bg-primary/5" },
  Enterprise: { badge: "bg-violet-100 text-violet-700 border-violet-200",      bg: "bg-violet-50" },
};

const STATUS_STYLES: Record<Status, { label: string; classes: string; dot: string }> = {
  Active:    { label: "Active",    classes: "text-emerald-700 bg-emerald-50 border-emerald-200",  dot: "bg-emerald-500" },
  Suspended: { label: "Suspended", classes: "text-red-700 bg-red-50 border-red-200",              dot: "bg-red-500" },
  Trial:     { label: "Trial",     classes: "text-amber-700 bg-amber-50 border-amber-200",        dot: "bg-amber-500" },
};

const PLAN_COLORS: Record<Plan, string> = {
  Free:       "text-muted-foreground",
  Pro:        "text-primary",
  Enterprise: "text-violet-600",
};

function count(status?: Status, plan?: Plan) {
  return TENANTS.filter(
    (t) => (status ? t.status === status : true) && (plan ? t.plan === plan : true)
  ).length;
}

const stats = [
  { label: "Total Tenants",   value: TENANTS.length,        icon: Building2,   iconBg: "bg-primary/10",     iconColor: "text-primary" },
  { label: "Active",          value: count("Active"),        icon: CheckCircle2, iconBg: "bg-emerald-100",  iconColor: "text-emerald-600" },
  { label: "Pro / Enterprise",value: count(undefined, "Pro") + count(undefined, "Enterprise"), icon: Users, iconBg: "bg-violet-100", iconColor: "text-violet-600" },
  { label: "Suspended",       value: count("Suspended"),     icon: ServerCrash, iconBg: "bg-red-100",       iconColor: "text-red-600" },
];

export default function TenantsPage() {
  return (
    <PharmacyShell
      title="Tenants"
      description="Manage all pharmacy branches and organizations on this platform"
    >
      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {stats.map(({ label, value, icon: Icon, iconBg, iconColor }) => (
          <Card key={label} className="border border-border bg-card">
            <CardContent className="flex items-center gap-3 p-4">
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${iconBg}`}>
                <Icon className={`h-5 w-5 ${iconColor}`} />
              </div>
              <div>
                <p className="text-2xl font-bold">{value}</p>
                <p className="text-xs text-muted-foreground">{label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Table card */}
      <Card className="border border-border bg-card">
        <CardHeader className="flex flex-row items-center justify-between gap-4 pb-3">
          <CardTitle className="text-base">All Tenants</CardTitle>
          <Button size="sm" className="gap-1.5">
            <Plus className="h-3.5 w-3.5" />
            Add Tenant
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Tenant
                  </th>
                  <th className="hidden px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground sm:table-cell">
                    Location
                  </th>
                  <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Plan
                  </th>
                  <th className="hidden px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground lg:table-cell">
                    Members
                  </th>
                  <th className="hidden px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground lg:table-cell">
                    Storage
                  </th>
                  <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Status
                  </th>
                  <th className="hidden px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground md:table-cell">
                    Since
                  </th>
                  <th className="px-4 py-2.5" />
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {TENANTS.map((tenant) => {
                  const plan   = PLAN_STYLES[tenant.plan];
                  const status = STATUS_STYLES[tenant.status];
                  return (
                    <tr key={tenant.id} className="transition-colors hover:bg-muted/30">
                      {/* Tenant */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold text-primary ${plan.bg}`}>
                            {tenant.initials}
                          </div>
                          <span className="font-medium leading-tight">{tenant.name}</span>
                        </div>
                      </td>
                      {/* City */}
                      <td className="hidden px-4 py-3 text-muted-foreground sm:table-cell">
                        {tenant.city}
                      </td>
                      {/* Plan */}
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${plan.badge}`}
                        >
                          {tenant.plan}
                        </span>
                      </td>
                      {/* Members */}
                      <td className="hidden px-4 py-3 tabular-nums text-muted-foreground lg:table-cell">
                        {tenant.members}
                      </td>
                      {/* Storage */}
                      <td className="hidden px-4 py-3 lg:table-cell">
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 w-20 rounded-full bg-muted">
                            <div
                              className="h-1.5 rounded-full bg-primary"
                              style={{ width: `${Math.min((tenant.storageGB / 20) * 100, 100)}%` }}
                            />
                          </div>
                          <span className="text-xs text-muted-foreground">{tenant.storageGB}&nbsp;GB</span>
                        </div>
                      </td>
                      {/* Status */}
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium ${status.classes}`}
                        >
                          <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} />
                          {status.label}
                        </span>
                      </td>
                      {/* Created */}
                      <td className="hidden px-4 py-3 text-xs text-muted-foreground md:table-cell">
                        {tenant.createdAt}
                      </td>
                      {/* Actions */}
                      <td className="px-4 py-3 text-right">
                        <button className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
                          <MoreHorizontal className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="border-t border-border px-4 py-2.5 text-xs text-muted-foreground">
            Showing {TENANTS.length} of {TENANTS.length} tenants
          </div>
        </CardContent>
      </Card>

      {/* Plan comparison */}
      <Card className="border border-border bg-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Plan Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-3">
            {([
              { plan: "Free"       as Plan, price: "₱0 / mo",    features: ["Up to 3 users", "1 GB storage", "Basic reports"] },
              { plan: "Pro"        as Plan, price: "₱999 / mo",  features: ["Up to 20 users", "10 GB storage", "Advanced reports", "API access"] },
              { plan: "Enterprise" as Plan, price: "Custom",      features: ["Unlimited users", "50 GB+ storage", "Dedicated support", "SSO & audit log"] },
            ] as const).map(({ plan, price, features }) => (
              <div key={plan} className={`rounded-xl border border-border p-4 ${PLAN_STYLES[plan].bg}`}>
                <div className="mb-2 flex items-center justify-between">
                  <span className={`text-sm font-semibold ${PLAN_COLORS[plan]}`}>{plan}</span>
                  <span className="text-xs font-medium text-muted-foreground">{price}</span>
                </div>
                <ul className="space-y-1">
                  {features.map((f) => (
                    <li key={f} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <CheckCircle2 className="h-3 w-3 text-emerald-500 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <p className="mt-3 text-xs font-medium text-muted-foreground">
                  {count(undefined, plan)} tenant{count(undefined, plan) !== 1 ? "s" : ""}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </PharmacyShell>
  );
}
