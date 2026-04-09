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

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { fetchBatches, fetchDashboardSummary, fetchProducts, fetchSales, fetchSuppliers } from "@/lib/api";
import { cn } from "@/lib/utils";
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
    <main className="min-h-screen bg-[linear-gradient(180deg,#f8f6f2_0%,#f2efe8_100%)] p-4 text-foreground md:p-6">
      <div className="mx-auto flex min-h-[calc(100vh-2rem)] max-w-[1600px] overflow-hidden rounded-[32px] border border-border/60 bg-[#fbfaf7] shadow-[0_30px_80px_rgba(46,39,28,0.08)]">
        <aside className="hidden w-[290px] flex-col border-r border-border/60 bg-[#f8f6f2] p-5 lg:flex">
          <div className="flex items-center gap-3 px-1">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-sm">
              <Pill className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xl font-semibold tracking-tight">Pharmy</p>
              <p className="text-sm text-muted-foreground">Shadcn admin</p>
            </div>
          </div>

          <div className="relative mt-6">
            <Search className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              readOnly
              value="Search products, sales, batches..."
              className="h-12 rounded-2xl border-border/70 bg-white pl-11 text-sm text-muted-foreground shadow-sm"
            />
          </div>

          <nav className="mt-6 space-y-1.5">
            {navItems.map(({ label, icon: Icon, active }) => (
              <button
                key={label}
                className={cn(
                  "flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-medium transition",
                  active
                    ? "border border-border/80 bg-white text-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-white/70",
                )}
              >
                <Icon className="h-4 w-4" />
                <span>{label}</span>
              </button>
            ))}
          </nav>

          <Card className="mt-6 rounded-[26px] border-border/70 bg-white shadow-sm">
            <CardContent className="p-4">
              <p className="text-sm font-semibold">System overview</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Inventory is connected to live backend data.
              </p>
              <div className="mt-4 grid grid-cols-4 gap-2">
                {Array.from({ length: 8 }).map((_, index) => (
                  <div key={index} className="h-10 rounded-2xl bg-[#f3efe7]" />
                ))}
              </div>
              <Button className="mt-4 h-11 w-full rounded-2xl bg-[#f55b43] text-white hover:bg-[#ef4f43]">
                Open inventory workspace
              </Button>
            </CardContent>
          </Card>

          <Card className="mt-auto rounded-[26px] border-border/70 bg-white shadow-sm">
            <CardContent className="flex items-center gap-3 p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#ffe1d8] text-sm font-semibold text-[#d24d36]">
                AD
              </div>
              <div>
                <p className="font-semibold">System Administrator</p>
                <p className="text-sm text-muted-foreground">admin@demo.pharmacy</p>
              </div>
            </CardContent>
          </Card>
        </aside>

        <section className="flex-1 bg-[#fcfbf8] p-4 md:p-6 xl:p-8">
          <div className="rounded-[28px] border border-border/60 bg-[#fffdf9] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)] md:p-7">
            <header className="flex flex-col gap-4 pb-6 xl:flex-row xl:items-start xl:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                  <span>Dashboard</span>
                  <ChevronRight className="h-4 w-4" />
                  <span>Inventory</span>
                  <ChevronRight className="h-4 w-4" />
                  <span className="text-foreground/70">Pharmacy operations</span>
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
                      <Badge className="rounded-full border border-[#f0dcc4] bg-[#fff2e2] px-3 py-1.5 font-medium text-[#996640] hover:bg-[#fff2e2]">
                        Live backend connected
                      </Badge>
                      <Badge variant="secondary" className="rounded-full px-3 py-1.5 text-black/60">
                        Demo Pharmacy
                      </Badge>
                      <span className="text-muted-foreground">Updated just now</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 xl:justify-end">
                <Button variant="outline" className="h-11 rounded-2xl px-4">
                  <SlidersHorizontal className="h-4 w-4" />
                  Manage
                </Button>
                <Button variant="outline" className="h-11 rounded-2xl px-4">
                  <Bell className="h-4 w-4" />
                  Alerts
                </Button>
                <Button variant="outline" size="icon" className="h-11 w-11 rounded-2xl">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </header>

            <Separator className="bg-border/60" />

            <section className="mt-6 grid gap-4 xl:grid-cols-[1.5fr_0.8fr]">
              <Card className="rounded-[28px] border-border/60 bg-white shadow-sm">
                <CardContent className="p-5 md:p-6">
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div>
                      <h2 className="text-2xl font-semibold tracking-tight">Consolidated performance</h2>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Sales, stock exposure, low inventory pressure, and expiry watch in one view.
                      </p>
                    </div>
                    <div className="inline-flex rounded-2xl border border-border/60 bg-[#faf8f4] p-1 text-sm">
                      {["D", "W", "M", "Y", "All"].map((tab) => (
                        <span
                          key={tab}
                          className={cn(
                            "px-3 py-1.5",
                            tab === "All"
                              ? "rounded-xl bg-white font-semibold text-foreground shadow-sm"
                              : "text-muted-foreground",
                          )}
                        >
                          {tab}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6 grid gap-4 md:grid-cols-3">
                    <Card className="rounded-[24px] border-0 bg-[#f4fbfe] shadow-none">
                      <CardContent className="p-4">
                        <p className="text-sm text-muted-foreground">Net sales</p>
                        <p className="mt-3 text-3xl font-semibold text-[#1380a8]">
                          {formatCurrency(dashboard.sales.daily)}
                        </p>
                        <p className="mt-2 text-sm text-[#1380a8]">+24.8% vs previous day</p>
                      </CardContent>
                    </Card>
                    <Card className="rounded-[24px] border-0 bg-[#fff5f3] shadow-none">
                      <CardContent className="p-4">
                        <p className="text-sm text-muted-foreground">Stock value</p>
                        <p className="mt-3 text-3xl font-semibold text-[#e36a58]">
                          {formatCurrency(totalStockValue)}
                        </p>
                        <p className="mt-2 text-sm text-[#e36a58]">Current on-hand valuation</p>
                      </CardContent>
                    </Card>
                    <Card className="rounded-[24px] border-0 bg-[#f7f7f2] shadow-none">
                      <CardContent className="p-4">
                        <p className="text-sm text-muted-foreground">Near expiry batches</p>
                        <p className="mt-3 text-3xl font-semibold text-[#2d2a24]">{dashboard.totals.nearExpiry}</p>
                        <p className="mt-2 text-sm text-muted-foreground">Requires review this month</p>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="mt-6 rounded-[26px] border border-dashed border-border/70 bg-[linear-gradient(180deg,#fbfdff_0%,#fff7f5_100%)] p-5">
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
                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-muted-foreground">
                      <div className="flex items-center gap-5">
                        <span className="inline-flex items-center gap-2">
                          <span className="h-2.5 w-2.5 rounded-full bg-[#1f98be]" /> Sales
                        </span>
                        <span className="inline-flex items-center gap-2">
                          <span className="h-2.5 w-2.5 rounded-full bg-[#ff7f6f]" /> Stock pressure
                        </span>
                      </div>
                      <span>Now using shadcn/ui components for the admin shell.</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="grid gap-4">
                {[
                  { label: "Products", value: dashboard.totals.products, tone: "bg-[#f5fbff] text-[#0f84a8]" },
                  { label: "Suppliers", value: dashboard.totals.suppliers, tone: "bg-[#fff8f3] text-[#d36d48]" },
                  { label: "Low stock", value: dashboard.totals.lowStock, tone: "bg-[#fff2f0] text-[#e15444]" },
                  { label: "Sales today", value: sales.length, tone: "bg-[#f7f6ef] text-[#4c4a3f]" },
                ].map((item) => (
                  <Card key={item.label} className="rounded-[24px] border-border/60 bg-white shadow-sm">
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm text-muted-foreground">{item.label}</p>
                          <p className="mt-3 text-3xl font-semibold">{item.value}</p>
                        </div>
                        <Badge className={cn("rounded-full px-3 py-1 text-xs font-semibold hover:opacity-100", item.tone)}>
                          Live
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            <section className="mt-6">
              <Card className="rounded-[28px] border-border/60 bg-white shadow-sm">
                <CardContent className="p-5 md:p-6">
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                      <h2 className="text-2xl font-semibold tracking-tight">Operations workspace</h2>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Product control, supplier contacts, batch inventory, and sales activity.
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      <Button variant="outline" className="h-11 rounded-2xl px-4">
                        <Search className="h-4 w-4" /> Search
                      </Button>
                      <Button variant="outline" className="h-11 rounded-2xl px-4">
                        <SlidersHorizontal className="h-4 w-4" /> Filter
                      </Button>
                      <Button className="h-11 rounded-2xl bg-[linear-gradient(180deg,#ff785f,#ef4f43)] px-5 text-white shadow-[0_14px_30px_rgba(239,79,67,0.35)] hover:opacity-95">
                        <CirclePlus className="h-4 w-4" /> Add new
                      </Button>
                    </div>
                  </div>

                  <div className="mt-6 grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
                    <div className="overflow-hidden rounded-[24px] border border-border/60">
                      <table className="min-w-full bg-white text-sm">
                        <thead className="bg-[#fbf8f2] text-left text-muted-foreground">
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
                            <tr key={product.id} className="border-t border-border/60 text-[#24221f]">
                              <td className="px-5 py-4 font-medium text-muted-foreground">{product.sku}</td>
                              <td className="px-5 py-4">
                                <div>
                                  <p className="font-semibold">{product.brandName}</p>
                                  <p className="text-muted-foreground">{product.genericName}</p>
                                </div>
                              </td>
                              <td className="px-5 py-4">{product.category}</td>
                              <td className="px-5 py-4">
                                <Badge
                                  className={cn(
                                    "rounded-full px-3 py-1 text-xs font-semibold hover:opacity-100",
                                    product.stockAvailable <= product.reorderLevel
                                      ? "bg-[#fff0ec] text-[#e25f4a]"
                                      : "bg-[#eef9f9] text-[#1380a8]",
                                  )}
                                >
                                  {product.stockAvailable} units
                                </Badge>
                              </td>
                              <td className="px-5 py-4 font-semibold">{formatCurrency(product.sellingPrice)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <div className="space-y-4">
                      <Card className="rounded-[24px] border-border/60 bg-[#fcfaf6] shadow-none">
                        <CardContent className="p-5">
                          <h3 className="text-lg font-semibold">Supplier registry</h3>
                          <div className="mt-4 space-y-3">
                            {suppliers.map((supplier: any) => (
                              <Card key={supplier.id} className="rounded-2xl border-border/60 bg-white shadow-sm">
                                <CardContent className="p-4">
                                  <div className="flex items-start justify-between gap-3">
                                    <div>
                                      <p className="font-semibold">{supplier.name}</p>
                                      <p className="mt-1 text-sm text-muted-foreground">{supplier.contactPerson}</p>
                                    </div>
                                    <Badge className="rounded-full bg-[#eef9f9] px-3 py-1 text-xs font-semibold text-[#1380a8] capitalize hover:bg-[#eef9f9]">
                                      {supplier.status}
                                    </Badge>
                                  </div>
                                  <p className="mt-3 text-sm text-muted-foreground">{supplier.email}</p>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="rounded-[24px] border-border/60 bg-[#fff8f5] shadow-none">
                        <CardContent className="p-5">
                          <h3 className="text-lg font-semibold">Batch watchlist</h3>
                          <div className="mt-4 space-y-3">
                            {batches.map((batch: any) => (
                              <Card key={batch.batchNumber} className="rounded-2xl border-[#f3dfd8] bg-white/80 shadow-none">
                                <CardContent className="p-4">
                                  <div className="flex items-start justify-between gap-3">
                                    <div>
                                      <p className="font-semibold">{batch.product}</p>
                                      <p className="text-sm text-muted-foreground">{batch.batchNumber}</p>
                                    </div>
                                    <Badge className="rounded-full bg-[#fff0ec] px-3 py-1 text-xs font-semibold text-[#e25f4a] hover:bg-[#fff0ec]">
                                      {batch.expiryDate}
                                    </Badge>
                                  </div>
                                  <div className="mt-3 flex items-center justify-between text-sm text-muted-foreground">
                                    <span>Available: {batch.quantityAvailable}</span>
                                    <span>{formatCurrency(batch.purchaseCost)}</span>
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>

                  <div className="mt-6 overflow-hidden rounded-[24px] border border-border/60">
                    <table className="min-w-full bg-white text-sm">
                      <thead className="bg-[#fbf8f2] text-left text-muted-foreground">
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
                          <tr key={sale.saleNumber} className="border-t border-border/60 text-[#24221f]">
                            <td className="px-5 py-4 font-semibold">{sale.saleNumber}</td>
                            <td className="px-5 py-4 text-muted-foreground">{sale.saleDate}</td>
                            <td className="px-5 py-4">
                              <Badge className="rounded-full bg-[#f4f7fb] px-3 py-1 text-xs font-semibold capitalize text-[#516174] hover:bg-[#f4f7fb]">
                                {sale.customerType}
                              </Badge>
                            </td>
                            <td className="px-5 py-4 text-[#e25f4a]">{formatCurrency(sale.discountAmount)}</td>
                            <td className="px-5 py-4 font-semibold">{formatCurrency(sale.netAmount)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </section>
          </div>
        </section>
      </div>
    </main>
  );
}
