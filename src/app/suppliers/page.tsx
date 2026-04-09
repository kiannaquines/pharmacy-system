import { SupplierCreateCard } from "@/components/pharmacy-forms";
import { PharmacyShell } from "@/components/pharmacy-shell";
import { Button } from "@/components/ui/button";
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
          <CardContent className="space-y-3">
            {suppliers.map((supplier: any) => (
              <div key={supplier.id} className="flex items-center justify-between gap-4 rounded-2xl border border-border/70 bg-white px-4 py-4">
                <div>
                  <p className="font-semibold">{supplier.name}</p>
                  <p className="text-sm text-muted-foreground">{supplier.contactPerson} • {supplier.phone}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="rounded-full border border-border px-3 py-1 text-sm">{supplier.status}</span>
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
