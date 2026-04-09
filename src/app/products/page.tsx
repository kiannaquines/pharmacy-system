import { PharmacyDataTable, DisabledCrudActions } from "@/components/pharmacy-data-table";
import { ProductCreateCard } from "@/components/pharmacy-forms";
import { PharmacyShell } from "@/components/pharmacy-shell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchProducts, fetchSuppliers } from "@/lib/api";
import { formatCurrency } from "@/lib/format";

export default async function ProductsPage() {
  const [products, suppliers] = await Promise.all([fetchProducts(), fetchSuppliers()]);

  return (
    <PharmacyShell title="Products" description="Manage the pharmacy product catalog as its own page module.">
      <div className="grid gap-5 xl:grid-cols-[420px_1fr]">
        <ProductCreateCard suppliers={suppliers} />
        <Card className="rounded-[28px] border border-border/70 bg-card">
          <CardHeader>
            <CardTitle>Product list</CardTitle>
            <CardDescription>Edit and delete will be enabled after backend update/delete routes are added.</CardDescription>
          </CardHeader>
          <CardContent>
            <PharmacyDataTable
              data={products}
              emptyMessage="No products found."
              columns={[
                {
                  key: "product",
                  header: "Product",
                  cell: (product: any) => (
                    <div>
                      <p className="font-semibold">{product.brandName}</p>
                      <p className="text-sm text-muted-foreground">{product.genericName} • {product.sku}</p>
                    </div>
                  ),
                },
                {
                  key: "category",
                  header: "Category",
                  cell: (product: any) => <span>{product.category}</span>,
                },
                {
                  key: "price",
                  header: "Price",
                  cell: (product: any) => <span>{formatCurrency(product.sellingPrice)}</span>,
                },
                {
                  key: "stock",
                  header: "Stock",
                  cell: (product: any) => <span>{product.stockAvailable}</span>,
                },
              ]}
              actions={() => <DisabledCrudActions />}
            />
          </CardContent>
        </Card>
      </div>
    </PharmacyShell>
  );
}
