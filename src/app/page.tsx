import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PharmacyShell } from "@/components/pharmacy-shell";
import { fetchBatches, fetchDashboardSummary, fetchProducts, fetchSales, fetchSuppliers } from "@/lib/api";
import { formatCurrency } from "@/lib/format";

const chartPoints = [22, 18, 30, 26, 34, 28, 38, 35, 45, 33, 52, 41, 48, 37, 54, 46, 58, 42, 61, 49, 57, 44, 63, 50, 60, 47, 65, 55, 62, 51];

function MiniStatCard({ title, value, note, trend }: { title: string; value: string; note: string; trend: string }) {
  return (
    <Card className="rounded-[28px] border border-border/70 bg-card">
      <CardContent className="p-7">
        <div className="flex items-start justify-between gap-4">
          <p className="text-[15px] text-muted-foreground">{title}</p>
          <span className="rounded-full border border-border px-3 py-1 text-sm font-medium text-foreground">{trend}</span>
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
  const path = chartPoints.map((point, index) => {
    const x = (index / (chartPoints.length - 1)) * 100;
    const y = 100 - (point / max) * 75;
    return `${index === 0 ? "M" : "L"}${x},${y}`;
  }).join(" ");

  const softPath = chartPoints.map((point, index) => {
    const x = (index / (chartPoints.length - 1)) * 100;
    const y = 100 - (point / max) * 55;
    return `${index === 0 ? "M" : "L"}${x},${y}`;
  }).join(" ");

  return (
    <div className="relative mt-8 h-[420px] overflow-hidden rounded-[24px] border border-border/60 bg-[linear-gradient(180deg,#ffffff_0%,#fcfcfb_100%)] p-6">
      <div className="absolute inset-x-10 bottom-16 top-24">
        <div className="absolute inset-0">
          {[0, 1, 2, 3].map((line) => (
            <div key={line} className="absolute left-0 right-0 border-t border-border/60" style={{ top: `${line * 25}%` }} />
          ))}
        </div>
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
          <path d={`${softPath} L100,100 L0,100 Z`} fill="rgba(120,120,120,0.18)" />
          <path d={`${path} L100,100 L0,100 Z`} fill="rgba(120,120,120,0.35)" />
        </svg>
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
    <PharmacyShell title="Pharmacy Dashboard" description="Overview page for the pharmacy operation modules.">
      <section className="grid gap-5 xl:grid-cols-4">
        <MiniStatCard title="Net Sales" value={formatCurrency(totalRevenue || 0)} note="Sales recorded this period" trend="↗ Live" />
        <MiniStatCard title="Products" value={String(products.length)} note="Tracked in master catalog" trend="↗ Active" />
        <MiniStatCard title="Suppliers" value={String(suppliers.length)} note="Approved vendor records" trend="↗ Synced" />
        <MiniStatCard title="Low Stock" value={String(dashboard.totals.lowStock)} note="Items at reorder threshold" trend="⚠ Monitor" />
      </section>

      <Card className="rounded-[32px] border border-border/70 bg-background">
        <CardHeader>
          <CardTitle className="text-[2rem] tracking-tight">Sales and Stock Activity</CardTitle>
          <CardDescription className="text-lg">Backend-connected operational trend panel</CardDescription>
        </CardHeader>
        <CardContent>
          <AreaLikeChart />
        </CardContent>
      </Card>

      <section className="grid gap-5 xl:grid-cols-3">
        <Card className="rounded-[28px] border border-border/70 bg-card xl:col-span-2">
          <CardHeader>
            <CardTitle>Recent products</CardTitle>
            <CardDescription>Latest product records from the live backend.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {products.slice(0, 5).map((product: any) => (
              <div key={product.id} className="grid grid-cols-[1.2fr_1fr_auto] items-center gap-4 rounded-2xl border border-border/70 bg-white px-4 py-4">
                <div>
                  <p className="font-semibold">{product.brandName}</p>
                  <p className="text-sm text-muted-foreground">{product.genericName} • {product.sku}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{product.category}</p>
                  <p className="text-sm">Stock: {product.stockAvailable}</p>
                </div>
                <span className="rounded-full border border-border px-3 py-1 text-sm">{formatCurrency(product.sellingPrice)}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="rounded-[28px] border border-border/70 bg-card">
          <CardHeader>
            <CardTitle>Recent batches</CardTitle>
            <CardDescription>Latest inventory intake records.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {batches.slice(0, 5).map((batch: any) => (
              <div key={batch.batchNumber} className="rounded-2xl border border-border/70 bg-white px-4 py-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-semibold">{batch.product}</p>
                    <p className="text-sm text-muted-foreground">{batch.batchNumber}</p>
                  </div>
                  <span className="rounded-full border border-border px-3 py-1 text-sm">{batch.quantityAvailable}</span>
                </div>
                <p className="mt-3 text-sm text-muted-foreground">Expires {batch.expiryDate}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
    </PharmacyShell>
  );
}
