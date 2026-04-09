"use client";

import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createBatch, createProduct, createSale, createSupplier, type BatchCreateInput, type ProductCreateInput, type SaleCreateInput, type SupplierCreateInput } from "@/lib/api";
import type { Product, Supplier } from "@/lib/types";
import { cn } from "@/lib/utils";

const categoryOptions = [
  { id: 1, label: "OTC Medicines" },
  { id: 2, label: "Prescription Medicines" },
  { id: 3, label: "Supplements" },
  { id: 4, label: "Personal Care" },
];

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

export function SupplierCreateCard() {
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const [form, setForm] = useState<SupplierCreateInput>({ name: "", contact_person: "", phone: "", email: "", status: "active" });

  return (
    <Card className="rounded-[28px] border border-border/70 bg-card">
      <CardHeader><CardTitle>Create supplier</CardTitle></CardHeader>
      <CardContent className="grid gap-3">
        <Field label="Supplier name"><TextInput value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></Field>
        <Field label="Contact person"><TextInput value={form.contact_person} onChange={(e) => setForm({ ...form, contact_person: e.target.value })} /></Field>
        <Field label="Phone"><TextInput value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></Field>
        <Field label="Email"><TextInput type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></Field>
        <Button disabled={pending} onClick={() => startTransition(async () => {
          try {
            const created = await createSupplier(form);
            setMessage(`Created ${created.name}. Refresh to see the latest server list.`);
            setForm({ name: "", contact_person: "", phone: "", email: "", status: "active" });
          } catch {
            setMessage("Failed to create supplier.");
          }
        })}>Create supplier</Button>
        {message ? <p className="text-sm text-muted-foreground">{message}</p> : null}
      </CardContent>
    </Card>
  );
}

export function ProductCreateCard({ suppliers }: { suppliers: Supplier[] }) {
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
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
    <Card className="rounded-[28px] border border-border/70 bg-card">
      <CardHeader><CardTitle>Create product</CardTitle></CardHeader>
      <CardContent className="grid gap-3">
        <Field label="Brand name"><TextInput value={form.brand_name} onChange={(e) => setForm({ ...form, brand_name: e.target.value })} /></Field>
        <Field label="Generic name"><TextInput value={form.generic_name} onChange={(e) => setForm({ ...form, generic_name: e.target.value })} /></Field>
        <Field label="SKU"><TextInput value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} /></Field>
        <Field label="Supplier"><SelectInput value={form.supplier_id} onChange={(e) => setForm({ ...form, supplier_id: Number(e.target.value) })}>{suppliers.map((supplier) => <option key={supplier.id} value={supplier.id}>{supplier.name}</option>)}</SelectInput></Field>
        <Field label="Category"><SelectInput value={form.category_id} onChange={(e) => setForm({ ...form, category_id: Number(e.target.value) })}>{categoryOptions.map((category) => <option key={category.id} value={category.id}>{category.label}</option>)}</SelectInput></Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Selling price"><TextInput type="number" value={form.selling_price} onChange={(e) => setForm({ ...form, selling_price: Number(e.target.value) })} /></Field>
          <Field label="Reorder level"><TextInput type="number" value={form.reorder_level} onChange={(e) => setForm({ ...form, reorder_level: Number(e.target.value) })} /></Field>
        </div>
        <Button disabled={pending} onClick={() => startTransition(async () => {
          try {
            const created = await createProduct(form);
            setMessage(`Created ${created.brandName}. Refresh to see the latest server list.`);
          } catch {
            setMessage("Failed to create product.");
          }
        })}>Create product</Button>
        {message ? <p className="text-sm text-muted-foreground">{message}</p> : null}
      </CardContent>
    </Card>
  );
}

export function BatchCreateCard({ suppliers, products }: { suppliers: Supplier[]; products: Product[] }) {
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const [form, setForm] = useState<BatchCreateInput>({
    product_id: products[0]?.id ?? 1,
    supplier_id: suppliers[0]?.id ?? 1,
    batch_number: "",
    expiry_date: "",
    quantity_received: 0,
    purchase_cost: 0,
  });

  return (
    <Card className="rounded-[28px] border border-border/70 bg-card">
      <CardHeader><CardTitle>Create batch</CardTitle></CardHeader>
      <CardContent className="grid gap-3">
        <Field label="Product"><SelectInput value={form.product_id} onChange={(e) => setForm({ ...form, product_id: Number(e.target.value) })}>{products.map((product) => <option key={product.id} value={product.id}>{product.brandName}</option>)}</SelectInput></Field>
        <Field label="Supplier"><SelectInput value={form.supplier_id} onChange={(e) => setForm({ ...form, supplier_id: Number(e.target.value) })}>{suppliers.map((supplier) => <option key={supplier.id} value={supplier.id}>{supplier.name}</option>)}</SelectInput></Field>
        <Field label="Batch number"><TextInput value={form.batch_number} onChange={(e) => setForm({ ...form, batch_number: e.target.value })} /></Field>
        <Field label="Expiry date"><TextInput type="date" value={form.expiry_date} onChange={(e) => setForm({ ...form, expiry_date: e.target.value })} /></Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Quantity received"><TextInput type="number" value={form.quantity_received} onChange={(e) => setForm({ ...form, quantity_received: Number(e.target.value) })} /></Field>
          <Field label="Purchase cost"><TextInput type="number" step="0.01" value={form.purchase_cost} onChange={(e) => setForm({ ...form, purchase_cost: Number(e.target.value) })} /></Field>
        </div>
        <Button disabled={pending} onClick={() => startTransition(async () => {
          try {
            const created = await createBatch(form);
            setMessage(`Recorded ${created.batchNumber}. Refresh to see the latest server list.`);
          } catch {
            setMessage("Failed to create batch.");
          }
        })}>Create batch</Button>
        {message ? <p className="text-sm text-muted-foreground">{message}</p> : null}
      </CardContent>
    </Card>
  );
}

export function SaleCreateCard({ products }: { products: Product[] }) {
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const [form, setForm] = useState({ product_id: products[0]?.id ?? 1, quantity: 1, customer_type: "walk-in" });

  return (
    <Card className="rounded-[28px] border border-border/70 bg-card">
      <CardHeader><CardTitle>Record sale</CardTitle></CardHeader>
      <CardContent className="grid gap-3">
        <Field label="Product"><SelectInput value={form.product_id} onChange={(e) => setForm({ ...form, product_id: Number(e.target.value) })}>{products.map((product) => <option key={product.id} value={product.id}>{product.brandName}</option>)}</SelectInput></Field>
        <Field label="Customer type"><SelectInput value={form.customer_type} onChange={(e) => setForm({ ...form, customer_type: e.target.value })}><option value="walk-in">Walk-in</option><option value="senior">Senior</option><option value="member">Member</option></SelectInput></Field>
        <Field label="Quantity"><TextInput type="number" min={1} value={form.quantity} onChange={(e) => setForm({ ...form, quantity: Number(e.target.value) })} /></Field>
        <Button disabled={pending} onClick={() => startTransition(async () => {
          try {
            const payload: SaleCreateInput = { customer_type: form.customer_type, items: [{ product_id: form.product_id, quantity: form.quantity }] };
            const created = await createSale(payload);
            setMessage(`Posted ${created.saleNumber}. Refresh to see the latest server list.`);
          } catch {
            setMessage("Failed to create sale.");
          }
        })}>Post sale</Button>
        {message ? <p className="text-sm text-muted-foreground">{message}</p> : null}
      </CardContent>
    </Card>
  );
}
