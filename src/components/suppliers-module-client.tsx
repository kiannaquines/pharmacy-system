"use client";

import { ModuleCrudPage } from "@/components/module-crud-page";
import { createSupplier, updateSupplier } from "@/lib/api";
import type { Supplier } from "@/lib/types";

export function SuppliersModuleClient({
  initialSuppliers,
}: {
  initialSuppliers: Supplier[];
}) {
  return (
    <ModuleCrudPage
      title="Suppliers"
      description="Create and edit suppliers using dialog forms."
      createTitle="Add supplier"
      createDescription="Use the dialog to add a new supplier."
      initialData={initialSuppliers}
      emptyMessage="No suppliers found."
      headers={["Supplier", "Phone", "Email", "Status", "Actions"]}
      renderRow={(supplier: any) => [
        <div key="name">
          <p className="font-semibold">{supplier.name}</p>
          <p className="text-sm text-muted-foreground">
            {supplier.contactPerson}
          </p>
        </div>,
        <span key="phone">{supplier.phone}</span>,
        <span key="email">{supplier.email}</span>,
        <span key="status">{supplier.status}</span>,
      ]}
      initialForm={{
        name: "",
        contact_person: "",
        phone: "",
        email: "",
        status: "active",
      }}
      fields={[
        { name: "name", label: "Supplier name" },
        { name: "contact_person", label: "Contact person" },
        { name: "phone", label: "Phone" },
        { name: "email", label: "Email", type: "email" },
        {
          name: "status",
          label: "Status",
          kind: "select",
          options: [
            { label: "Active", value: "active" },
            { label: "Inactive", value: "inactive" },
          ],
        },
      ]}
      toForm={(supplier: any) => ({
        name: supplier.name,
        contact_person: supplier.contactPerson,
        phone: supplier.phone,
        email: supplier.email,
        status: supplier.status,
      })}
      onCreate={(payload) =>
        createSupplier({
          name: String(payload.name),
          contact_person: String(payload.contact_person),
          phone: String(payload.phone),
          email: String(payload.email),
          status: String(payload.status),
        })
      }
      onUpdate={(id, payload) =>
        updateSupplier(id, {
          name: String(payload.name),
          contact_person: String(payload.contact_person),
          phone: String(payload.phone),
          email: String(payload.email),
          status: String(payload.status),
        })
      }
    />
  );
}
