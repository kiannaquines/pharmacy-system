import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

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
    <div className="overflow-hidden rounded-2xl border border-border/70 bg-white">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/40 hover:bg-muted/40">
            {headers.map((header) => (
              <TableHead key={header}>{header}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length ? data.map((row, index) => (
            <TableRow key={index}>
              {renderRow(row).map((cell, cellIndex) => (
                <TableCell key={cellIndex}>{cell}</TableCell>
              ))}
            </TableRow>
          )) : (
            <TableRow>
              <TableCell colSpan={headers.length} className="h-24 text-center text-muted-foreground">
                {emptyMessage}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
