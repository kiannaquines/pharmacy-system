import { SalesModuleClient } from "@/components/sales-module-client";
import { PharmacyShell } from "@/components/pharmacy-shell";
import { fetchProducts, fetchSales } from "@/lib/api";

export default async function SalesPage() {
  const [sales, products] = await Promise.all([fetchSales(), fetchProducts()]);

  return (
    <PharmacyShell
      title="Sales"
      description="Sales recording and sales ledger in a dedicated page module."
    >
      <SalesModuleClient initialSales={sales} products={products} />
    </PharmacyShell>
  );
}
