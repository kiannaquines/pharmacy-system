export type SummaryCard = {
  label: string;
  value: string;
  helper: string;
};

export type Supplier = {
  id: number;
  name: string;
  contactPerson: string;
  phone: string;
  email: string;
  status: string;
};

export type Product = {
  id: number;
  sku: string;
  genericName: string;
  brandName: string;
  category: string;
  classification: string;
  unit: string;
  sellingPrice: number;
  reorderLevel: number;
  stockAvailable: number;
};

export type Batch = {
  batchNumber: string;
  product: string;
  expiryDate: string;
  quantityReceived: number;
  quantityAvailable: number;
  purchaseCost: number;
  supplier: string;
};

export type Sale = {
  saleNumber: string;
  saleDate: string;
  customerType: string;
  grossAmount: number;
  discountAmount: number;
  netAmount: number;
  items: number;
};
