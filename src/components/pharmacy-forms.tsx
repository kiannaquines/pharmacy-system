"use client";

import { useState, useTransition } from "react";
import { AlertCircle, CheckCircle2 } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
import type { Product, Supplier } from "@/lib/types";
import { cn } from "@/lib/utils";

const categoryOptions = [
  { id: 1, label: "OTC Medicines" },
  { id: 2, label: "Prescription Medicines" },
  { id: 3, label: "Supplements" },
  { id: 4, label: "Personal Care" },
];

type Notice = { type: "success" | "error"; text: string } | null;

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

function SelectInput(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={cn(
        "h-11 rounded-xl border border-input bg-background px-3 text-sm outline-none ring-0 transition focus:border-ring",
        props.className,
      )}
    />
  );
}

function NoticeAlert({ notice }: { notice: Notice }) {
  if (!notice) return null;

  const destructive = notice.type === "error";
  return (
    <Alert variant={destructive ? "destructive" : "default"}>
      {destructive ? (
        <AlertCircle className="h-4 w-4" />
      ) : (
        <CheckCircle2 className="h-4 w-4" />
      )}
      <AlertTitle>
        {destructive ? "Action failed" : "Action completed"}
      </AlertTitle>
      <AlertDescription>{notice.text}</AlertDescription>
    </Alert>
  );
}

export function SupplierCreateCard() {
  const [pending, startTransition] = useTransition();
  const [notice, setNotice] = useState<Notice>(null);
  const [form, setForm] = useState<SupplierCreateInput>({
    supplier_code: "",
    name: "",
    contact_person: "",
    phone: "",
    email: "",
    status: "active",
  });

  return (
    <Card className="border-0 shadow-none bg-card">
      <CardHeader>
        <CardTitle>Create supplier</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3">
        <NoticeAlert notice={notice} />
        <Field label="Supplier code">
          <Input
            value={form.supplier_code}
            onChange={(e) =>
              setForm({ ...form, supplier_code: e.target.value })
            }
          />
        </Field>
        <Field label="Supplier name">
          <Input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </Field>
        <Field label="Contact person">
          <Input
            value={form.contact_person}
            onChange={(e) =>
              setForm({ ...form, contact_person: e.target.value })
            }
          />
        </Field>
        <Field label="Phone">
          <Input
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
        </Field>
        <Field label="Email">
          <Input
            type="email"
            value={form.email ?? ""}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </Field>
        <Button
          disabled={pending}
          onClick={() =>
            startTransition(async () => {
              try {
                const created = await createSupplier(form);
                setNotice({
                  type: "success",
                  text: `Created ${created.name}. Refresh to see the latest server list.`,
                });
                setForm({
                  supplier_code: "",
                  name: "",
                  contact_person: "",
                  phone: "",
                  email: "",
                  status: "active",
                });
              } catch {
                setNotice({
                  type: "error",
                  text: "Failed to create supplier.",
                });
              }
            })
          }
        >
          Create supplier
        </Button>
      </CardContent>
    </Card>
  );
}

export function ProductCreateCard({ suppliers }: { suppliers: Supplier[] }) {
  const [pending, startTransition] = useTransition();
  const [notice, setNotice] = useState<Notice>(null);
  const [form, setForm] = useState<ProductCreateInput>({
    category_id: 1,
    supplier_id: suppliers[0]?.id ?? 1,
    sku: "",
    generic_name: "",
    brand_name: "",
    classification: "OTC",
    unit: "box",
    selling_price: 0,
    reorder_level: 0,
  });

  return (
    <Card className="border-0 shadow-none bg-card">
      <CardHeader>
        <CardTitle>Create product</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3">
        <NoticeAlert notice={notice} />
        <Field label="Brand name">
          <Input
            value={form.brand_name}
            onChange={(e) => setForm({ ...form, brand_name: e.target.value })}
          />
        </Field>
        <Field label="Generic name">
          <Input
            value={form.generic_name}
            onChange={(e) => setForm({ ...form, generic_name: e.target.value })}
          />
        </Field>
        <Field label="SKU">
          <Input
            value={form.sku}
            onChange={(e) => setForm({ ...form, sku: e.target.value })}
          />
        </Field>
        <Field label="Supplier">
          <SelectInput
            value={form.supplier_id}
            onChange={(e) =>
              setForm({ ...form, supplier_id: Number(e.target.value) })
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
            value={form.category_id}
            onChange={(e) =>
              setForm({ ...form, category_id: Number(e.target.value) })
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
            <Input
              type="number"
              value={form.selling_price}
              onChange={(e) =>
                setForm({ ...form, selling_price: Number(e.target.value) })
              }
            />
          </Field>
          <Field label="Reorder level">
            <Input
              type="number"
              value={form.reorder_level}
              onChange={(e) =>
                setForm({ ...form, reorder_level: Number(e.target.value) })
              }
            />
          </Field>
        </div>
        <Button
          disabled={pending}
          onClick={() =>
            startTransition(async () => {
              try {
                const created = await createProduct(form);
                setNotice({
                  type: "success",
                  text: `Created ${created.brand_name}. Refresh to see the latest server list.`,
                });
              } catch {
                setNotice({ type: "error", text: "Failed to create product." });
              }
            })
          }
        >
          Create product
        </Button>
      </CardContent>
    </Card>
  );
}

export function BatchCreateCard({
  suppliers,
  products,
}: {
  suppliers: Supplier[];
  products: Product[];
}) {
  const [pending, startTransition] = useTransition();
  const [notice, setNotice] = useState<Notice>(null);
  const [form, setForm] = useState<BatchCreateInput>({
    product_id: products[0]?.id ?? 1,
    supplier_id: suppliers[0]?.id ?? 1,
    batch_number: "",
    expiry_date: "",
    quantity_received: 0,
    purchase_cost: 0,
  });

  return (
    <Card className="border-0 shadow-none bg-card">
      <CardHeader>
        <CardTitle>Create batch</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3">
        <NoticeAlert notice={notice} />
        <Field label="Product">
          <SelectInput
            value={form.product_id}
            onChange={(e) =>
              setForm({ ...form, product_id: Number(e.target.value) })
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
            value={form.supplier_id}
            onChange={(e) =>
              setForm({ ...form, supplier_id: Number(e.target.value) })
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
          <Input
            value={form.batch_number}
            onChange={(e) => setForm({ ...form, batch_number: e.target.value })}
          />
        </Field>
        <Field label="Expiry date">
          <Input
            type="date"
            value={form.expiry_date}
            onChange={(e) => setForm({ ...form, expiry_date: e.target.value })}
          />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Quantity received">
            <Input
              type="number"
              value={form.quantity_received}
              onChange={(e) =>
                setForm({ ...form, quantity_received: Number(e.target.value) })
              }
            />
          </Field>
          <Field label="Purchase cost">
            <Input
              type="number"
              step="0.01"
              value={form.purchase_cost}
              onChange={(e) =>
                setForm({ ...form, purchase_cost: Number(e.target.value) })
              }
            />
          </Field>
        </div>
        <Button
          disabled={pending}
          onClick={() =>
            startTransition(async () => {
              try {
                const created = await createBatch(form);
                setNotice({
                  type: "success",
                  text: `Recorded ${created.batch_number}. Refresh to see the latest server list.`,
                });
              } catch {
                setNotice({ type: "error", text: "Failed to create batch." });
              }
            })
          }
        >
          Create batch
        </Button>
      </CardContent>
    </Card>
  );
}

export function SaleCreateCard({ products }: { products: Product[] }) {
  const [pending, startTransition] = useTransition();
  const [notice, setNotice] = useState<Notice>(null);
  const [form, setForm] = useState({
    product_id: products[0]?.id ?? 1,
    quantity: 1,
    customer_type: "walk-in",
  });

  return (
    <Card className="border-0 shadow-none bg-card">
      <CardHeader>
        <CardTitle>Record sale</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3">
        <NoticeAlert notice={notice} />
        <Field label="Product">
          <SelectInput
            value={form.product_id}
            onChange={(e) =>
              setForm({ ...form, product_id: Number(e.target.value) })
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
            value={form.customer_type}
            onChange={(e) =>
              setForm({ ...form, customer_type: e.target.value })
            }
          >
            <option value="walk-in">Walk-in</option>
            <option value="senior">Senior</option>
            <option value="member">Member</option>
          </SelectInput>
        </Field>
        <Field label="Quantity">
          <Input
            type="number"
            min={1}
            value={form.quantity}
            onChange={(e) =>
              setForm({ ...form, quantity: Number(e.target.value) })
            }
          />
        </Field>
        <Button
          disabled={pending}
          onClick={() =>
            startTransition(async () => {
              try {
                const payload: SaleCreateInput = {
                  customer_type: form.customer_type,
                  items: [
                    { product_id: form.product_id, quantity: form.quantity },
                  ],
                };
                const created = await createSale(payload);
                setNotice({
                  type: "success",
                  text: `Posted ${created.sale_number}. Refresh to see the latest server list.`,
                });
              } catch {
                setNotice({ type: "error", text: "Failed to create sale." });
              }
            })
          }
        >
          Post sale
        </Button>
      </CardContent>
    </Card>
  );
}
