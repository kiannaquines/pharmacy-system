import { PharmacyDataTable, DisabledCrudActions } from "@/components/pharmacy-data-table";
import { SupplierCreateCard } from "@/components/pharmacy-forms";
import { PharmacyShell } from "@/components/pharmacy-shell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchSuppliers } from "@/lib/api";

export default async function SuppliersPage() {
  const suppliers = await fetchSuppliers();

  return (
    <PharmacyShell title="Suppliers" description="Supplier management now lives on its own page module.">
      <div className="grid gap-5 xl:grid-cols-[420px_1fr]">
        <SupplierCreateCard />
        <Card className="rounded-[28px] border border-border/70 bg-card">
          <CardHeader>
            <CardTitle>Supplier list</CardTitle>
            <CardDescription>Live supplier records from the backend.</CardDescription>
          </CardHeader>
          <CardContent>
            <PharmacyDataTable
              data={suppliers}
              emptyMessage="No suppliers found."
              columns={[
                {
                  key: "name",
                  header: "Supplier",
                  cell: (supplier: any) => (
                    <div>
                      <p className="font-semibold">{supplier.name}</p>
                      <p className="text-sm text-muted-foreground">{supplier.contactPerson}</p>
                    </div>
                  ),
                },
                { key: "phone", header: "Phone", cell: (supplier: any) => <span>{supplier.phone}</span> },
                { key: "email", header: "Email", cell: (supplier: any) => <span>{supplier.email}</span> },
                { key: "status", header: "Status", cell: (supplier: any) => <span>{supplier.status}</span> },
              ]}
              actions={() => <DisabledCrudActions />}
            />
          </CardContent>
        </Card>
      </div>
    </PharmacyShell>
  );
}
