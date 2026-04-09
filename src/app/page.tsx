import {
  Bell,
  ChevronRight,
  CirclePlus,
  FolderKanban,
  LayoutGrid,
  MoreHorizontal,
  Package,
  Pill,
  Search,
  Settings2,
  ShoppingCart,
  SlidersHorizontal,
  TrendingUp,
  Truck,
  Users,
} from "lucide-react";

import { fetchBatches, fetchDashboardSummary, fetchProducts, fetchSales, fetchSuppliers } from "@/lib/api";
import { formatCurrency } from "@/lib/format";

const navItems = [
  { label: "Dashboard", icon: LayoutGrid },
  { label: "Products", icon: Pill, active: true },
  { label: "Inventory", icon: Package },
  { label: "Sales", icon: ShoppingCart },
  { label: "Suppliers", icon: Truck },
  { label: "Users", icon: Users },
  { label: "Reports", icon: TrendingUp },
  { label: "Settings", icon: Settings2 },
];

export default async function Home() {
  const [dashboard, suppliers, products, batches, sales] = await Promise.all([
    fetchDashboardSummary(),
    fetchSuppliers(),
    fetchProducts(),
    fetchBatches(),
    fetchSales(),
  ]);

  const totalStockValue = products.reduce(
    (sum: number, product: any) => sum + product.stockAvailable * product.sellingPrice,
    0,
  );

  return (
    <main className="min-h-screen bg-[#f5f3ef] p-4 text-[#1c1b18] md:p-6">
      <div className="mx-auto flex min-h-[calc(100vh-2rem)] max-w-[1600px] overflow-hidden rounded-[32px] border border-black/5 bg-[#fbfaf7] shadow-[0_30px_80px_rgba(46,39,28,0.08)]">
        <aside className="hidden w-[280px] flex-col border-r border-black/5 bg-[#f8f6f2] p-5 lg:flex">
          <div className="flex items-center gap-3 px-2">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#161616] text-white shadow-sm">
              <Pill className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xl font-semibold tracking-tight">Pharmy</p>
              <p className="text-sm text-black/45">Admin panel</p>
            </div>
          </div>

          <div className="mt-6 flex items-center gap-3 rounded-2xl border border-black/6 bg-white px-4 py-3 shadow-sm">
            <Search className="h-4 w-4 text-black/35" />
            <span className="text-sm text-black/40">Search products, sales, batches...</span>
            <span className="ml-auto rounded-lg border border-black/8 px-2 py-0.5 text-xs text-black/35">
              ⌘F
            </span>
          </div>

          <nav className="mt-6 space-y-1.5">
            {navItems.map(({ label, icon: Icon, active }) => (
              <button
                key={label}
                className={active
                  ? "flex w-full items-center gap-3 rounded-2xl border border-black/8 bg-white px-4 py-3 text-left text-sm font-semibold text-black shadow-sm"
                  : "flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-medium text-black/65 transition hover:bg-white/70"}
              >
                <Icon className="h-4 w-4" />
                <span>{label}</span>
              </button>
            ))}
          </nav>

          <div className="mt-6 rounded-[26px] border border-black/6 bg-white p-4 shadow-sm">
            <p className="text-sm font-semibold">System overview</p>
            <p className="mt-1 text-sm text-black/45">Inventory is connected to live backend data.</p>
            <div className="mt-4 grid grid-cols-4 gap-2">
              {Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="h-10 rounded-2xl bg-[#f3efe7]" />
              ))}
            </div>
            <button className="mt-4 flex w-full items-center justify-center rounded-2xl bg-[#f55b43] px-4 py-3 text-sm font-semibold text-white shadow-[0_8px_24px_rgba(245,91,67,0.35)]">
              Open inventory workspace
            </button>
          </div>

          <div className="mt-auto rounded-[26px] border border-black/6 bg-white p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#ffe1d8] text-sm font-semibold text-[#d24d36]">
                AD
              </div>
              <div>
                <p className="font-semibold">System Administrator</p>
                <p className="text-sm text-black/45">admin@demo.pharmacy</p>
              </div>
            </div>
          </div>
        </aside>

        <section className="flex-1 bg-[#fcfbf8] p-4 md:p-6 xl:p-8">
          <div className="rounded-[28px] border border-black/5 bg-[#fffdf9] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)] md:p-7">
            <header className="flex flex-col gap-4 border-b border-black/6 pb-6 xl:flex-row xl:items-start xl:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2 text-sm text-black/40">
                  <span>Dashboard</span>
                  <ChevronRight className="h-4 w-4" />
                  <span>Inventory</span>
                  <ChevronRight className="h-4 w-4" />
                  <span className="text-black/70">Pharmacy operations</span>
                </div>
                <div className="mt-5 flex items-start gap-4">
                  <div className="flex h-20 w-20 items-center justify-center rounded-[24px] bg-[linear-gradient(180deg,#5b5b58,#2e2e2b)] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.18),0_20px_40px_rgba(0,0,0,0.12)]">
                    <FolderKanban className="h-9 w-9" />
                  </div>
                  <div>
                    <h1 className="text-4xl font-semibold tracking-tight text-[#1d1c19]">
                      Pharmacy Inventory Control Center
                    </h1>
                    <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
                      <span className="rounded-full border border-[#f0dcc4] bg-[#fff2e2] px-3 py-1.5 font-medium text-[#996640]">
                        Live backend connected
                      </span>
                      <span className="rounded-full border border-black/6 bg-white px-3 py-1.5 text-black/60">
                        Demo Pharmacy
                      </span>
                      <span className="text-black/40">Updated just now</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 xl:justify-end">
                <button className="inline-flex h-11 items-center gap-2 rounded-2xl border border-black/8 bg-white px-4 text-sm font-medium text-black/70 shadow-sm">
                  <SlidersHorizontal className="h-4 w-4" />
                  Manage
                </button>
                <button className="inline-flex h-11 items-center gap-2 rounded-2xl border border-black/8 bg-white px-4 text-sm font-medium text-black/70 shadow-sm">
                  <Bell className="h-4 w-4" />
                  Alerts
                </button>
                <button className="inline-flex h-11 items-center justify-center rounded-2xl border border-black/8 bg-white px-3 text-black/60 shadow-sm">
                  <MoreHorizontal className="h-4 w-4" />
                </button>
              </div>
            </header>

            <section className="mt-6 grid gap-4 xl:grid-cols-[1.5fr_0.8fr]">
              <div className="rounded-[28px] border border-black/6 bg-white p-5 shadow-sm md:p-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div>
                    <h2 className="text-2xl font-semibold tracking-tight">Consolidated performance</h2>
                    <p className="mt-1 text-sm text-black/45">
                      Sales, stock exposure, low inventory pressure, and expiry watch in one view.
                    </p>
                  </div>
                  <div className="inline-flex rounded-2xl border border-black/6 bg-[#faf8f4] p-1 text-sm">
                    {['D', 'W', 'M', 'Y', 'All'].map((tab) => (
                      <span
                        key={tab}
                        className={tab === 'All'
                          ? 'rounded-xl bg-white px-3 py-1.5 font-semibold text-black shadow-sm'
                          : 'px-3 py-1.5 text-black/40'}
                      >
                        {tab}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-6 grid gap-4 md:grid-cols-3">
                  <div className="rounded-[24px] bg-[#f4fbfe] p-4">
                    <p className="text-sm text-black/45">Net sales</p>
                    <p className="mt-3 text-3xl font-semibold text-[#1380a8]">
                      {formatCurrency(dashboard.sales.daily)}
                    </p>
                    <p className="mt-2 text-sm text-[#1380a8]">+24.8% vs previous day</p>
                  </div>
                  <div className="rounded-[24px] bg-[#fff5f3] p-4">
                    <p className="text-sm text-black/45">Stock value</p>
                    <p className="mt-3 text-3xl font-semibold text-[#e36a58]">
                      {formatCurrency(totalStockValue)}
                    </p>
                    <p className="mt-2 text-sm text-[#e36a58]">Current on-hand valuation</p>
                  </div>
                  <div className="rounded-[24px] bg-[#f7f7f2] p-4">
                    <p className="text-sm text-black/45">Near expiry batches</p>
                    <p className="mt-3 text-3xl font-semibold text-[#2d2a24]">{dashboard.totals.nearExpiry}</p>
                    <p className="mt-2 text-sm text-black/45">Requires review this month</p>
                  </div>
                </div>

                <div className="mt-6 rounded-[26px] border border-dashed border-black/8 bg-[linear-gradient(180deg,#fbfdff_0%,#fff7f5_100%)] p-5">
                  <div className="flex h-[280px] items-end gap-3 overflow-hidden rounded-[22px] bg-[radial-gradient(circle_at_top,#ddeff5_0%,transparent_45%),linear-gradient(180deg,#ffffff_0%,#fcfaf7_100%)] px-3 pb-4 pt-10">
                    {[52, 58, 55, 67, 62, 72, 68, 74, 70, 77, 79, 84].map((height, index) => (
                      <div key={index} className="flex flex-1 items-end gap-2">
                        <div
                          className="w-1/2 rounded-t-full bg-[#1f98be]/90"
                          style={{ height: `${height * 2.1}px` }}
                        />
                        <div
                          className="w-1/2 rounded-t-full bg-[#ff7f6f]/90"
                          style={{ height: `${Math.max(height - 18, 22) * 1.8}px` }}
                        />
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-black/45">
                    <div className="flex items-center gap-5">
                      <span className="inline-flex items-center gap-2">
                        <span className="h-2.5 w-2.5 rounded-full bg-[#1f98be]" /> Sales
                      </span>
                      <span className="inline-flex items-center gap-2">
                        <span className="h-2.5 w-2.5 rounded-full bg-[#ff7f6f]" /> Stock pressure
                      </span>
                    </div>
                    <span>Live visual inspired by your reference, adapted for pharmacy operations.</span>
                  </div>
                </div>
              </div>

              <div className="grid gap-4">
                {[
                  { label: "Products", value: dashboard.totals.products, tone: "bg-[#f5fbff] text-[#0f84a8]" },
                  { label: "Suppliers", value: dashboard.totals.suppliers, tone: "bg-[#fff8f3] text-[#d36d48]" },
                  { label: "Low stock", value: dashboard.totals.lowStock, tone: "bg-[#fff2f0] text-[#e15444]" },
                  { label: "Sales today", value: sales.length, tone: "bg-[#f7f6ef] text-[#4c4a3f]" },
                ].map((item) => (
                  <div key={item.label} className="rounded-[24px] border border-black/6 bg-white p-5 shadow-sm">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm text-black/45">{item.label}</p>
                        <p className="mt-3 text-3xl font-semibold">{item.value}</p>
                      </div>
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${item.tone}`}>
                        Live
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="mt-6 rounded-[28px] border border-black/6 bg-white p-5 shadow-sm md:p-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-2xl font-semibold tracking-tight">Operations workspace</h2>
                  <p className="mt-1 text-sm text-black/45">
                    Product control, supplier contacts, batch inventory, and sales activity.
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <button className="inline-flex h-11 items-center gap-2 rounded-2xl border border-black/8 bg-white px-4 text-sm font-medium shadow-sm">
                    <Search className="h-4 w-4" /> Search
                  </button>
                  <button className="inline-flex h-11 items-center gap-2 rounded-2xl border border-black/8 bg-white px-4 text-sm font-medium shadow-sm">
                    <SlidersHorizontal className="h-4 w-4" /> Filter
                  </button>
                  <button className="inline-flex h-11 items-center gap-2 rounded-2xl bg-[linear-gradient(180deg,#ff785f,#ef4f43)] px-5 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(239,79,67,0.35)]">
                    <CirclePlus className="h-4 w-4" /> Add new
                  </button>
                </div>
              </div>

              <div className="mt-6 grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
                <div className="overflow-hidden rounded-[24px] border border-black/6">
                  <table className="min-w-full bg-white text-sm">
                    <thead className="bg-[#fbf8f2] text-left text-black/45">
                      <tr>
                        <th className="px-5 py-4 font-medium">SKU</th>
                        <th className="px-5 py-4 font-medium">Product</th>
                        <th className="px-5 py-4 font-medium">Category</th>
                        <th className="px-5 py-4 font-medium">Stock</th>
                        <th className="px-5 py-4 font-medium">Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((product: any) => (
                        <tr key={product.id} className="border-t border-black/6 text-[#24221f]">
                          <td className="px-5 py-4 font-medium text-black/45">{product.sku}</td>
                          <td className="px-5 py-4">
                            <div>
                              <p className="font-semibold">{product.brandName}</p>
                              <p className="text-black/45">{product.genericName}</p>
                            </div>
                          </td>
                          <td className="px-5 py-4">{product.category}</td>
                          <td className="px-5 py-4">
                            <span className={product.stockAvailable <= product.reorderLevel
                              ? "rounded-full bg-[#fff0ec] px-3 py-1 text-xs font-semibold text-[#e25f4a]"
                              : "rounded-full bg-[#eef9f9] px-3 py-1 text-xs font-semibold text-[#1380a8]"}>
                              {product.stockAvailable} units
                            </span>
                          </td>
                          <td className="px-5 py-4 font-semibold">{formatCurrency(product.sellingPrice)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="space-y-4">
                  <div className="rounded-[24px] border border-black/6 bg-[#fcfaf6] p-5">
                    <h3 className="text-lg font-semibold">Supplier registry</h3>
                    <div className="mt-4 space-y-3">
                      {suppliers.map((supplier: any) => (
                        <div key={supplier.id} className="rounded-2xl border border-black/6 bg-white p-4 shadow-sm">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="font-semibold">{supplier.name}</p>
                              <p className="mt-1 text-sm text-black/45">{supplier.contactPerson}</p>
                            </div>
                            <span className="rounded-full bg-[#eef9f9] px-3 py-1 text-xs font-semibold text-[#1380a8] capitalize">
                              {supplier.status}
                            </span>
                          </div>
                          <p className="mt-3 text-sm text-black/55">{supplier.email}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-[24px] border border-black/6 bg-[#fff8f5] p-5">
                    <h3 className="text-lg font-semibold">Batch watchlist</h3>
                    <div className="mt-4 space-y-3">
                      {batches.map((batch: any) => (
                        <div key={batch.batchNumber} className="rounded-2xl border border-[#f3dfd8] bg-white/80 p-4">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="font-semibold">{batch.product}</p>
                              <p className="text-sm text-black/45">{batch.batchNumber}</p>
                            </div>
                            <span className="rounded-full bg-[#fff0ec] px-3 py-1 text-xs font-semibold text-[#e25f4a]">
                              {batch.expiryDate}
                            </span>
                          </div>
                          <div className="mt-3 flex items-center justify-between text-sm text-black/55">
                            <span>Available: {batch.quantityAvailable}</span>
                            <span>{formatCurrency(batch.purchaseCost)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 overflow-hidden rounded-[24px] border border-black/6">
                <table className="min-w-full bg-white text-sm">
                  <thead className="bg-[#fbf8f2] text-left text-black/45">
                    <tr>
                      <th className="px-5 py-4 font-medium">Sale no.</th>
                      <th className="px-5 py-4 font-medium">Date</th>
                      <th className="px-5 py-4 font-medium">Customer type</th>
                      <th className="px-5 py-4 font-medium">Discount</th>
                      <th className="px-5 py-4 font-medium">Net amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sales.map((sale: any) => (
                      <tr key={sale.saleNumber} className="border-t border-black/6 text-[#24221f]">
                        <td className="px-5 py-4 font-semibold">{sale.saleNumber}</td>
                        <td className="px-5 py-4 text-black/55">{sale.saleDate}</td>
                        <td className="px-5 py-4">
                          <span className="rounded-full bg-[#f4f7fb] px-3 py-1 text-xs font-semibold capitalize text-[#516174]">
                            {sale.customerType}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-[#e25f4a]">{formatCurrency(sale.discountAmount)}</td>
                        <td className="px-5 py-4 font-semibold">{formatCurrency(sale.netAmount)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        </section>
      </div>
    </main>
  );
}
