import { PackageSearch } from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function PharmacyDataTable<T>({
  headers,
  data,
  emptyMessage,
  renderRow,
}: {
  headers: string[];
  data: T[];
  emptyMessage: string;
  renderRow: (row: T) => React.ReactNode[];
}) {
  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/40 hover:bg-muted/40">
            {headers.map((header) => (
              <TableHead
                key={header}
                className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground"
              >
                {header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length ? (
            data.map((row, index) => (
              <TableRow
                key={index}
                className={index % 2 === 1 ? "bg-muted/20" : undefined}
              >
                {renderRow(row).map((cell, cellIndex) => (
                  <TableCell key={cellIndex}>{cell}</TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={headers.length}>
                <div className="flex flex-col items-center gap-2 py-10 text-muted-foreground">
                  <PackageSearch className="h-8 w-8 opacity-40" />
                  <p className="text-sm">{emptyMessage}</p>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
