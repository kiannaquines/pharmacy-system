import { AlertTriangle, Boxes, ChartColumn, PackageSearch, ShoppingCart, Truck } from "lucide-react";

import { SectionCard } from "@/components/section-card";
import { StatusBadge } from "@/components/status-badge";
import { SummaryCard } from "@/components/summary-card";
import { fetchBatches, fetchDashboardSummary, fetchProducts, fetchSales, fetchSuppliers } from "@/lib/api";
import { formatCurrency } from "@/lib/format";

const quickLinks = [
  { label: "Add supplier", icon: Truck },
  { label: "Add product", icon: PackageSearch },
  { label: "Receive stock", icon: Boxes },
  { label: "Record sale", icon: ShoppingCart },
  { label: "View reports", icon: ChartColumn },
  { label: "Expiry alerts", icon: AlertTriangle },
];

export default async function Home() {
  const [dashboard, suppliers, products, batches, sales] = await Promise.all([
    fetchDashboardSummary(),
    fetchSuppliers(),
    fetchProducts(),
    fetchBatches(),
    fetchSales(),
  ]);

  const summaryCards = [
    {
      label: "Total products",
      value: String(dashboard.totals.products),
      helper: "Tracked in the product master",
    },
    {
      label: "Suppliers",
      value: String(dashboard.totals.suppliers),
      helper: "Active vendors in the registry",
    },
    {
      label: "Low stock",
      value: String(dashboard.totals.lowStock),
      helper: "At or below reorder level",
    },
    {
      label: "Near expiry",
      value: String(dashboard.totals.nearExpiry),
      helper: "Needs review soon",
    },
  ];

  return (
    <main className="min-h-screen bg-slate-100 text-slate-900">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-6 py-8 lg:px-8">
        <header className="rounded-3xl bg-slate-900 px-8 py-10 text-white shadow-lg">
          <p className="text-sm font-medium uppercase tracking-[0.3em] text-sky-300">
            Pharmacy inventory SaaS
          </p>
          <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <h1 className="text-4xl font-semibold tracking-tight">
                Inventory, sales, expiry, and reorder monitoring in one dashboard.
              </h1>
              <p className="mt-3 text-base leading-7 text-slate-300">
                This implementation now reads live data from the backend and shows supplier, product,
                stock batch, and sales summaries for a pharmacy operation.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {quickLinks.map(({ label, icon: Icon }) => (
                <button
                  key={label}
                  className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-left text-sm font-medium text-white transition hover:bg-white/10"
                >
                  <Icon className="h-4 w-4 text-sky-300" />
                  <span>{label}</span>
                </button>
              ))}
            </div>
          </div>
        </header>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {summaryCards.map((card) => (
            <SummaryCard key={card.label} {...card} />
          ))}
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <SectionCard
            title="Product master"
            description="Search-ready product catalog with brand and generic naming, stock levels, and reorder points."
          >
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-left text-slate-500">
                    <th className="px-3 py-3 font-medium">Product</th>
                    <th className="px-3 py-3 font-medium">Category</th>
                    <th className="px-3 py-3 font-medium">Price</th>
                    <th className="px-3 py-3 font-medium">Stock</th>
                    <th className="px-3 py-3 font-medium">Reorder</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product: any) => (
                    <tr key={product.id} className="border-b border-slate-100 last:border-none">
                      <td className="px-3 py-3">
                        <p className="font-medium text-slate-900">{product.brandName}</p>
                        <p className="text-slate-500">
                          {product.genericName} • {product.sku}
                        </p>
                      </td>
                      <td className="px-3 py-3 text-slate-600">{product.category}</td>
                      <td className="px-3 py-3 text-slate-600">{formatCurrency(product.sellingPrice)}</td>
                      <td className="px-3 py-3 text-slate-600">{product.stockAvailable}</td>
                      <td className="px-3 py-3 text-slate-600">{product.reorderLevel}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </SectionCard>

          <SectionCard
            title="Supplier registry"
            description="Approved vendors and active supplier touchpoints for restocking and returns."
          >
            <div className="space-y-4">
              {suppliers.map((supplier: any) => (
                <div key={supplier.id} className="rounded-2xl border border-slate-200 p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-medium text-slate-900">{supplier.name}</p>
                      <p className="mt-1 text-sm text-slate-500">{supplier.contactPerson}</p>
                    </div>
                    <StatusBadge value={supplier.status} />
                  </div>
                  <div className="mt-3 space-y-1 text-sm text-slate-600">
                    <p>{supplier.phone}</p>
                    <p>{supplier.email}</p>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>
        </section>

        <section className="grid gap-6 xl:grid-cols-2">
          <SectionCard
            title="Batch inventory"
            description="Batch-level stock positions with expiry dates for FEFO handling and return tracing."
          >
            <div className="space-y-4">
              {batches.map((batch: any) => (
                <div key={batch.batchNumber} className="rounded-2xl border border-slate-200 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="font-medium text-slate-900">{batch.product}</p>
                      <p className="text-sm text-slate-500">{batch.batchNumber}</p>
                    </div>
                    <div className="rounded-full bg-rose-50 px-3 py-1 text-sm font-medium text-rose-700">
                      Expires {batch.expiryDate}
                    </div>
                  </div>
                  <div className="mt-4 grid gap-3 text-sm text-slate-600 sm:grid-cols-3">
                    <p>Received: {batch.quantityReceived}</p>
                    <p>Available: {batch.quantityAvailable}</p>
                    <p>Cost: {formatCurrency(batch.purchaseCost)}</p>
                  </div>
                  <p className="mt-3 text-sm text-slate-500">Supplier: {batch.supplier}</p>
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard
            title="Daily sales snapshot"
            description="Manual sales encoding summary with discount visibility and net sales totals."
          >
            <div className="space-y-4">
              {sales.map((sale: any) => (
                <div key={sale.saleNumber} className="rounded-2xl border border-slate-200 p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-medium text-slate-900">{sale.saleNumber}</p>
                      <p className="text-sm text-slate-500">{sale.saleDate}</p>
                    </div>
                    <div className="rounded-full bg-sky-50 px-3 py-1 text-sm font-medium capitalize text-sky-700">
                      {sale.customerType}
                    </div>
                  </div>
                  <div className="mt-4 grid gap-3 text-sm text-slate-600 sm:grid-cols-4">
                    <p>Items: {sale.items}</p>
                    <p>Gross: {formatCurrency(sale.grossAmount)}</p>
                    <p>Discount: {formatCurrency(sale.discountAmount)}</p>
                    <p>Net: {formatCurrency(sale.netAmount)}</p>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>
        </section>
      </div>
    </main>
  );
}
