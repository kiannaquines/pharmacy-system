import { BatchCreateCard } from "@/components/pharmacy-forms";
import { PharmacyShell } from "@/components/pharmacy-shell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchBatches, fetchProducts, fetchSuppliers } from "@/lib/api";
import { formatCurrency } from "@/lib/format";

export default async function InventoryPage() {
  const [batches, products, suppliers] = await Promise.all([fetchBatches(), fetchProducts(), fetchSuppliers()]);

  return (
    <PharmacyShell title="Inventory" description="Batch intake and stock visibility as a dedicated page module.">
      <div className="grid gap-5 xl:grid-cols-[420px_1fr]">
        <BatchCreateCard suppliers={suppliers} products={products} />
        <Card className="rounded-[28px] border border-border/70 bg-card">
          <CardHeader>
            <CardTitle>Batch ledger</CardTitle>
            <CardDescription>Stock batches tracked from the live backend service.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {batches.map((batch: any) => (
              <div key={batch.batchNumber} className="grid grid-cols-[1.2fr_1fr_auto] items-center gap-4 rounded-2xl border border-border/70 bg-white px-4 py-4">
                <div>
                  <p className="font-semibold">{batch.product}</p>
                  <p className="text-sm text-muted-foreground">{batch.batchNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Supplier: {batch.supplier}</p>
                  <p className="text-sm">Cost: {formatCurrency(batch.purchaseCost)}</p>
                </div>
                <span className="rounded-full border border-border px-3 py-1 text-sm">{batch.quantityAvailable} available</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </PharmacyShell>
  );
}
