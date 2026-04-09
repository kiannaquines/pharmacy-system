"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  Boxes,
  Building2,
  HeartPulse,
  LayoutDashboard,
  LogOut,
  Package,
  Receipt,
  Settings,
  Truck,
  Users,
} from "lucide-react";

import { cn } from "@/lib/utils";

const navGroups = [
  {
    label: "Overview",
    items: [{ label: "Dashboard", href: "/", icon: LayoutDashboard }],
  },
  {
    label: "Operations",
    items: [
      { label: "Products", href: "/products", icon: Package },
      { label: "Inventory", href: "/inventory", icon: Boxes },
      { label: "Sales", href: "/sales", icon: Receipt },
      { label: "Suppliers", href: "/suppliers", icon: Truck },
    ],
  },
  {
    label: "Administration",
    items: [
      { label: "Users", href: "/users", icon: Users },
      { label: "Tenants", href: "/tenants", icon: Building2 },
      { label: "Settings", href: "/settings", icon: Settings },
    ],
  },
];

export function PharmacyShell({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="grid h-screen grid-cols-1 overflow-hidden lg:grid-cols-[260px_1fr]">
        {/* ── Sidebar ── */}
        <aside className="flex h-full flex-col overflow-hidden border-b border-sidebar-border bg-sidebar lg:border-r lg:border-b-0">
          {/* Brand */}
          <div className="flex h-16 shrink-0 items-center gap-3 border-b border-sidebar-border px-5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary shadow-sm">
              <HeartPulse className="h-4 w-4 text-primary-foreground" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-sidebar-foreground">
                Demo Pharmacy
              </p>
              <p className="text-[10px] text-sidebar-foreground/50">
                Inventory System
              </p>
            </div>
          </div>

          {/* Nav groups */}
          <nav className="flex-1 overflow-y-auto px-3 py-4">
            <div className="space-y-5">
              {navGroups.map((group) => (
                <div key={group.label}>
                  <p className="mb-1 px-2 text-[10px] font-semibold uppercase tracking-widest text-sidebar-foreground/40">
                    {group.label}
                  </p>
                  <div className="space-y-0.5">
                    {group.items.map((item) => {
                      const active =
                        item.href === "/"
                          ? pathname === "/"
                          : pathname.startsWith(item.href);
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={cn(
                            "flex h-9 w-full items-center gap-2.5 rounded-md px-2.5 text-sm font-medium transition-colors",
                            active
                              ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm"
                              : "text-sidebar-foreground/65 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                          )}
                        >
                          <item.icon className="h-4 w-4 shrink-0" />
                          <span className="truncate">{item.label}</span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </nav>

          {/* User footer */}
          <div className="shrink-0 border-t border-sidebar-border px-3 py-3">
            <div className="flex items-center gap-2.5 rounded-md px-2 py-2 transition-colors hover:bg-sidebar-accent">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/15 text-[10px] font-bold text-primary">
                PH
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-semibold text-sidebar-foreground">
                  Pharmacy Admin
                </p>
                <p className="truncate text-[10px] text-sidebar-foreground/50">
                  admin@pharmacy.com
                </p>
              </div>
              <LogOut className="h-3.5 w-3.5 shrink-0 text-sidebar-foreground/40" />
            </div>
          </div>
        </aside>

        {/* ── Main content ── */}
        <div className="flex h-full flex-col overflow-hidden bg-background">
          {/* Top header / navbar */}
          <header className="flex h-16 shrink-0 items-center justify-between gap-4 border-b border-border bg-background/95 px-6 backdrop-blur-sm md:px-8">
            <div className="min-w-0">
              <h1 className="text-base font-semibold tracking-tight text-foreground">
                {title}
              </h1>
              {description && (
                <p className="truncate text-xs text-muted-foreground">
                  {description}
                </p>
              )}
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <button className="relative flex h-8 w-8 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:bg-muted">
                <Bell className="h-4 w-4" />
                <span className="absolute -right-0.5 -top-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-primary text-[8px] font-bold text-primary-foreground">
                  3
                </span>
              </button>
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/15 text-[10px] font-bold text-primary ring-2 ring-primary/20">
                PH
              </div>
            </div>
          </header>

          {/* Page content */}
          <div className="flex-1 overflow-y-auto p-6 md:p-8">
            <div className="space-y-6">{children}</div>
          </div>
        </div>
      </div>
    </main>
  );
}
