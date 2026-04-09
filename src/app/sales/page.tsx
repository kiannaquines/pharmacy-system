import { SaleCreateCard } from "@/components/pharmacy-forms";
import { PharmacyShell } from "@/components/pharmacy-shell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchProducts, fetchSales } from "@/lib/api";
import { formatCurrency } from "@/lib/format";

export default async function SalesPage() {
  const [sales, products] = await Promise.all([fetchSales(), fetchProducts()]);

  return (
    <PharmacyShell title="Sales" description="Sales recording and sales ledger in a dedicated page module.">
      <div className="grid gap-5 xl:grid-cols-[420px_1fr]">
        <SaleCreateCard products={products} />
        <Card className="rounded-[28px] border border-border/70 bg-card">
          <CardHeader>
            <CardTitle>Sales ledger</CardTitle>
            <CardDescription>Posted sale records from the backend.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {sales.map((sale: any) => (
              <div key={sale.saleNumber} className="flex items-center justify-between gap-4 rounded-2xl border border-border/70 bg-white px-4 py-4">
                <div>
                  <p className="font-semibold">{sale.saleNumber}</p>
                  <p className="text-sm text-muted-foreground">{sale.customerType} • {sale.saleDate}</p>
                </div>
                <span className="rounded-full border border-border px-3 py-1 text-sm">{formatCurrency(sale.netAmount)}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </PharmacyShell>
  );
}
