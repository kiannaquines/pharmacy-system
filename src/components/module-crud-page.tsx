"use client";

import { useState, useTransition } from "react";
import { AlertCircle, CheckCircle2, Pencil, Plus } from "lucide-react";

import { PharmacyDataTable } from "@/components/pharmacy-data-table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
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
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type Notice = { type: "success" | "error"; text: string } | null;

type SelectField = {
  kind: "select";
  name: string;
  label: string;
  options: Array<{ label: string; value: string | number }>;
};

type InputField = {
  kind?: "input";
  name: string;
  label: string;
  type?: string;
};

type FieldDef = SelectField | InputField;

type RowAction<T> = {
  label: string;
  onClick: (row: T) => void;
};

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

function Field({
  field,
  value,
  onChange,
}: {
  field: FieldDef;
  value: string | number;
  onChange: (value: string) => void;
}) {
  return (
    <label className="grid gap-2 text-sm">
      <span className="font-medium text-foreground">{field.label}</span>
      {field.kind === "select" ? (
        <select
          value={String(value ?? "")}
          onChange={(e) => onChange(e.target.value)}
          className="h-11 rounded-xl border border-input bg-background px-3 text-sm outline-none transition focus:border-ring"
        >
          {field.options.map((option) => (
            <option key={option.value} value={String(option.value)}>
              {option.label}
            </option>
          ))}
        </select>
      ) : (
        <Input
          type={field.type ?? "text"}
          value={String(value ?? "")}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
    </label>
  );
}

export function ModuleCrudPage<T extends { id: number }>({
  title,
  description,
  createTitle,
  createDescription,
  initialData,
  emptyMessage,
  headers,
  renderRow,
  fields,
  initialForm,
  toForm,
  onCreate,
  onUpdate,
}: {
  title: string;
  description: string;
  createTitle: string;
  createDescription: string;
  initialData: T[];
  emptyMessage: string;
  headers: string[];
  renderRow: (row: T) => React.ReactNode[];
  fields: FieldDef[];
  initialForm: Record<string, string | number>;
  toForm?: (row: T) => Record<string, string | number>;
  onCreate: (payload: Record<string, any>) => Promise<T>;
  onUpdate: (id: number, payload: Record<string, any>) => Promise<T>;
}) {
  const [rows, setRows] = useState(initialData);
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editingRow, setEditingRow] = useState<T | null>(null);
  const [createForm, setCreateForm] = useState(initialForm);
  const [editForm, setEditForm] = useState(initialForm);
  const [pending, startTransition] = useTransition();
  const [notice, setNotice] = useState<Notice>(null);

  function updateFormValue(
    target: "create" | "edit",
    name: string,
    value: string,
  ) {
    const maybeNumber =
      fields.find((field) => field.name === name)?.kind !== "select" &&
      ["number"].includes(
        (fields.find((field) => field.name === name) as InputField | undefined)
          ?.type ?? "",
      )
        ? Number(value)
        : value;

    if (target === "create")
      setCreateForm((current) => ({ ...current, [name]: maybeNumber }));
    else setEditForm((current) => ({ ...current, [name]: maybeNumber }));
  }

  function openEdit(row: T) {
    setEditingRow(row);
    setEditForm(
      toForm
        ? toForm(row)
        : (row as unknown as Record<string, string | number>),
    );
    setEditOpen(true);
  }

  return (
    <div className="grid gap-5">
      <NoticeAlert notice={notice} />

      <Card className="border border-border bg-card">
        <CardHeader className="flex flex-row items-center justify-between gap-4">
          <div>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          <Dialog open={createOpen} onOpenChange={setCreateOpen}>
            <DialogTrigger className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground transition hover:opacity-90">
              <Plus className="h-3.5 w-3.5" />
              Add new
            </DialogTrigger>
            <DialogContent className="rounded-2xl">
              <DialogHeader>
                <DialogTitle>{createTitle}</DialogTitle>
                <DialogDescription>{createDescription}</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4">
                {fields.map((field) => (
                  <Field
                    key={field.name}
                    field={field}
                    value={createForm[field.name]}
                    onChange={(value) =>
                      updateFormValue("create", field.name, value)
                    }
                  />
                ))}
              </div>
              <DialogFooter>
                <Button
                  disabled={pending}
                  onClick={() =>
                    startTransition(async () => {
                      try {
                        const created = await onCreate(createForm);
                        setRows((current) => [created, ...current]);
                        setCreateForm(initialForm);
                        setCreateOpen(false);
                        setNotice({
                          type: "success",
                          text: `${title.slice(0, -1)} added successfully.`,
                        });
                      } catch {
                        setNotice({
                          type: "error",
                          text: `Failed to add ${title.slice(0, -1).toLowerCase()}.`,
                        });
                      }
                    })
                  }
                >
                  Save
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <PharmacyDataTable
            headers={headers}
            data={rows}
            emptyMessage={emptyMessage}
            renderRow={(row) => [
              ...renderRow(row),
              <div key="actions" className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openEdit(row)}
                >
                  <Pencil className="h-4 w-4" />
                  Edit
                </Button>
              </div>,
            ]}
          />
        </CardContent>
      </Card>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="rounded-2xl">
          <DialogHeader>
            <DialogTitle>Edit {title.slice(0, -1)}</DialogTitle>
            <DialogDescription>
              Update the selected record using a dialog form.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            {fields.map((field) => (
              <Field
                key={field.name}
                field={field}
                value={editForm[field.name]}
                onChange={(value) => updateFormValue("edit", field.name, value)}
              />
            ))}
          </div>
          <DialogFooter>
            <Button
              disabled={pending || !editingRow}
              onClick={() =>
                startTransition(async () => {
                  if (!editingRow) return;
                  try {
                    const updated = await onUpdate(editingRow.id, editForm);
                    setRows((current) =>
                      current.map((row) =>
                        row.id === updated.id ? updated : row,
                      ),
                    );
                    setEditOpen(false);
                    setNotice({
                      type: "success",
                      text: `${title.slice(0, -1)} updated successfully.`,
                    });
                  } catch {
                    setNotice({
                      type: "error",
                      text: `Failed to update ${title.slice(0, -1).toLowerCase()}.`,
                    });
                  }
                })
              }
            >
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
