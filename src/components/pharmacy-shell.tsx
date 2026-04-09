"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Boxes, LayoutDashboard, Package, Receipt, Truck, Users } from "lucide-react";

import { cn } from "@/lib/utils";

const primaryNav = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard },
  { label: "Products", href: "/products", icon: Package },
  { label: "Inventory", href: "/inventory", icon: Boxes },
  { label: "Sales", href: "/sales", icon: Receipt },
  { label: "Suppliers", href: "/suppliers", icon: Truck },
  { label: "Users", href: "/users", icon: Users },
];

export function PharmacyShell({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,#ffffff_0%,#f8f8f6_45%,#f3f3f1_100%)] text-foreground">
      <div className="grid h-screen grid-cols-1 overflow-hidden border border-border/70 bg-background shadow-[0_20px_80px_rgba(0,0,0,0.05)] lg:grid-cols-[320px_1fr]">
        <aside className="h-full overflow-y-auto border-b border-border/70 bg-[#fbfbfa] px-5 py-6 lg:border-r lg:border-b-0">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full border border-foreground/20 bg-background">
              <div className="h-4 w-4 rounded-full border-2 border-foreground/80" />
            </div>
            <h1 className="text-[2rem] font-semibold tracking-tight">Demo Pharmacy</h1>
          </div>

          <nav className="mt-10 space-y-1">
            {primaryNav.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "grid h-12 w-full grid-cols-[20px_1fr] items-center gap-x-3 rounded-2xl px-3 text-left text-[15px] transition",
                    active ? "bg-muted text-foreground" : "text-foreground/85 hover:bg-muted/60"
                  )}
                >
                  <item.icon className="h-4 w-4 justify-self-center" />
                  <span className="truncate">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </aside>

        <section className="h-full overflow-y-auto bg-[#fcfcfb]">
          <header className="border-b border-border/70 px-6 py-5 md:px-8">
            <h2 className="text-[2rem] font-semibold tracking-tight">{title}</h2>
            {description ? <p className="text-sm text-muted-foreground">{description}</p> : null}
          </header>
          <div className="space-y-8 p-6 md:p-8">{children}</div>
        </section>
      </div>
    </main>
  );
}
