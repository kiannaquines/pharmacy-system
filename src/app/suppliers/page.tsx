import { SuppliersModuleClient } from "@/components/suppliers-module-client";
import { PharmacyShell } from "@/components/pharmacy-shell";
import { fetchSuppliers } from "@/lib/api";

export default async function SuppliersPage() {
  const suppliers = await fetchSuppliers();

  return (
    <PharmacyShell
      title="Suppliers"
      description="Supplier management now lives on its own page module."
    >
      <SuppliersModuleClient initialSuppliers={suppliers} />
    </PharmacyShell>
  );
}
