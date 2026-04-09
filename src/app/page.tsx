import {
  AlertTriangle,
  ArrowUpRight,
  Boxes,
  DollarSign,
  Package,
  Truck,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PharmacyShell } from "@/components/pharmacy-shell";
import { SalesChart } from "@/components/sales-chart";
import {
  fetchBatches,
  fetchDashboardSummary,
  fetchProducts,
  fetchSales,
  fetchSuppliers,
} from "@/lib/server-api";
import { formatCurrency } from "@/lib/format";

export const dynamic = "force-dynamic";

type StatCardProps = {
  title: string;
  value: string;
  note: string;
  trend: string;
  trendUp?: boolean;
  icon: React.ReactNode;
  iconBg: string;
};

function StatCard({
  title,
  value,
  note,
  trend,
  trendUp = true,
  icon,
  iconBg,
}: StatCardProps) {
  return (
    <Card className="border-0 shadow-none bg-card">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${iconBg}`}
          >
            {icon}
          </div>
          <Badge
            variant="outline"
            className={`mt-0.5 text-[10px] font-semibold uppercase tracking-wide ${trendUp ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-amber-200 bg-amber-50 text-amber-700"}`}
          >
            {trend}
          </Badge>
        </div>
        <p className="mt-4 text-3xl font-bold tracking-tight text-foreground">
          {value}
        </p>
        <p className="mt-0.5 text-sm font-medium text-foreground/70">{title}</p>
        <p className="mt-1 text-xs text-muted-foreground">{note}</p>
      </CardContent>
    </Card>
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

  const totalRevenue = sales.reduce(
    (sum: number, sale: any) => sum + sale.net_amount,
    0,
  );

  // Build chart data: group sales by date, last 30 entries
  const salesByDate = sales.reduce((acc: Record<string, number>, sale: any) => {
    const date = sale.sale_date?.slice(0, 10) ?? "Unknown";
    acc[date] = (acc[date] ?? 0) + (sale.net_amount ?? 0);
    return acc;
  }, {});
  const sortedDates = Object.keys(salesByDate).sort();
  const chartLabels = sortedDates.slice(-30);
  const chartValues = chartLabels.map((d) => salesByDate[d]);

  return (
    <PharmacyShell
      title="Dashboard"
      description="Live overview of pharmacy operations"
    >
      {/* Stat cards */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Net Revenue"
          value={formatCurrency(totalRevenue || 0)}
          note="From all recorded sales"
          trend="Live"
          trendUp={true}
          iconBg="bg-primary/10"
          icon={<DollarSign className="h-5 w-5 text-primary" />}
        />
        <StatCard
          title="Total Products"
          value={String(products.length)}
          note="Tracked in master catalog"
          trend="Active"
          trendUp={true}
          iconBg="bg-sky-100"
          icon={<Package className="h-5 w-5 text-sky-600" />}
        />
        <StatCard
          title="Suppliers"
          value={String(suppliers.length)}
          note="Approved vendor records"
          trend="Synced"
          trendUp={true}
          iconBg="bg-violet-100"
          icon={<Truck className="h-5 w-5 text-violet-600" />}
        />
        <StatCard
          title="Low Stock Items"
          value={String(dashboard.totals.lowStock)}
          note="At or below reorder level"
          trend="Monitor"
          trendUp={false}
          iconBg="bg-amber-100"
          icon={<AlertTriangle className="h-5 w-5 text-amber-600" />}
        />
      </section>

      {/* Chart + quick stats */}
      <section className="grid gap-4 xl:grid-cols-3">
        <Card className="border-0 bg-card shadow-none xl:col-span-2">
          <CardHeader className="pb-2">
            <div className="flex items-start justify-between gap-4">
              <div>
                <CardTitle className="text-base">Sales Activity</CardTitle>
                <CardDescription>
                  Revenue trend over the last 8 months
                </CardDescription>
              </div>
              <div className="flex items-center gap-1 rounded-lg border border-border bg-muted/50 p-0.5 text-xs">
                {["8M", "3M", "1M"].map((label, i) => (
                  <button
                    key={label}
                    className={`rounded-md px-3 py-1.5 font-medium transition-colors ${i === 0 ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <SalesChart labels={chartLabels} values={chartValues} />
          </CardContent>
        </Card>

        <Card className="border-0 shadow-none bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Inventory Snapshot</CardTitle>
            <CardDescription>Units across all batches</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total Batches</span>
                <span className="font-semibold">{batches.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total Units</span>
                <span className="font-semibold">
                  {batches
                    .reduce(
                      (s: number, b: any) => s + (b.quantity_available ?? 0),
                      0,
                    )
                    .toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total Sales</span>
                <span className="font-semibold">{sales.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Avg Sale</span>
                <span className="font-semibold">
                  {formatCurrency(
                    sales.length > 0 ? totalRevenue / sales.length : 0,
                  )}
                </span>
              </div>
            </div>
            <div className="pt-2">
              <div className="mb-1.5 flex justify-between text-xs text-muted-foreground">
                <span>Stock health</span>
                <span>
                  {Math.max(
                    0,
                    100 -
                      Math.round(
                        (dashboard.totals.lowStock /
                          Math.max(products.length, 1)) *
                          100,
                      ),
                  )}
                  %
                </span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary transition-all"
                  style={{
                    width: `${Math.max(0, 100 - Math.round((dashboard.totals.lowStock / Math.max(products.length, 1)) * 100))}%`,
                  }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Recent records */}
      <section className="grid gap-4 xl:grid-cols-3">
        <Card className="border-0 shadow-none bg-card xl:col-span-2">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base">Recent Products</CardTitle>
                <CardDescription>
                  Latest records from the catalog
                </CardDescription>
              </div>
              <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {products.slice(0, 5).map((product: any) => (
              <div
                key={product.id}
                className="flex items-center gap-3 rounded-lg border border-border/60 bg-muted/20 px-3 py-2.5"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary/10 text-[10px] font-bold text-primary">
                  {(product as any).brand_name?.slice(0, 2).toUpperCase() ??
                    "RX"}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">
                    {(product as any).brand_name}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {(product as any).generic_name} · {(product as any).sku}
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-sm font-semibold">
                    {formatCurrency((product as any).selling_price)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Qty {(product as any).stock_available}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-0 shadow-none bg-card">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base">Recent Batches</CardTitle>
                <CardDescription>Latest intake records</CardDescription>
              </div>
              <Boxes className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {batches.slice(0, 5).map((batch: any) => (
              <div
                key={(batch as any).batch_number ?? (batch as any).id}
                className="rounded-lg border border-border/60 bg-muted/20 px-3 py-2.5"
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate text-sm font-medium">
                    {(batch as any).product_name}
                  </p>
                  <span className="shrink-0 rounded-full border border-border px-2 py-0.5 text-[10px] font-semibold">
                    {(batch as any).quantity_available} units
                  </span>
                </div>
                <div className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="truncate">
                    {(batch as any).batch_number}
                  </span>
                  <span>·</span>
                  <span className="shrink-0">
                    Exp {(batch as any).expiry_date}
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
    </PharmacyShell>
  );
}
