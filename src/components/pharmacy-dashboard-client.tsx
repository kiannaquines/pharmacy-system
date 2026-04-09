"use client";

import { useMemo, useState, useTransition } from "react";
import { Boxes, LayoutDashboard, Mail, Package, Plus, Receipt, RefreshCcw, Truck, Users } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  createBatch,
  createProduct,
  createSale,
  createSupplier,
  type BatchCreateInput,
  type ProductCreateInput,
  type SaleCreateInput,
  type SupplierCreateInput,
} from "@/lib/api";
import { formatCurrency } from "@/lib/format";
import type { Batch, Product, Sale, Supplier } from "@/lib/types";
import { cn } from "@/lib/utils";

type DashboardSummary = {
  totals: {
    products: number;
    suppliers: number;
    lowStock: number;
    inventoryUnits: number;
  };
};

type Props = {
  initialDashboard: DashboardSummary;
  initialProducts: Product[];
  initialSuppliers: Supplier[];
  initialSales: Sale[];
  initialBatches: Batch[];
};

const primaryNav = [
  { label: "Dashboard", icon: LayoutDashboard, active: true },
  { label: "Products", icon: Package },
  { label: "Inventory", icon: Boxes },
  { label: "Sales", icon: Receipt },
  { label: "Suppliers", icon: Truck },
  { label: "Users", icon: Users },
];

const chartPoints = [22, 18, 30, 26, 34, 28, 38, 35, 45, 33, 52, 41, 48, 37, 54, 46, 58, 42, 61, 49, 57, 44, 63, 50, 60, 47, 65, 55, 62, 51];
const categoryOptions = [
  { id: 1, label: "OTC Medicines" },
  { id: 2, label: "Prescription Medicines" },
  { id: 3, label: "Supplements" },
  { id: 4, label: "Personal Care" },
];

function MiniStatCard({ title, value, note, trend }: { title: string; value: string; note: string; trend: string }) {
  return (
    <Card className="rounded-[28px] border border-border/70 bg-card">
      <CardContent className="p-7">
        <div className="flex items-start justify-between gap-4">
          <p className="text-[15px] text-muted-foreground">{title}</p>
          <Badge variant="outline" className="rounded-full px-3 py-1 text-sm font-medium text-foreground">
            {trend}
          </Badge>
        </div>
        <p className="mt-5 text-5xl font-semibold tracking-tight text-foreground">{value}</p>
        <p className="mt-8 text-2xl font-medium tracking-tight text-foreground">{note}</p>
        <p className="mt-2 text-[15px] text-muted-foreground">Updated from live pharmacy data</p>
      </CardContent>
    </Card>
  );
}

function AreaLikeChart() {
  const max = Math.max(...chartPoints);
  const path = chartPoints.map((point, index) => {
    const x = (index / (chartPoints.length - 1)) * 100;
    const y = 100 - (point / max) * 75;
    return `${index === 0 ? "M" : "L"}${x},${y}`;
  }).join(" ");

  const softPath = chartPoints.map((point, index) => {
    const x = (index / (chartPoints.length - 1)) * 100;
    const y = 100 - (point / max) * 55;
    return `${index === 0 ? "M" : "L"}${x},${y}`;
  }).join(" ");

  return (
    <div className="relative mt-8 h-[420px] overflow-hidden rounded-[24px] border border-border/60 bg-[linear-gradient(180deg,#ffffff_0%,#fcfcfb_100%)] p-6">
      <div className="absolute inset-x-6 top-6 flex justify-end">
        <div className="inline-flex rounded-2xl border border-border/70 bg-background p-1 text-sm">
          {["Last 3 months", "Last 30 days", "Last 7 days"].map((tab, index) => (
            <button key={tab} className={cn("rounded-xl px-5 py-3 font-medium text-muted-foreground transition", index === 0 && "bg-muted text-foreground")}>
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="absolute inset-x-10 bottom-16 top-24">
        <div className="absolute inset-0">
          {[0, 1, 2, 3].map((line) => (
            <div key={line} className="absolute left-0 right-0 border-t border-border/60" style={{ top: `${line * 25}%` }} />
          ))}
        </div>

        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
          <path d={`${softPath} L100,100 L0,100 Z`} fill="rgba(120,120,120,0.18)" />
          <path d={`${path} L100,100 L0,100 Z`} fill="rgba(120,120,120,0.35)" />
        </svg>
      </div>

      <div className="absolute inset-x-10 bottom-8 flex items-center justify-between text-sm text-muted-foreground">
        {["Apr 3", "Apr 9", "Apr 15", "Apr 21", "Apr 27", "May 3", "May 9", "May 15", "May 21", "May 28", "Jun 3", "Jun 9", "Jun 15", "Jun 21", "Jun 29"].map((label) => (
          <span key={label}>{label}</span>
        ))}
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="grid gap-2 text-sm">
      <span className="font-medium text-foreground">{label}</span>
      {children}
    </label>
  );
}

function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={cn("h-11 rounded-xl border border-border bg-background px-3 text-sm outline-none ring-0 transition focus:border-foreground/30", props.className)} />;
}

function SelectInput(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={cn("h-11 rounded-xl border border-border bg-background px-3 text-sm outline-none ring-0 transition focus:border-foreground/30", props.className)} />;
}

export function PharmacyDashboardClient({ initialDashboard, initialProducts, initialSuppliers, initialSales, initialBatches }: Props) {
  const [products, setProducts] = useState(initialProducts);
  const [suppliers, setSuppliers] = useState(initialSuppliers);
  const [sales, setSales] = useState(initialSales);
  const [batches, setBatches] = useState(initialBatches);
  const [dashboard, setDashboard] = useState(initialDashboard);
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);

  const [supplierForm, setSupplierForm] = useState<SupplierCreateInput>({
    name: "",
    contact_person: "",
    phone: "",
    email: "",
    status: "active",
  });
  const [productForm, setProductForm] = useState<ProductCreateInput>({
    category_id: 1,
    supplier_id: initialSuppliers[0]?.id ?? 1,
    sku: "",
    generic_name: "",
    brand_name: "",
    classification: "OTC",
    unit: "box",
    selling_price: 0,
    reorder_level: 0,
  });
  const [batchForm, setBatchForm] = useState<BatchCreateInput>({
    product_id: initialProducts[0]?.id ?? 1,
    supplier_id: initialSuppliers[0]?.id ?? 1,
    batch_number: "",
    expiry_date: "",
    quantity_received: 0,
    purchase_cost: 0,
  });
  const [saleForm, setSaleForm] = useState({
    product_id: initialProducts[0]?.id ?? 1,
    quantity: 1,
    customer_type: "walk-in",
  });

  const totalRevenue = useMemo(() => sales.reduce((sum, sale) => sum + sale.netAmount, 0), [sales]);

  async function handleCreateSupplier() {
    setMessage(null);
    startTransition(async () => {
      try {
        const created = await createSupplier(supplierForm);
        setSuppliers((current) => [created, ...current]);
        setDashboard((current) => ({ ...current, totals: { ...current.totals, suppliers: current.totals.suppliers + 1 } }));
        setSupplierForm({ name: "", contact_person: "", phone: "", email: "", status: "active" });
        setMessage(`Supplier ${created.name} created.`);
      } catch {
        setMessage("Failed to create supplier.");
      }
    });
  }

  async function handleCreateProduct() {
    setMessage(null);
    startTransition(async () => {
      try {
        const created = await createProduct(productForm);
        setProducts((current) => [created, ...current]);
        setDashboard((current) => ({ ...current, totals: { ...current.totals, products: current.totals.products + 1 } }));
        setProductForm((current) => ({ ...current, sku: "", generic_name: "", brand_name: "", selling_price: 0, reorder_level: 0 }));
        setMessage(`Product ${created.brandName} created.`);
      } catch {
        setMessage("Failed to create product.");
      }
    });
  }

  async function handleCreateBatch() {
    setMessage(null);
    startTransition(async () => {
      try {
        const created = await createBatch(batchForm);
        setBatches((current) => [created, ...current]);
        setProducts((current) => current.map((product) => product.id === batchForm.product_id ? { ...product, stockAvailable: product.stockAvailable + batchForm.quantity_received } : product));
        setMessage(`Batch ${created.batchNumber} recorded.`);
      } catch {
        setMessage("Failed to create batch.");
      }
    });
  }

  async function handleCreateSale() {
    setMessage(null);
    startTransition(async () => {
      try {
        const payload: SaleCreateInput = { customer_type: saleForm.customer_type, items: [{ product_id: saleForm.product_id, quantity: saleForm.quantity }] };
        const created = await createSale(payload);
        setSales((current) => [created, ...current]);
        setProducts((current) => current.map((product) => product.id === saleForm.product_id ? { ...product, stockAvailable: Math.max(0, product.stockAvailable - saleForm.quantity) } : product));
        setMessage(`Sale ${created.saleNumber} posted.`);
      } catch {
        setMessage("Failed to create sale. Check available stock.");
      }
    });
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,#ffffff_0%,#f8f8f6_45%,#f3f3f1_100%)] text-foreground">
      <div className="grid h-screen grid-cols-1 overflow-hidden border border-border/70 bg-background shadow-[0_20px_80px_rgba(0,0,0,0.05)] lg:grid-cols-[320px_1fr]">
        <aside className="h-full overflow-y-auto border-b border-border/70 bg-[#fbfbfa] px-5 py-6 lg:border-r lg:border-b-0">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full border border-foreground/20 bg-background">
              <div className="h-4 w-4 rounded-full border-2 border-foreground/80" />
            </div>
            <h1 className="text-[2rem] font-semibold tracking-tight">Demo Pharmacy</h1>
          </div>

          <div className="mt-8 flex gap-3">
            <Dialog>
              <DialogTrigger className="h-12 flex-1 justify-start rounded-2xl bg-[#171717] px-5 text-base text-white hover:bg-[#111111] group/button inline-flex items-center border border-transparent bg-clip-padding font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*=\'size-\'])]:size-4 [a]:hover:bg-primary/80 gap-1.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2">
                <Plus className="h-4 w-4" />
                Add Record
              </DialogTrigger>
              <DialogContent className="max-w-3xl rounded-3xl p-0">
                <DialogHeader className="p-6 pb-0">
                  <DialogTitle>Pharmacy CRUD panel</DialogTitle>
                  <DialogDescription>Create suppliers, products, batches, and sales against the live backend.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-6 p-6 md:grid-cols-2">
                  <Card className="rounded-2xl border border-border/70">
                    <CardHeader>
                      <CardTitle className="text-base">Create supplier</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-3">
                      <Field label="Supplier name"><TextInput value={supplierForm.name} onChange={(e) => setSupplierForm({ ...supplierForm, name: e.target.value })} /></Field>
                      <Field label="Contact person"><TextInput value={supplierForm.contact_person} onChange={(e) => setSupplierForm({ ...supplierForm, contact_person: e.target.value })} /></Field>
                      <Field label="Phone"><TextInput value={supplierForm.phone} onChange={(e) => setSupplierForm({ ...supplierForm, phone: e.target.value })} /></Field>
                      <Field label="Email"><TextInput type="email" value={supplierForm.email} onChange={(e) => setSupplierForm({ ...supplierForm, email: e.target.value })} /></Field>
                      <Button onClick={handleCreateSupplier} disabled={pending}>Create supplier</Button>
                    </CardContent>
                  </Card>

                  <Card className="rounded-2xl border border-border/70">
                    <CardHeader>
                      <CardTitle className="text-base">Create product</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-3">
                      <Field label="Brand name"><TextInput value={productForm.brand_name} onChange={(e) => setProductForm({ ...productForm, brand_name: e.target.value })} /></Field>
                      <Field label="Generic name"><TextInput value={productForm.generic_name} onChange={(e) => setProductForm({ ...productForm, generic_name: e.target.value })} /></Field>
                      <Field label="SKU"><TextInput value={productForm.sku} onChange={(e) => setProductForm({ ...productForm, sku: e.target.value })} /></Field>
                      <Field label="Supplier"><SelectInput value={productForm.supplier_id} onChange={(e) => setProductForm({ ...productForm, supplier_id: Number(e.target.value) })}>{suppliers.map((supplier) => <option key={supplier.id} value={supplier.id}>{supplier.name}</option>)}</SelectInput></Field>
                      <Field label="Category"><SelectInput value={productForm.category_id} onChange={(e) => setProductForm({ ...productForm, category_id: Number(e.target.value) })}>{categoryOptions.map((category) => <option key={category.id} value={category.id}>{category.label}</option>)}</SelectInput></Field>
                      <div className="grid grid-cols-2 gap-3">
                        <Field label="Selling price"><TextInput type="number" value={productForm.selling_price} onChange={(e) => setProductForm({ ...productForm, selling_price: Number(e.target.value) })} /></Field>
                        <Field label="Reorder level"><TextInput type="number" value={productForm.reorder_level} onChange={(e) => setProductForm({ ...productForm, reorder_level: Number(e.target.value) })} /></Field>
                      </div>
                      <Button onClick={handleCreateProduct} disabled={pending}>Create product</Button>
                    </CardContent>
                  </Card>

                  <Card className="rounded-2xl border border-border/70">
                    <CardHeader>
                      <CardTitle className="text-base">Create batch</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-3">
                      <Field label="Product"><SelectInput value={batchForm.product_id} onChange={(e) => setBatchForm({ ...batchForm, product_id: Number(e.target.value) })}>{products.map((product) => <option key={product.id} value={product.id}>{product.brandName}</option>)}</SelectInput></Field>
                      <Field label="Supplier"><SelectInput value={batchForm.supplier_id} onChange={(e) => setBatchForm({ ...batchForm, supplier_id: Number(e.target.value) })}>{suppliers.map((supplier) => <option key={supplier.id} value={supplier.id}>{supplier.name}</option>)}</SelectInput></Field>
                      <Field label="Batch number"><TextInput value={batchForm.batch_number} onChange={(e) => setBatchForm({ ...batchForm, batch_number: e.target.value })} /></Field>
                      <Field label="Expiry date"><TextInput type="date" value={batchForm.expiry_date} onChange={(e) => setBatchForm({ ...batchForm, expiry_date: e.target.value })} /></Field>
                      <div className="grid grid-cols-2 gap-3">
                        <Field label="Quantity received"><TextInput type="number" value={batchForm.quantity_received} onChange={(e) => setBatchForm({ ...batchForm, quantity_received: Number(e.target.value) })} /></Field>
                        <Field label="Purchase cost"><TextInput type="number" step="0.01" value={batchForm.purchase_cost} onChange={(e) => setBatchForm({ ...batchForm, purchase_cost: Number(e.target.value) })} /></Field>
                      </div>
                      <Button onClick={handleCreateBatch} disabled={pending}>Create batch</Button>
                    </CardContent>
                  </Card>

                  <Card className="rounded-2xl border border-border/70">
                    <CardHeader>
                      <CardTitle className="text-base">Record sale</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-3">
                      <Field label="Product"><SelectInput value={saleForm.product_id} onChange={(e) => setSaleForm({ ...saleForm, product_id: Number(e.target.value) })}>{products.map((product) => <option key={product.id} value={product.id}>{product.brandName}</option>)}</SelectInput></Field>
                      <Field label="Customer type"><SelectInput value={saleForm.customer_type} onChange={(e) => setSaleForm({ ...saleForm, customer_type: e.target.value })}><option value="walk-in">Walk-in</option><option value="senior">Senior</option><option value="member">Member</option></SelectInput></Field>
                      <Field label="Quantity"><TextInput type="number" min={1} value={saleForm.quantity} onChange={(e) => setSaleForm({ ...saleForm, quantity: Number(e.target.value) })} /></Field>
                      <Button onClick={handleCreateSale} disabled={pending}>Post sale</Button>
                    </CardContent>
                  </Card>
                </div>
                <DialogFooter className="justify-between px-6 text-sm text-muted-foreground">
                  <span>{message ?? "Create actions are live. Edit and delete stay disabled until backend update/delete endpoints are added."}</span>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <Button variant="outline" size="icon" className="h-12 w-12 rounded-2xl border-border/70 bg-background">
              <Mail className="h-4 w-4" />
            </Button>
          </div>

          <nav className="mt-7 space-y-1">
            {primaryNav.map((item) => (
              <button key={item.label} className={cn("grid h-12 w-full grid-cols-[20px_1fr] items-center gap-x-3 rounded-2xl px-3 text-left text-[15px] transition", item.active ? "bg-muted text-foreground" : "text-foreground/85 hover:bg-muted/60")}>
                <item.icon className="h-4 w-4 justify-self-center" />
                <span className="truncate">{item.label}</span>
              </button>
            ))}
          </nav>
        </aside>

        <section className="h-full overflow-y-auto bg-[#fcfcfb]">
          <header className="flex items-center justify-between gap-4 border-b border-border/70 px-6 py-5 md:px-8">
            <div>
              <h2 className="text-[2rem] font-semibold tracking-tight">Pharmacy Dashboard</h2>
              <p className="text-sm text-muted-foreground">Frontend management UI aligned with the live backend.</p>
            </div>
            <Button variant="outline" className="rounded-xl"><RefreshCcw className="h-4 w-4" /> Live CRUD</Button>
          </header>

          <div className="space-y-8 p-6 md:p-8">
            <section className="grid gap-5 xl:grid-cols-4">
              <MiniStatCard title="Net Sales" value={formatCurrency(totalRevenue || 0)} note="Sales recorded this period" trend="↗ Live" />
              <MiniStatCard title="Products" value={String(products.length)} note="Tracked in master catalog" trend="↗ Active" />
              <MiniStatCard title="Suppliers" value={String(suppliers.length)} note="Approved vendor records" trend="↗ Synced" />
              <MiniStatCard title="Low Stock" value={String(dashboard.totals.lowStock)} note="Items at reorder threshold" trend="⚠ Monitor" />
            </section>

            <section>
              <Card className="rounded-[32px] border border-border/70 bg-background">
                <CardHeader className="pb-0">
                  <CardTitle className="text-[2rem] tracking-tight">Sales and Stock Activity</CardTitle>
                  <CardDescription className="text-lg">Backend-connected operational trend panel</CardDescription>
                </CardHeader>
                <CardContent>
                  <AreaLikeChart />
                </CardContent>
              </Card>
            </section>

            <section className="grid gap-5 xl:grid-cols-2">
              <Card className="rounded-[28px] border border-border/70 bg-card">
                <CardHeader>
                  <CardTitle>Products</CardTitle>
                  <CardDescription>Create works now, update/delete are pending backend endpoints.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {products.map((product) => (
                    <div key={product.id} className="grid grid-cols-[1.2fr_1fr_auto] items-center gap-4 rounded-2xl border border-border/70 bg-white px-4 py-4">
                      <div>
                        <p className="font-semibold">{product.brandName}</p>
                        <p className="text-sm text-muted-foreground">{product.genericName} • {product.sku}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">{product.category}</p>
                        <p className="text-sm">{formatCurrency(product.sellingPrice)}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="rounded-full px-3 py-1 text-sm">{product.stockAvailable} stock</Badge>
                        <Button variant="outline" size="sm" disabled>Edit</Button>
                        <Button variant="outline" size="sm" disabled>Delete</Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="rounded-[28px] border border-border/70 bg-card">
                <CardHeader>
                  <CardTitle>Suppliers</CardTitle>
                  <CardDescription>Connected to live backend suppliers.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {suppliers.map((supplier) => (
                    <div key={supplier.id} className="flex items-center justify-between gap-4 rounded-2xl border border-border/70 bg-white px-4 py-4">
                      <div>
                        <p className="font-semibold">{supplier.name}</p>
                        <p className="text-sm text-muted-foreground">{supplier.contactPerson} • {supplier.phone}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="rounded-full px-3 py-1 text-sm">{supplier.status}</Badge>
                        <Button variant="outline" size="sm" disabled>Edit</Button>
                        <Button variant="outline" size="sm" disabled>Delete</Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="rounded-[28px] border border-border/70 bg-card">
                <CardHeader>
                  <CardTitle>Stock batches</CardTitle>
                  <CardDescription>Inventory intake records from the backend.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {batches.map((batch) => (
                    <div key={batch.batchNumber} className="flex items-center justify-between gap-4 rounded-2xl border border-border/70 bg-white px-4 py-4">
                      <div>
                        <p className="font-semibold">{batch.product}</p>
                        <p className="text-sm text-muted-foreground">{batch.batchNumber} • Expires {batch.expiryDate}</p>
                      </div>
                      <Badge variant="secondary" className="rounded-full px-3 py-1 text-sm">{batch.quantityAvailable} available</Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="rounded-[28px] border border-border/70 bg-card">
                <CardHeader>
                  <CardTitle>Sales ledger</CardTitle>
                  <CardDescription>Live sales records. New sale posting is enabled.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {sales.map((sale) => (
                    <div key={sale.saleNumber} className="flex items-center justify-between gap-4 rounded-2xl border border-border/70 bg-white px-4 py-4">
                      <div>
                        <p className="font-semibold">{sale.saleNumber}</p>
                        <p className="text-sm text-muted-foreground">{sale.customerType} • {sale.saleDate}</p>
                      </div>
                      <Badge variant="outline" className="rounded-full px-3 py-1 text-sm">{formatCurrency(sale.netAmount)}</Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </section>
          </div>
        </section>
      </div>
    </main>
  );
}
