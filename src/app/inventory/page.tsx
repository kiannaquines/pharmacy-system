import { InventoryModuleClient } from "@/components/inventory-module-client";
import { PharmacyShell } from "@/components/pharmacy-shell";
import { fetchBatches, fetchProducts, fetchSuppliers } from "@/lib/api";

export default async function InventoryPage() {
  const [batches, products, suppliers] = await Promise.all([
    fetchBatches(),
    fetchProducts(),
    fetchSuppliers(),
  ]);

  return (
    <PharmacyShell
      title="Inventory"
      description="Batch intake and stock visibility as a dedicated page module."
    >
      <InventoryModuleClient
        initialBatches={batches}
        products={products}
        suppliers={suppliers}
      />
    </PharmacyShell>
  );
}
