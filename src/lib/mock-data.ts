import { Batch, Product, Sale, Supplier, SummaryCard } from "@/lib/types";

export const summaryCards: SummaryCard[] = [
  { label: "Total products", value: "1,420", helper: "+24 this month" },
  { label: "Suppliers", value: "48", helper: "6 active this week" },
  { label: "Low stock", value: "19", helper: "Needs reorder planning" },
  { label: "Near expiry", value: "12", helper: "Within 30 days" },
];

export const suppliers: Supplier[] = [
  {
    id: 1,
    name: "MediCore Distributors",
    contactPerson: "Angela Cruz",
    phone: "+63 912 345 6789",
    email: "orders@medicore.example",
    status: "active",
  },
  {
    id: 2,
    name: "HealthFirst Supply",
    contactPerson: "Noel Reyes",
    phone: "+63 917 222 4411",
    email: "support@healthfirst.example",
    status: "active",
  },
  {
    id: 3,
    name: "PrimeCare Wholesale",
    contactPerson: "Lea Ramos",
    phone: "+63 918 555 1200",
    email: "sales@primecare.example",
    status: "review",
  },
];

export const products: Product[] = [
  {
    id: 1001,
    sku: "MED-001",
    genericName: "Paracetamol",
    brandName: "Biogesic",
    category: "OTC Medicines",
    classification: "branded",
    unit: "tablet",
    sellingPrice: 8.5,
    reorderLevel: 100,
    stockAvailable: 560,
  },
  {
    id: 1002,
    sku: "MED-002",
    genericName: "Cetirizine",
    brandName: "Allerkid",
    category: "Prescription Medicines",
    classification: "generic",
    unit: "tablet",
    sellingPrice: 12,
    reorderLevel: 80,
    stockAvailable: 73,
  },
  {
    id: 1003,
    sku: "SUP-101",
    genericName: "Surgical Mask",
    brandName: "SafeBreath",
    category: "Medical Supplies",
    classification: "branded",
    unit: "piece",
    sellingPrice: 6.25,
    reorderLevel: 250,
    stockAvailable: 180,
  },
];

export const batches: Batch[] = [
  {
    batchNumber: "BATCH-24001",
    product: "Biogesic",
    expiryDate: "2026-08-15",
    quantityReceived: 500,
    quantityAvailable: 320,
    purchaseCost: 5.25,
    supplier: "MediCore Distributors",
  },
  {
    batchNumber: "BATCH-24002",
    product: "Allerkid",
    expiryDate: "2026-05-02",
    quantityReceived: 100,
    quantityAvailable: 73,
    purchaseCost: 8.15,
    supplier: "HealthFirst Supply",
  },
  {
    batchNumber: "BATCH-24003",
    product: "SafeBreath",
    expiryDate: "2027-01-30",
    quantityReceived: 1000,
    quantityAvailable: 180,
    purchaseCost: 2.1,
    supplier: "PrimeCare Wholesale",
  },
];

export const sales: Sale[] = [
  {
    saleNumber: "SALE-20260409-001",
    saleDate: "2026-04-09",
    customerType: "walk-in",
    grossAmount: 420,
    discountAmount: 20,
    netAmount: 400,
    items: 4,
  },
  {
    saleNumber: "SALE-20260409-002",
    saleDate: "2026-04-09",
    customerType: "senior",
    grossAmount: 760,
    discountAmount: 152,
    netAmount: 608,
    items: 6,
  },
  {
    saleNumber: "SALE-20260409-003",
    saleDate: "2026-04-09",
    customerType: "pwd",
    grossAmount: 1180,
    discountAmount: 236,
    netAmount: 944,
    items: 8,
  },
];
