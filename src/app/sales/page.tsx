import { SalesModuleClient } from "@/components/sales-module-client";
import { PharmacyShell } from "@/components/pharmacy-shell";
import { fetchProducts, fetchSales } from "@/lib/server-api";

export const dynamic = "force-dynamic";

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
