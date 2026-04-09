"use client";

import { useMemo, useState, useTransition } from "react";
import {
  Boxes,
  LayoutDashboard,
  Mail,
  Package,
  Plus,
  Receipt,
  RefreshCcw,
  Truck,
  Users,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { SalesChart } from "@/components/sales-chart";
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

const categoryOptions = [
  { id: 1, label: "OTC Medicines" },
  { id: 2, label: "Prescription Medicines" },
  { id: 3, label: "Supplements" },
  { id: 4, label: "Personal Care" },
];

function MiniStatCard({
  title,
  value,
  note,
  trend,
}: {
  title: string;
  value: string;
  note: string;
  trend: string;
}) {
  return (
    <Card className="border-0 shadow-none bg-card">
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-4">
          <p className="text-sm text-muted-foreground">{title}</p>
          <Badge variant="outline" className="rounded-full text-xs font-medium">
            {trend}
          </Badge>
        </div>
        <p className="mt-4 text-4xl font-semibold tracking-tight">{value}</p>
        <p className="mt-6 text-lg font-medium tracking-tight">{note}</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Updated from live pharmacy data
        </p>
      </CardContent>
    </Card>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="grid gap-2 text-sm">
      <span className="font-medium text-foreground">{label}</span>
      {children}
    </label>
  );
}

function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={cn(
        "h-11 rounded-xl border border-border bg-background px-3 text-sm outline-none ring-0 transition focus:border-foreground/30",
        props.className,
      )}
    />
  );
}

function SelectInput(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={cn(
        "h-11 rounded-xl border border-border bg-background px-3 text-sm outline-none ring-0 transition focus:border-foreground/30",
        props.className,
      )}
    />
  );
}

export function PharmacyDashboardClient({
  initialDashboard,
  initialProducts,
  initialSuppliers,
  initialSales,
  initialBatches,
}: Props) {
  const [products, setProducts] = useState(initialProducts);
  const [suppliers, setSuppliers] = useState(initialSuppliers);
  const [sales, setSales] = useState(initialSales);
  const [batches, setBatches] = useState(initialBatches);
  const [dashboard, setDashboard] = useState(initialDashboard);
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);

  const [supplierForm, setSupplierForm] = useState<SupplierCreateInput>({
    supplier_code: "",
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

  const totalRevenue = useMemo(
    () => sales.reduce((sum, sale) => sum + sale.net_amount, 0),
    [sales],
  );

  async function handleCreateSupplier() {
    setMessage(null);
    startTransition(async () => {
      try {
        const created = await createSupplier(supplierForm);
        setSuppliers((current) => [created, ...current]);
        setDashboard((current) => ({
          ...current,
          totals: {
            ...current.totals,
            suppliers: current.totals.suppliers + 1,
          },
        }));
        setSupplierForm({
          supplier_code: "",
          name: "",
          contact_person: "",
          phone: "",
          email: "",
          status: "active",
        });
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
        setDashboard((current) => ({
          ...current,
          totals: { ...current.totals, products: current.totals.products + 1 },
        }));
        setProductForm((current) => ({
          ...current,
          sku: "",
          generic_name: "",
          brand_name: "",
          selling_price: 0,
          reorder_level: 0,
        }));
        setMessage(`Product ${created.brand_name} created.`);
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
        setProducts((current) =>
          current.map((product) =>
            product.id === batchForm.product_id
              ? {
                  ...product,
                  stock_available:
                    product.stock_available + batchForm.quantity_received,
                }
              : product,
          ),
        );
        setMessage(`Batch ${created.batch_number} recorded.`);
      } catch {
        setMessage("Failed to create batch.");
      }
    });
  }

  async function handleCreateSale() {
    setMessage(null);
    startTransition(async () => {
      try {
        const payload: SaleCreateInput = {
          customer_type: saleForm.customer_type,
          items: [
            { product_id: saleForm.product_id, quantity: saleForm.quantity },
          ],
        };
        const created = await createSale(payload);
        setSales((current) => [created, ...current]);
        setProducts((current) =>
          current.map((product) =>
            product.id === saleForm.product_id
              ? {
                  ...product,
                  stock_available: Math.max(
                    0,
                    product.stock_available - saleForm.quantity,
                  ),
                }
              : product,
          ),
        );
        setMessage(`Sale ${created.sale_number} posted.`);
      } catch {
        setMessage("Failed to create sale. Check available stock.");
      }
    });
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="grid h-screen grid-cols-1 overflow-hidden lg:grid-cols-[280px_1fr]">
        <aside className="h-full overflow-y-auto border-b border-border bg-sidebar px-5 py-6 lg:border-r lg:border-b-0">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full border border-sidebar-primary/30 bg-sidebar-primary/10">
              <div className="h-4 w-4 rounded-full border-2 border-sidebar-primary" />
            </div>
            <h1 className="text-xl font-semibold tracking-tight text-sidebar-foreground">
              Demo Pharmacy
            </h1>
          </div>

          <div className="mt-8 flex gap-3">
            <Dialog>
              <DialogTrigger className="inline-flex h-10 flex-1 items-center justify-start gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition hover:bg-primary/90">
                <Plus className="h-4 w-4" />
                Add Record
              </DialogTrigger>
              <DialogContent className="max-w-3xl rounded-3xl p-0">
                <DialogHeader className="p-6 pb-0">
                  <DialogTitle>Pharmacy CRUD panel</DialogTitle>
                  <DialogDescription>
                    Create suppliers, products, batches, and sales against the
                    live backend.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-6 p-6 md:grid-cols-2">
                  <Card className="border border-border">
                    <CardHeader>
                      <CardTitle className="text-base">
                        Create supplier
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-3">
                      <Field label="Supplier name">
                        <TextInput
                          value={supplierForm.name}
                          onChange={(e) =>
                            setSupplierForm({
                              ...supplierForm,
                              name: e.target.value,
                            })
                          }
                        />
                      </Field>
                      <Field label="Contact person">
                        <TextInput
                          value={supplierForm.contact_person}
                          onChange={(e) =>
                            setSupplierForm({
                              ...supplierForm,
                              contact_person: e.target.value,
                            })
                          }
                        />
                      </Field>
                      <Field label="Phone">
                        <TextInput
                          value={supplierForm.phone}
                          onChange={(e) =>
                            setSupplierForm({
                              ...supplierForm,
                              phone: e.target.value,
                            })
                          }
                        />
                      </Field>
                      <Field label="Email">
                        <TextInput
                          type="email"
                          value={supplierForm.email ?? ""}
                          onChange={(e) =>
                            setSupplierForm({
                              ...supplierForm,
                              email: e.target.value,
                            })
                          }
                        />
                      </Field>
                      <Button onClick={handleCreateSupplier} disabled={pending}>
                        Create supplier
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="border border-border">
                    <CardHeader>
                      <CardTitle className="text-base">
                        Create product
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-3">
                      <Field label="Brand name">
                        <TextInput
                          value={productForm.brand_name}
                          onChange={(e) =>
                            setProductForm({
                              ...productForm,
                              brand_name: e.target.value,
                            })
                          }
                        />
                      </Field>
                      <Field label="Generic name">
                        <TextInput
                          value={productForm.generic_name}
                          onChange={(e) =>
                            setProductForm({
                              ...productForm,
                              generic_name: e.target.value,
                            })
                          }
                        />
                      </Field>
                      <Field label="SKU">
                        <TextInput
                          value={productForm.sku}
                          onChange={(e) =>
                            setProductForm({
                              ...productForm,
                              sku: e.target.value,
                            })
                          }
                        />
                      </Field>
                      <Field label="Supplier">
                        <SelectInput
                          value={productForm.supplier_id}
                          onChange={(e) =>
                            setProductForm({
                              ...productForm,
                              supplier_id: Number(e.target.value),
                            })
                          }
                        >
                          {suppliers.map((supplier) => (
                            <option key={supplier.id} value={supplier.id}>
                              {supplier.name}
                            </option>
                          ))}
                        </SelectInput>
                      </Field>
                      <Field label="Category">
                        <SelectInput
                          value={productForm.category_id}
                          onChange={(e) =>
                            setProductForm({
                              ...productForm,
                              category_id: Number(e.target.value),
                            })
                          }
                        >
                          {categoryOptions.map((category) => (
                            <option key={category.id} value={category.id}>
                              {category.label}
                            </option>
                          ))}
                        </SelectInput>
                      </Field>
                      <div className="grid grid-cols-2 gap-3">
                        <Field label="Selling price">
                          <TextInput
                            type="number"
                            value={productForm.selling_price}
                            onChange={(e) =>
                              setProductForm({
                                ...productForm,
                                selling_price: Number(e.target.value),
                              })
                            }
                          />
                        </Field>
                        <Field label="Reorder level">
                          <TextInput
                            type="number"
                            value={productForm.reorder_level}
                            onChange={(e) =>
                              setProductForm({
                                ...productForm,
                                reorder_level: Number(e.target.value),
                              })
                            }
                          />
                        </Field>
                      </div>
                      <Button onClick={handleCreateProduct} disabled={pending}>
                        Create product
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="border border-border">
                    <CardHeader>
                      <CardTitle className="text-base">Create batch</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-3">
                      <Field label="Product">
                        <SelectInput
                          value={batchForm.product_id}
                          onChange={(e) =>
                            setBatchForm({
                              ...batchForm,
                              product_id: Number(e.target.value),
                            })
                          }
                        >
                          {products.map((product) => (
                            <option key={product.id} value={product.id}>
                              {product.brand_name}
                            </option>
                          ))}
                        </SelectInput>
                      </Field>
                      <Field label="Supplier">
                        <SelectInput
                          value={batchForm.supplier_id}
                          onChange={(e) =>
                            setBatchForm({
                              ...batchForm,
                              supplier_id: Number(e.target.value),
                            })
                          }
                        >
                          {suppliers.map((supplier) => (
                            <option key={supplier.id} value={supplier.id}>
                              {supplier.name}
                            </option>
                          ))}
                        </SelectInput>
                      </Field>
                      <Field label="Batch number">
                        <TextInput
                          value={batchForm.batch_number}
                          onChange={(e) =>
                            setBatchForm({
                              ...batchForm,
                              batch_number: e.target.value,
                            })
                          }
                        />
                      </Field>
                      <Field label="Expiry date">
                        <TextInput
                          type="date"
                          value={batchForm.expiry_date}
                          onChange={(e) =>
                            setBatchForm({
                              ...batchForm,
                              expiry_date: e.target.value,
                            })
                          }
                        />
                      </Field>
                      <div className="grid grid-cols-2 gap-3">
                        <Field label="Quantity received">
                          <TextInput
                            type="number"
                            value={batchForm.quantity_received}
                            onChange={(e) =>
                              setBatchForm({
                                ...batchForm,
                                quantity_received: Number(e.target.value),
                              })
                            }
                          />
                        </Field>
                        <Field label="Purchase cost">
                          <TextInput
                            type="number"
                            step="0.01"
                            value={batchForm.purchase_cost}
                            onChange={(e) =>
                              setBatchForm({
                                ...batchForm,
                                purchase_cost: Number(e.target.value),
                              })
                            }
                          />
                        </Field>
                      </div>
                      <Button onClick={handleCreateBatch} disabled={pending}>
                        Create batch
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="border border-border">
                    <CardHeader>
                      <CardTitle className="text-base">Record sale</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-3">
                      <Field label="Product">
                        <SelectInput
                          value={saleForm.product_id}
                          onChange={(e) =>
                            setSaleForm({
                              ...saleForm,
                              product_id: Number(e.target.value),
                            })
                          }
                        >
                          {products.map((product) => (
                            <option key={product.id} value={product.id}>
                              {product.brand_name}
                            </option>
                          ))}
                        </SelectInput>
                      </Field>
                      <Field label="Customer type">
                        <SelectInput
                          value={saleForm.customer_type}
                          onChange={(e) =>
                            setSaleForm({
                              ...saleForm,
                              customer_type: e.target.value,
                            })
                          }
                        >
                          <option value="walk-in">Walk-in</option>
                          <option value="senior">Senior</option>
                          <option value="member">Member</option>
                        </SelectInput>
                      </Field>
                      <Field label="Quantity">
                        <TextInput
                          type="number"
                          min={1}
                          value={saleForm.quantity}
                          onChange={(e) =>
                            setSaleForm({
                              ...saleForm,
                              quantity: Number(e.target.value),
                            })
                          }
                        />
                      </Field>
                      <Button onClick={handleCreateSale} disabled={pending}>
                        Post sale
                      </Button>
                    </CardContent>
                  </Card>
                </div>
                <DialogFooter className="justify-between px-6 text-sm text-muted-foreground">
                  <span>
                    {message ??
                      "Create actions are live. Edit and delete stay disabled until backend update/delete endpoints are added."}
                  </span>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <Button
              variant="outline"
              size="icon"
              className="h-10 w-10 rounded-lg"
            >
              <Mail className="h-4 w-4" />
            </Button>
          </div>

          <nav className="mt-7 space-y-1">
            {primaryNav.map((item) => (
              <button
                key={item.label}
                className={cn(
                  "grid h-10 w-full grid-cols-[20px_1fr] items-center gap-x-3 rounded-lg px-3 text-left text-sm font-medium transition-colors",
                  item.active
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                )}
              >
                <item.icon className="h-4 w-4 justify-self-center" />
                <span className="truncate">{item.label}</span>
              </button>
            ))}
          </nav>
        </aside>

        <section className="h-full overflow-y-auto bg-background">
          <header className="flex items-center justify-between gap-4 border-b border-border px-6 py-5 md:px-8">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight">
                Pharmacy Dashboard
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Frontend management UI aligned with the live backend.
              </p>
            </div>
            <Button variant="outline" className="rounded-xl">
              <RefreshCcw className="h-4 w-4" /> Live CRUD
            </Button>
          </header>

          <div className="space-y-8 p-6 md:p-8">
            <section className="grid gap-5 xl:grid-cols-4">
              <MiniStatCard
                title="Net Sales"
                value={formatCurrency(totalRevenue || 0)}
                note="Sales recorded this period"
                trend="↗ Live"
              />
              <MiniStatCard
                title="Products"
                value={String(products.length)}
                note="Tracked in master catalog"
                trend="↗ Active"
              />
              <MiniStatCard
                title="Suppliers"
                value={String(suppliers.length)}
                note="Approved vendor records"
                trend="↗ Synced"
              />
              <MiniStatCard
                title="Low Stock"
                value={String(dashboard.totals.lowStock)}
                note="Items at reorder threshold"
                trend="⚠ Monitor"
              />
            </section>

            <section>
              <Card className="border-0 shadow-none bg-background">
                <CardHeader className="pb-0">
                  <CardTitle>Sales and Stock Activity</CardTitle>
                  <CardDescription>
                    Daily net revenue from live sales data
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <SalesChart
                    labels={(() => {
                      const byDate: Record<string, number> = {};
                      sales.forEach((s: any) => {
                        const d = s.sale_date?.slice(0, 10) ?? "Unknown";
                        byDate[d] = (byDate[d] ?? 0) + (s.net_amount ?? 0);
                      });
                      return Object.keys(byDate).sort().slice(-30);
                    })()}
                    values={(() => {
                      const byDate: Record<string, number> = {};
                      sales.forEach((s: any) => {
                        const d = s.sale_date?.slice(0, 10) ?? "Unknown";
                        byDate[d] = (byDate[d] ?? 0) + (s.net_amount ?? 0);
                      });
                      return Object.keys(byDate)
                        .sort()
                        .slice(-30)
                        .map((d) => byDate[d]);
                    })()}
                  />
                </CardContent>
              </Card>
            </section>

            <section className="grid gap-5 xl:grid-cols-2">
              <Card className="border-0 shadow-none bg-card">
                <CardHeader>
                  <CardTitle>Products</CardTitle>
                  <CardDescription>
                    Create works now, update/delete are pending backend
                    endpoints.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {products.map((product) => (
                    <div
                      key={product.id}
                      className="grid grid-cols-[1.2fr_1fr_auto] items-center gap-4 rounded-lg border border-border bg-muted/30 px-4 py-3"
                    >
                      <div>
                        <p className="font-semibold">{product.brand_name}</p>
                        <p className="text-sm text-muted-foreground">
                          {product.generic_name} • {product.sku}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">
                          {product.category_name}
                        </p>
                        <p className="text-sm">
                          {formatCurrency(product.selling_price)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className="rounded-full px-3 py-1 text-sm"
                        >
                          {product.stock_available} stock
                        </Badge>
                        <Button variant="outline" size="sm" disabled>
                          Edit
                        </Button>
                        <Button variant="outline" size="sm" disabled>
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="border-0 shadow-none bg-card">
                <CardHeader>
                  <CardTitle>Suppliers</CardTitle>
                  <CardDescription>
                    Connected to live backend suppliers.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {suppliers.map((supplier) => (
                    <div
                      key={supplier.id}
                      className="flex items-center justify-between gap-4 rounded-lg border border-border bg-card px-4 py-4"
                    >
                      <div>
                        <p className="font-semibold">{supplier.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {supplier.contact_person} • {supplier.phone}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className="rounded-full px-3 py-1 text-sm"
                        >
                          {supplier.status}
                        </Badge>
                        <Button variant="outline" size="sm" disabled>
                          Edit
                        </Button>
                        <Button variant="outline" size="sm" disabled>
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="border-0 shadow-none bg-card">
                <CardHeader>
                  <CardTitle>Stock batches</CardTitle>
                  <CardDescription>
                    Inventory intake records from the backend.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {batches.map((batch) => (
                    <div
                      key={batch.batch_number}
                      className="flex items-center justify-between gap-4 rounded-lg border border-border bg-card px-4 py-4"
                    >
                      <div>
                        <p className="font-semibold">{batch.product_name}</p>
                        <p className="text-sm text-muted-foreground">
                          {batch.batch_number} • Expires {batch.expiry_date}
                        </p>
                      </div>
                      <Badge
                        variant="secondary"
                        className="rounded-full px-3 py-1 text-sm"
                      >
                        {batch.quantity_available} available
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="border-0 shadow-none bg-card">
                <CardHeader>
                  <CardTitle>Sales ledger</CardTitle>
                  <CardDescription>
                    Live sales records. New sale posting is enabled.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {sales.map((sale) => (
                    <div
                      key={sale.sale_number}
                      className="flex items-center justify-between gap-4 rounded-lg border border-border bg-card px-4 py-4"
                    >
                      <div>
                        <p className="font-semibold">{sale.sale_number}</p>
                        <p className="text-sm text-muted-foreground">
                          {sale.customer_type} • {sale.sale_date}
                        </p>
                      </div>
                      <Badge
                        variant="outline"
                        className="rounded-full px-3 py-1 text-sm"
                      >
                        {formatCurrency(sale.net_amount)}
                      </Badge>
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
