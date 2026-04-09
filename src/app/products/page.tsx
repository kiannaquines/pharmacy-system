import { ProductCreateCard } from "@/components/pharmacy-forms";
import { PharmacyShell } from "@/components/pharmacy-shell";
import { Button } from "@/components/ui/button";
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
          <CardContent className="space-y-3">
            {products.map((product: any) => (
              <div key={product.id} className="grid grid-cols-[1.2fr_1fr_auto] items-center gap-4 rounded-2xl border border-border/70 bg-white px-4 py-4">
                <div>
                  <p className="font-semibold">{product.brandName}</p>
                  <p className="text-sm text-muted-foreground">{product.genericName} • {product.sku}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{product.category}</p>
                  <p className="text-sm">{formatCurrency(product.sellingPrice)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="rounded-full border border-border px-3 py-1 text-sm">{product.stockAvailable} stock</span>
                  <Button variant="outline" size="sm" disabled>Edit</Button>
                  <Button variant="outline" size="sm" disabled>Delete</Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </PharmacyShell>
  );
}
