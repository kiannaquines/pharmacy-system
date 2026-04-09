import { Bell, Globe, KeyRound, Mail, Palette, Save, Shield, Building2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PharmacyShell } from "@/components/pharmacy-shell";
import { Separator } from "@/components/ui/separator";

function SettingRow({
  label,
  description,
  children,
}: {
  label: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 py-4 sm:flex-row sm:items-start sm:justify-between sm:gap-8">
      <div className="min-w-0 sm:max-w-xs">
        <p className="text-sm font-medium text-foreground">{label}</p>
        {description && <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>}
      </div>
      <div className="w-full sm:max-w-xs">{children}</div>
    </div>
  );
}

function Toggle({ enabled = false, label }: { enabled?: boolean; label: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-foreground">{label}</span>
      <button
        aria-checked={enabled}
        className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors ${enabled ? "bg-primary" : "bg-muted"}`}
      >
        <span
          className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${enabled ? "translate-x-4" : "translate-x-0"}`}
        />
      </button>
    </div>
  );
}

const SECTIONS = [
  {
    id: "org",
    icon: Building2,
    title: "Organization",
    description: "General info about your pharmacy branch",
    iconBg: "bg-primary/10",
    iconColor: "text-primary",
  },
  {
    id: "locale",
    icon: Globe,
    title: "Locale & Display",
    description: "Time zone, currency, and formatting preferences",
    iconBg: "bg-sky-100",
    iconColor: "text-sky-600",
  },
  {
    id: "notifications",
    icon: Bell,
    title: "Notifications",
    description: "Control when and how you receive alerts",
    iconBg: "bg-amber-100",
    iconColor: "text-amber-600",
  },
  {
    id: "security",
    icon: Shield,
    title: "Security",
    description: "Authentication and session settings",
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-600",
  },
  {
    id: "integrations",
    icon: KeyRound,
    title: "API & Integrations",
    description: "Manage API keys and third-party connections",
    iconBg: "bg-violet-100",
    iconColor: "text-violet-600",
  },
];

export default function SettingsPage() {
  return (
    <PharmacyShell
      title="Settings"
      description="Manage your pharmacy system preferences and configuration"
    >
      <div className="grid gap-6 xl:grid-cols-[220px_1fr]">
        {/* Sidebar nav */}
        <nav className="hidden xl:block">
          <ul className="space-y-0.5">
            {SECTIONS.map(({ id, icon: Icon, title, iconBg, iconColor }) => (
              <li key={id}>
                <a
                  href={`#${id}`}
                  className="flex items-center gap-2.5 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md ${iconBg}`}>
                    <Icon className={`h-3.5 w-3.5 ${iconColor}`} />
                  </div>
                  {title}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Settings panels */}
        <div className="space-y-5">
          {/* Organization */}
          <Card id="org" className="border border-border bg-card">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
                  <Building2 className="h-4.5 w-4.5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-base">Organization</CardTitle>
                  <CardDescription>General info about your pharmacy branch</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="divide-y divide-border">
              <SettingRow label="Organization Name" description="Your legal pharmacy trade name">
                <Input defaultValue="Demo Pharmacy Inc." className="h-8 text-sm" />
              </SettingRow>
              <SettingRow label="Branch" description="Current operating branch or location">
                <Input defaultValue="Main Branch – Manila" className="h-8 text-sm" />
              </SettingRow>
              <SettingRow label="Contact Email" description="Primary contact for notifications">
                <Input type="email" defaultValue="admin@pharmacy.com" className="h-8 text-sm" />
              </SettingRow>
              <SettingRow label="Phone Number" description="Main support or operations line">
                <Input type="tel" defaultValue="+63 2 8123 4567" className="h-8 text-sm" />
              </SettingRow>
              <div className="flex justify-end pt-4">
                <Button size="sm" className="gap-1.5">
                  <Save className="h-3.5 w-3.5" />
                  Save changes
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Locale */}
          <Card id="locale" className="border border-border bg-card">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-100">
                  <Globe className="h-4.5 w-4.5 text-sky-600" />
                </div>
                <div>
                  <CardTitle className="text-base">Locale & Display</CardTitle>
                  <CardDescription>Formatting and regional preferences</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="divide-y divide-border">
              <SettingRow label="Time Zone" description="Used for all date/time display">
                <select className="h-8 w-full rounded-md border border-input bg-background px-3 text-sm outline-none transition focus:ring-1 focus:ring-ring">
                  <option>Asia/Manila (UTC +8)</option>
                  <option>UTC</option>
                  <option>America/New_York</option>
                </select>
              </SettingRow>
              <SettingRow label="Currency" description="Display currency for prices and totals">
                <select className="h-8 w-full rounded-md border border-input bg-background px-3 text-sm outline-none transition focus:ring-1 focus:ring-ring">
                  <option>PHP – Philippine Peso</option>
                  <option>USD – US Dollar</option>
                  <option>EUR – Euro</option>
                </select>
              </SettingRow>
              <SettingRow label="Date Format" description="Short date display preference">
                <select className="h-8 w-full rounded-md border border-input bg-background px-3 text-sm outline-none transition focus:ring-1 focus:ring-ring">
                  <option>MM/DD/YYYY</option>
                  <option>DD/MM/YYYY</option>
                  <option>YYYY-MM-DD</option>
                </select>
              </SettingRow>
              <div className="flex justify-end pt-4">
                <Button size="sm" variant="outline" className="gap-1.5">
                  <Save className="h-3.5 w-3.5" />
                  Save preferences
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card id="notifications" className="border border-border bg-card">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-100">
                  <Bell className="h-4.5 w-4.5 text-amber-600" />
                </div>
                <div>
                  <CardTitle className="text-base">Notifications</CardTitle>
                  <CardDescription>Select the events that trigger alerts</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 rounded-lg border border-border bg-muted/20 p-4">
                <Toggle enabled={true}  label="Low stock alerts" />
                <Separator />
                <Toggle enabled={true}  label="New sale recorded" />
                <Separator />
                <Toggle enabled={false} label="Batch expiry warnings" />
                <Separator />
                <Toggle enabled={true}  label="New supplier added" />
                <Separator />
                <Toggle enabled={false} label="Weekly summary email" />
              </div>
              <div className="mt-4 flex justify-end">
                <Button size="sm" variant="outline" className="gap-1.5">
                  <Mail className="h-3.5 w-3.5" />
                  Send test notification
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Security */}
          <Card id="security" className="border border-border bg-card">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100">
                  <Shield className="h-4.5 w-4.5 text-emerald-600" />
                </div>
                <div>
                  <CardTitle className="text-base">Security</CardTitle>
                  <CardDescription>Authentication and session configuration</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="divide-y divide-border">
              <SettingRow label="Session Timeout" description="Auto-logout after inactivity">
                <select className="h-8 w-full rounded-md border border-input bg-background px-3 text-sm outline-none transition focus:ring-1 focus:ring-ring">
                  <option>30 minutes</option>
                  <option>1 hour</option>
                  <option>4 hours</option>
                  <option>8 hours</option>
                </select>
              </SettingRow>
              <div className="space-y-3 py-4">
                <Toggle enabled={true}  label="Require 2-factor authentication for Admins" />
                <Toggle enabled={false} label="Single sign-on (SSO)" />
                <Toggle enabled={true}  label="Audit log all data modifications" />
              </div>
              <div className="flex justify-end pt-4">
                <Button size="sm" variant="outline" className="gap-1.5 text-destructive hover:text-destructive">
                  <KeyRound className="h-3.5 w-3.5" />
                  Rotate API secret
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Integrations */}
          <Card id="integrations" className="border border-border bg-card">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-100">
                  <KeyRound className="h-4.5 w-4.5 text-violet-600" />
                </div>
                <div>
                  <CardTitle className="text-base">API & Integrations</CardTitle>
                  <CardDescription>Manage credentials for external services</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { name: "Backend REST API", key: "sk_live_••••••••••••bXz9", status: "Connected",    statusColor: "text-emerald-600" },
                  { name: "Barcode Scanner",  key: "Not configured",            status: "Disconnected", statusColor: "text-muted-foreground" },
                  { name: "Email Provider",   key: "smtp_••••••••3f7a",         status: "Connected",    statusColor: "text-emerald-600" },
                ].map(({ name, key, status, statusColor }) => (
                  <div key={name} className="flex items-center justify-between gap-4 rounded-lg border border-border bg-muted/20 px-4 py-3">
                    <div className="min-w-0">
                      <p className="text-sm font-medium">{name}</p>
                      <p className="font-mono text-xs text-muted-foreground">{key}</p>
                    </div>
                    <div className="flex shrink-0 items-center gap-3">
                      <span className={`text-xs font-medium ${statusColor}`}>{status}</span>
                      <Button size="sm" variant="outline" className="h-7 text-xs">
                        Configure
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PharmacyShell>
  );
}
