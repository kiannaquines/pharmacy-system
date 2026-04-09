import {
  Boxes,
  ChevronRight,
  ClipboardList,
  Database,
  Folder,
  LayoutDashboard,
  LifeBuoy,
  Mail,
  MoreHorizontal,
  PanelLeft,
  Package,
  Plus,
  Receipt,
  Truck,
  Users,
} from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchBatches, fetchDashboardSummary, fetchProducts, fetchSales, fetchSuppliers } from "@/lib/api";
import { formatCurrency } from "@/lib/format";
import { cn } from "@/lib/utils";

const primaryNav = [
  { label: "Dashboard", icon: LayoutDashboard, active: true },
  { label: "Products", icon: Package },
  { label: "Inventory", icon: Boxes },
  { label: "Sales", icon: Receipt },
  { label: "Suppliers", icon: Truck },
  { label: "Users", icon: Users },
];

const documentNav = [
  { label: "Stock Batches", icon: Database },
  { label: "Reports", icon: Folder },
  { label: "Activity Logs", icon: ClipboardList },
  { label: "Support", icon: LifeBuoy },
  { label: "More", icon: MoreHorizontal },
];

const chartPoints = [22, 18, 30, 26, 34, 28, 38, 35, 45, 33, 52, 41, 48, 37, 54, 46, 58, 42, 61, 49, 57, 44, 63, 50, 60, 47, 65, 55, 62, 51];

function MiniStatCard({
  title,
  value,
  note,
  trend,
}: {
  title: string;
  value: string;
  note: string;
  trend: string;
}) {
  return (
    <Card className="rounded-[28px] border border-border/70 bg-card ">
      <CardContent className="p-7">
        <div className="flex items-start justify-between gap-4">
          <p className="text-[15px] text-muted-foreground">{title}</p>
          <Badge variant="outline" className="rounded-full px-3 py-1 text-sm font-medium text-foreground">
            {trend}
          </Badge>
        </div>
        <p className="mt-5 text-5xl font-semibold tracking-tight text-foreground">{value}</p>
        <p className="mt-8 text-2xl font-medium tracking-tight text-foreground">{note}</p>
        <p className="mt-2 text-[15px] text-muted-foreground">Updated from live pharmacy data</p>
      </CardContent>
    </Card>
  );
}

function AreaLikeChart() {
  const max = Math.max(...chartPoints);
  const path = chartPoints
    .map((point, index) => {
      const x = (index / (chartPoints.length - 1)) * 100;
      const y = 100 - (point / max) * 75;
      return `${index === 0 ? "M" : "L"}${x},${y}`;
    })
    .join(" ");

  const softPath = chartPoints
    .map((point, index) => {
      const x = (index / (chartPoints.length - 1)) * 100;
      const y = 100 - (point / max) * 55;
      return `${index === 0 ? "M" : "L"}${x},${y}`;
    })
    .join(" ");

  return (
    <div className="relative mt-8 h-[420px] overflow-hidden rounded-[24px] border border-border/60 bg-[linear-gradient(180deg,#ffffff_0%,#fcfcfb_100%)] p-6">
      <div className="absolute inset-x-6 top-6 flex justify-end">
        <div className="inline-flex rounded-2xl border border-border/70 bg-background p-1 text-sm ">
          {["Last 3 months", "Last 30 days", "Last 7 days"].map((tab, index) => (
            <button
              key={tab}
              className={cn(
                "rounded-xl px-5 py-3 font-medium text-muted-foreground transition",
                index === 0 && "bg-muted text-foreground"
              )}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="absolute inset-x-10 bottom-16 top-24">
        <div className="absolute inset-0">
          {[0, 1, 2, 3].map((line) => (
            <div
              key={line}
              className="absolute left-0 right-0 border-t border-border/60"
              style={{ top: `${line * 25}%` }}
            />
          ))}
        </div>

        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
          <path d={`${softPath} L100,100 L0,100 Z`} fill="rgba(120,120,120,0.18)" />
          <path d={`${path} L100,100 L0,100 Z`} fill="rgba(120,120,120,0.35)" />
        </svg>
      </div>

      <div className="absolute inset-x-10 bottom-8 flex items-center justify-between text-sm text-muted-foreground">
        {["Apr 3", "Apr 9", "Apr 15", "Apr 21", "Apr 27", "May 3", "May 9", "May 15", "May 21", "May 28", "Jun 3", "Jun 9", "Jun 15", "Jun 21", "Jun 29"].map((label) => (
          <span key={label}>{label}</span>
        ))}
      </div>
    </div>
  );
}

export default async function Home() {
  const [dashboard, products, suppliers, sales, batches] = await Promise.all([
    fetchDashboardSummary(),
    fetchProducts(),
    fetchSuppliers(),
    fetchSales(),
    fetchBatches(),
  ]);

  const totalRevenue = sales.reduce((sum: number, sale: any) => sum + sale.netAmount, 0);

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,#ffffff_0%,#f8f8f6_45%,#f3f3f1_100%)] text-foreground">
      <div className="grid h-screen grid-cols-1 overflow-hidden border border-border/70 bg-background shadow-[0_20px_80px_rgba(0,0,0,0.05)] lg:grid-cols-[320px_1fr]">
        <aside className="h-full overflow-y-auto border-b border-border/70 bg-[#fbfbfa] px-5 py-6 lg:border-r lg:border-b-0">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full border border-foreground/20 bg-background">
                <div className="h-4 w-4 rounded-full border-2 border-foreground/80" />
              </div>
              <h1 className="text-[2rem] font-semibold tracking-tight">Demo Pharmacy</h1>
            </div>
          </div>

          <div className="mt-8 flex gap-3">
            <Button className="h-12 flex-1 justify-start rounded-2xl bg-[#171717] px-5 text-base text-white hover:bg-[#111111]">
              <Plus className="h-4 w-4" />
              Add Record
            </Button>
            <Button variant="outline" size="icon" className="h-12 w-12 rounded-2xl border-border/70 bg-background ">
              <Mail className="h-4 w-4" />
            </Button>
          </div>

          <nav className="mt-7">
            <div className="space-y-1">
              {primaryNav.map((item) => (
                <button
                  key={item.label}
                  className={cn(
                    "grid h-12 w-full grid-cols-[20px_1fr] items-center gap-x-3 rounded-2xl px-3 text-left text-[15px] transition",
                    item.active ? "bg-muted text-foreground" : "text-foreground/85 hover:bg-muted/60",
                  )}
                >
                  <item.icon className="h-4 w-4 justify-self-center" />
                  <span className="truncate">{item.label}</span>
                </button>
              ))}
            </div>
          </nav>

          <div className="mt-12">
            <p className="px-3 text-sm font-medium text-muted-foreground">Operations</p>
            <div className="mt-3 space-y-1">
              {documentNav.map((item) => (
                <button
                  key={item.label}
                  className="grid h-12 w-full grid-cols-[20px_1fr] items-center gap-x-3 rounded-2xl px-3 text-left text-[15px] text-foreground/85 transition hover:bg-muted/60"
                >
                  <item.icon className="h-4 w-4 justify-self-center" />
                  <span className="truncate">{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="mt-12 rounded-[28px] border border-border/70 bg-white p-4 ">
            <div className="flex items-center gap-3">
              <Avatar className="h-11 w-11 border border-border/60">
                <AvatarFallback className="bg-[#e0e7ff] text-sm font-semibold text-[#4338ca]">DP</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold">System Admin</p>
                <p className="text-sm text-muted-foreground">admin@demo.pharmacy</p>
              </div>
            </div>
          </div>
        </aside>

        <section className="h-full overflow-y-auto bg-[#fcfcfb]">
          <header className="flex items-center justify-between gap-4 border-b border-border/70 px-6 py-5 md:px-8">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon-sm" className="rounded-xl lg:hidden">
                <PanelLeft className="h-4 w-4" />
              </Button>
              <div className="flex items-center gap-3 border-l border-border pl-5">
                <h2 className="text-[2rem] font-semibold tracking-tight">Pharmacy Dashboard</h2>
              </div>
            </div>
            <Button variant="ghost" className="rounded-xl px-2 text-base font-medium">Live API</Button>
          </header>

          <div className="space-y-8 p-6 md:p-8">
            <section className="grid gap-5 xl:grid-cols-4">
              <MiniStatCard
                title="Net Sales"
                value={formatCurrency(totalRevenue || 0)}
                note="Sales recorded this period"
                trend="↗ Live"
              />
              <MiniStatCard
                title="Products"
                value={String(products.length)}
                note="Tracked in master catalog"
                trend="↗ Active"
              />
              <MiniStatCard
                title="Suppliers"
                value={String(suppliers.length)}
                note="Approved vendor records"
                trend="↗ Synced"
              />
              <MiniStatCard
                title="Low Stock"
                value={String(dashboard.totals.lowStock)}
                note="Items at reorder threshold"
                trend="⚠ Monitor"
              />
            </section>

            <section>
              <Card className="rounded-[32px] border border-border/70 bg-background ">
                <CardHeader className="pb-0">
                  <CardTitle className="text-[2rem] tracking-tight">Sales and Stock Activity</CardTitle>
                  <CardDescription className="text-lg">Backend-connected operational trend panel</CardDescription>
                </CardHeader>
                <CardContent>
                  <AreaLikeChart />
                </CardContent>
              </Card>
            </section>

            <section className="grid gap-5 xl:grid-cols-3">
              <Card className="rounded-[28px] border border-border/70 bg-card  xl:col-span-2">
                <CardHeader>
                  <CardTitle>Product master</CardTitle>
                  <CardDescription>Live product records from the backend service layer</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {products.slice(0, 4).map((product: any) => (
                    <div key={product.id} className="grid grid-cols-[1.2fr_1fr_auto] items-center gap-4 rounded-2xl border border-border/70 bg-white px-4 py-4">
                      <div>
                        <p className="font-semibold">{product.brandName}</p>
                        <p className="text-sm text-muted-foreground">{product.genericName} • {product.sku}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">{product.category}</p>
                        <p className="text-sm">Reorder: {product.reorderLevel}</p>
                      </div>
                      <Badge variant="outline" className="rounded-full px-3 py-1 text-sm">
                        {product.stockAvailable} in stock
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="rounded-[28px] border border-border/70 bg-card ">
                <CardHeader>
                  <CardTitle>Recent batches</CardTitle>
                  <CardDescription>Inventory intake and expiry visibility</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {batches.slice(0, 4).map((batch: any) => (
                    <div key={batch.batchNumber} className="rounded-2xl border border-border/70 bg-white px-4 py-4">
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="font-semibold">{batch.product}</p>
                          <p className="text-sm text-muted-foreground">{batch.batchNumber}</p>
                        </div>
                        <Badge variant="secondary" className="rounded-full px-3 py-1 text-sm">
                          {batch.quantityAvailable}
                        </Badge>
                      </div>
                      <p className="mt-3 text-sm text-muted-foreground">Expires {batch.expiryDate}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </section>
          </div>
        </section>
      </div>
    </main>
  );
}
