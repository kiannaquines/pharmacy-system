"use client";

import { ModuleCrudPage } from "@/components/module-crud-page";
import { createSale, updateSale } from "@/lib/api";
import { formatCurrency } from "@/lib/format";
import type { Product, Sale } from "@/lib/types";

type Props = {
  initialSales: Sale[];
  products: Product[];
};

export function SalesModuleClient({ initialSales, products }: Props) {
  return (
    <ModuleCrudPage
      title="Sales"
      description="Create and edit sales using dialogs and alert feedback."
      createTitle="Add sale"
      createDescription="Use the dialog to create a sale entry."
      initialData={initialSales}
      emptyMessage="No sales found."
      headers={["Sale", "Date", "Customer", "Net Amount", "Actions"]}
      renderRow={(sale: any) => [
        <span key="saleNumber" className="font-medium">
          {sale.saleNumber}
        </span>,
        <span key="saleDate">{sale.saleDate}</span>,
        <span key="customerType">{sale.customerType}</span>,
        <span key="netAmount">{formatCurrency(sale.netAmount)}</span>,
      ]}
      initialForm={{
        customer_type: "walk-in",
        product_id: products[0]?.id ?? 1,
        quantity: 1,
      }}
      fields={[
        {
          name: "customer_type",
          label: "Customer type",
          kind: "select",
          options: [
            { label: "Walk-in", value: "walk-in" },
            { label: "Senior", value: "senior" },
            { label: "Member", value: "member" },
          ],
        },
        {
          name: "product_id",
          label: "Product",
          kind: "select",
          options: products.map((p) => ({ label: p.brandName, value: p.id })),
        },
        { name: "quantity", label: "Quantity", type: "number" },
      ]}
      toForm={(sale: any) => ({
        customer_type: sale.customerType,
        product_id: products[0]?.id ?? 1,
        quantity: 1,
      })}
      onCreate={(payload) =>
        createSale({
          customer_type: String(payload.customer_type),
          items: [
            {
              product_id: Number(payload.product_id),
              quantity: Number(payload.quantity),
            },
          ],
        })
      }
      onUpdate={(id, payload) =>
        updateSale(id, { customer_type: String(payload.customer_type) })
      }
    />
  );
}
