import { PharmacyDataTable } from "@/components/pharmacy-data-table";
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
          <CardContent>
            <PharmacyDataTable
              data={batches}
              emptyMessage="No batches found."
              columns={[
                {
                  key: "product",
                  header: "Product",
                  cell: (batch: any) => (
                    <div>
                      <p className="font-semibold">{batch.product}</p>
                      <p className="text-sm text-muted-foreground">{batch.batchNumber}</p>
                    </div>
                  ),
                },
                { key: "supplier", header: "Supplier", cell: (batch: any) => <span>{batch.supplier}</span> },
                { key: "cost", header: "Cost", cell: (batch: any) => <span>{formatCurrency(batch.purchaseCost)}</span> },
                { key: "available", header: "Available", cell: (batch: any) => <span>{batch.quantityAvailable}</span> },
              ]}
            />
          </CardContent>
        </Card>
      </div>
    </PharmacyShell>
  );
}
