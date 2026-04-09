"use client";

import { useState, useTransition } from "react";
import { AlertCircle, CheckCircle2, Pencil, Plus } from "lucide-react";

import { PharmacyDataTable } from "@/components/pharmacy-data-table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { createProduct, updateProduct } from "@/lib/api";
import { formatCurrency } from "@/lib/format";
import type { Product, Supplier } from "@/lib/types";

const categoryOptions = [
  { label: "OTC Medicines", value: 1 },
  { label: "Prescription Medicines", value: 2 },
  { label: "Supplements", value: 3 },
  { label: "Personal Care", value: 4 },
];

type Notice = { type: "success" | "error"; text: string } | null;

type FormState = {
  category_id: number;
  supplier_id: number;
  sku: string;
  generic_name: string;
  brand_name: string;
  classification: string;
  unit: string;
  selling_price: number;
  reorder_level: number;
};

function NoticeAlert({ notice }: { notice: Notice }) {
  if (!notice) return null;
  return (
    <Alert variant={notice.type === "error" ? "destructive" : "default"}>
      {notice.type === "error" ? <AlertCircle className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
      <AlertTitle>{notice.type === "error" ? "Action failed" : "Action completed"}</AlertTitle>
      <AlertDescription>{notice.text}</AlertDescription>
    </Alert>
  );
}

export function ProductModuleClient({ initialProducts, suppliers }: { initialProducts: Product[]; suppliers: Supplier[] }) {
  const [rows, setRows] = useState(initialProducts);
  const [notice, setNotice] = useState<Notice>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [pending, startTransition] = useTransition();
  const emptyForm: FormState = {
    category_id: 1,
    supplier_id: suppliers[0]?.id ?? 1,
    sku: "",
    generic_name: "",
    brand_name: "",
    classification: "branded",
    unit: "tablet",
    selling_price: 0,
    reorder_level: 0,
  };
  const [createForm, setCreateForm] = useState<FormState>(emptyForm);
  const [editForm, setEditForm] = useState<FormState>(emptyForm);

  function setEditFromRow(row: Product) {
    setEditing(row);
    setEditForm({
      category_id: categoryOptions.find((option) => option.label === row.category)?.value ?? 1,
      supplier_id: suppliers[0]?.id ?? 1,
      sku: row.sku,
      generic_name: row.genericName,
      brand_name: row.brandName,
      classification: row.classification,
      unit: row.unit,
      selling_price: row.sellingPrice,
      reorder_level: row.reorderLevel,
    });
    setEditOpen(true);
  }

  return (
    <div className="grid gap-5">
      <NoticeAlert notice={notice} />
      <Card className="rounded-[28px] border border-border/70 bg-card">
        <CardHeader className="flex flex-row items-center justify-between gap-4">
          <div>
            <CardTitle>Products</CardTitle>
            <CardDescription>Create and edit products using dialog forms.</CardDescription>
          </div>
          <Dialog open={createOpen} onOpenChange={setCreateOpen}>
            <DialogTrigger className="inline-flex h-10 items-center gap-2 rounded-xl bg-primary px-4 text-sm font-medium text-primary-foreground">
              <Plus className="h-4 w-4" /> Add
            </DialogTrigger>
            <DialogContent className="rounded-3xl">
              <DialogHeader>
                <DialogTitle>Add product</DialogTitle>
                <DialogDescription>Use the dialog to add a new product to the catalog.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-3">
                <Input placeholder="Brand name" value={createForm.brand_name} onChange={(e) => setCreateForm({ ...createForm, brand_name: e.target.value })} />
                <Input placeholder="Generic name" value={createForm.generic_name} onChange={(e) => setCreateForm({ ...createForm, generic_name: e.target.value })} />
                <Input placeholder="SKU" value={createForm.sku} onChange={(e) => setCreateForm({ ...createForm, sku: e.target.value })} />
              </div>
              <DialogFooter>
                <Button disabled={pending} onClick={() => startTransition(async () => {
                  try {
                    const created = await createProduct(createForm);
                    setRows((current) => [created, ...current]);
                    setCreateForm(emptyForm);
                    setCreateOpen(false);
                    setNotice({ type: "success", text: "Product added successfully." });
                  } catch {
                    setNotice({ type: "error", text: "Failed to add product." });
                  }
                })}>Save</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <PharmacyDataTable
            headers={["Product", "Category", "Price", "Stock", "Actions"]}
            data={rows}
            emptyMessage="No products found."
            renderRow={(product) => [
              <div key="product"><p className="font-semibold">{product.brandName}</p><p className="text-sm text-muted-foreground">{product.genericName} • {product.sku}</p></div>,
              <span key="category">{product.category}</span>,
              <span key="price">{formatCurrency(product.sellingPrice)}</span>,
              <span key="stock">{product.stockAvailable}</span>,
              <div key="actions" className="flex justify-end"><Button variant="outline" size="sm" onClick={() => setEditFromRow(product)}><Pencil className="h-4 w-4" />Edit</Button></div>,
            ]}
          />
        </CardContent>
      </Card>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="rounded-3xl">
          <DialogHeader>
            <DialogTitle>Edit product</DialogTitle>
            <DialogDescription>Update the selected product.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-3">
            <Input placeholder="Brand name" value={editForm.brand_name} onChange={(e) => setEditForm({ ...editForm, brand_name: e.target.value })} />
            <Input placeholder="Generic name" value={editForm.generic_name} onChange={(e) => setEditForm({ ...editForm, generic_name: e.target.value })} />
            <Input placeholder="SKU" value={editForm.sku} onChange={(e) => setEditForm({ ...editForm, sku: e.target.value })} />
          </div>
          <DialogFooter>
            <Button disabled={pending || !editing} onClick={() => startTransition(async () => {
              if (!editing) return;
              try {
                const updated = await updateProduct(editing.id, editForm);
                setRows((current) => current.map((row) => row.id === updated.id ? updated : row));
                setEditOpen(false);
                setNotice({ type: "success", text: "Product updated successfully." });
              } catch {
                setNotice({ type: "error", text: "Failed to update product." });
              }
            })}>Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
