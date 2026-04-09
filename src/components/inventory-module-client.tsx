"use client";

import { ModuleCrudPage } from "@/components/module-crud-page";
import { createBatch, updateBatch } from "@/lib/api";
import { formatCurrency } from "@/lib/format";
import type { Batch, Product, Supplier } from "@/lib/types";

type Props = {
  initialBatches: Batch[];
  products: Product[];
  suppliers: Supplier[];
};

export function InventoryModuleClient({
  initialBatches,
  products,
  suppliers,
}: Props) {
  return (
    <ModuleCrudPage
      title="Batches"
      description="Create and edit inventory batches using dialog forms."
      createTitle="Add batch"
      createDescription="Use the dialog to create a stock batch."
      initialData={initialBatches}
      emptyMessage="No batches found."
      headers={["Product", "Supplier", "Cost", "Available", "Actions"]}
      renderRow={(batch: any) => [
        <div key="product">
          <p className="font-semibold">{batch.product}</p>
          <p className="text-sm text-muted-foreground">{batch.batchNumber}</p>
        </div>,
        <span key="supplier">{batch.supplier}</span>,
        <span key="cost">{formatCurrency(batch.purchaseCost)}</span>,
        <span key="available">{batch.quantityAvailable}</span>,
      ]}
      initialForm={{
        product_id: products[0]?.id ?? 1,
        supplier_id: suppliers[0]?.id ?? 1,
        batch_number: "",
        expiry_date: "",
        quantity_received: 0,
        quantity_available: 0,
        purchase_cost: 0,
      }}
      fields={[
        {
          name: "product_id",
          label: "Product",
          kind: "select",
          options: products.map((p) => ({ label: p.brandName, value: p.id })),
        },
        {
          name: "supplier_id",
          label: "Supplier",
          kind: "select",
          options: suppliers.map((s) => ({ label: s.name, value: s.id })),
        },
        { name: "batch_number", label: "Batch number" },
        { name: "expiry_date", label: "Expiry date", type: "date" },
        {
          name: "quantity_received",
          label: "Quantity received",
          type: "number",
        },
        {
          name: "quantity_available",
          label: "Quantity available",
          type: "number",
        },
        { name: "purchase_cost", label: "Purchase cost", type: "number" },
      ]}
      toForm={(batch: any) => ({
        product_id: products[0]?.id ?? 1,
        supplier_id:
          suppliers.find((s) => s.name === batch.supplier)?.id ??
          suppliers[0]?.id ??
          1,
        batch_number: batch.batchNumber,
        expiry_date: batch.expiryDate,
        quantity_received: batch.quantityReceived,
        quantity_available: batch.quantityAvailable,
        purchase_cost: batch.purchaseCost,
      })}
      onCreate={(payload) =>
        createBatch({
          product_id: Number(payload.product_id),
          supplier_id: Number(payload.supplier_id),
          batch_number: String(payload.batch_number),
          expiry_date: String(payload.expiry_date),
          quantity_received: Number(payload.quantity_received),
          purchase_cost: Number(payload.purchase_cost),
        })
      }
      onUpdate={(id, payload) =>
        updateBatch(id, {
          product_id: Number(payload.product_id),
          supplier_id: Number(payload.supplier_id),
          batch_number: String(payload.batch_number),
          expiry_date: String(payload.expiry_date),
          quantity_received: Number(payload.quantity_received),
          quantity_available: Number(payload.quantity_available),
          purchase_cost: Number(payload.purchase_cost),
        })
      }
    />
  );
}
