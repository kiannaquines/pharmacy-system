import { fetchBatches, fetchDashboardSummary, fetchProducts, fetchSales, fetchSuppliers } from "@/lib/api";
import { PharmacyDashboardClient } from "@/components/pharmacy-dashboard-client";

export default async function Home() {
  const [dashboard, products, suppliers, sales, batches] = await Promise.all([
    fetchDashboardSummary(),
    fetchProducts(),
    fetchSuppliers(),
    fetchSales(),
    fetchBatches(),
  ]);

  return (
    <PharmacyDashboardClient
      initialDashboard={dashboard}
      initialProducts={products}
      initialSuppliers={suppliers}
      initialSales={sales}
      initialBatches={batches}
    />
  );
}
