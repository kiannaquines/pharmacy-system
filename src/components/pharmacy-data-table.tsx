import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export type DataTableColumn<T> = {
  key: string;
  header: string;
  cell: (row: T) => React.ReactNode;
  className?: string;
};

export function PharmacyDataTable<T>({
  columns,
  data,
  emptyMessage,
  actions,
}: {
  columns: DataTableColumn<T>[];
  data: T[];
  emptyMessage: string;
  actions?: (row: T) => React.ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border/70 bg-white">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/40 hover:bg-muted/40">
            {columns.map((column) => (
              <TableHead key={column.key} className={column.className}>{column.header}</TableHead>
            ))}
            {actions ? <TableHead className="text-right">Actions</TableHead> : null}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length ? data.map((row, index) => (
            <TableRow key={index}>
              {columns.map((column) => (
                <TableCell key={column.key} className={column.className}>{column.cell(row)}</TableCell>
              ))}
              {actions ? <TableCell className="text-right">{actions(row)}</TableCell> : null}
            </TableRow>
          )) : (
            <TableRow>
              <TableCell colSpan={columns.length + (actions ? 1 : 0)} className="h-24 text-center text-muted-foreground">
                {emptyMessage}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

export function DisabledCrudActions() {
  return (
    <div className="flex justify-end gap-2">
      <Button variant="outline" size="sm" disabled>Edit</Button>
      <Button variant="outline" size="sm" disabled>Delete</Button>
    </div>
  );
}
