import { ProductModuleClient } from "@/components/product-module-client";
import { PharmacyShell } from "@/components/pharmacy-shell";
import { fetchProducts, fetchSuppliers } from "@/lib/server-api";

export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  const [products, suppliers] = await Promise.all([
    fetchProducts(),
    fetchSuppliers(),
  ]);

  return (
    <PharmacyShell
      title="Products"
      description="Manage the pharmacy product catalog as its own page module."
    >
      <ProductModuleClient initialProducts={products} suppliers={suppliers} />
    </PharmacyShell>
  );
}
