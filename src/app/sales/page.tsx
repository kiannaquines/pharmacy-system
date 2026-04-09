import { PharmacyDataTable } from "@/components/pharmacy-data-table";
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
          <CardContent>
            <PharmacyDataTable
              data={sales}
              emptyMessage="No sales found."
              columns={[
                { key: "saleNumber", header: "Sale", cell: (sale: any) => <span className="font-medium">{sale.saleNumber}</span> },
                { key: "saleDate", header: "Date", cell: (sale: any) => <span>{sale.saleDate}</span> },
                { key: "customerType", header: "Customer", cell: (sale: any) => <span>{sale.customerType}</span> },
                { key: "netAmount", header: "Net Amount", cell: (sale: any) => <span>{formatCurrency(sale.netAmount)}</span> },
              ]}
            />
          </CardContent>
        </Card>
      </div>
    </PharmacyShell>
  );
}
