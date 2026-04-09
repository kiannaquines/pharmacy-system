export type SummaryCard = {
  label: string;
  value: string;
  helper: string;
};

// Re-export API types as canonical UI types
export type {
  SupplierRead as Supplier,
  ProductRead as Product,
  StockBatchRead as Batch,
  SaleRead as Sale,
} from "@/lib/api";
