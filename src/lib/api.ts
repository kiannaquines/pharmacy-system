import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000/api/v1",
});

export type SupplierCreateInput = {
  name: string;
  contact_person: string;
  phone: string;
  email: string;
  status: string;
};

export type ProductCreateInput = {
  category_id: number;
  supplier_id: number;
  sku: string;
  generic_name: string;
  brand_name: string;
  classification: string;
  unit: string;
  selling_price: number;
  reorder_level: number;
};

export type BatchCreateInput = {
  product_id: number;
  supplier_id: number;
  batch_number: string;
  expiry_date: string;
  quantity_received: number;
  purchase_cost: number;
};

export type SaleCreateInput = {
  customer_type: string;
  items: Array<{
    product_id: number;
    quantity: number;
  }>;
};

export async function fetchDashboardSummary() {
  const { data } = await api.get("/dashboard/summary");
  return data;
}

export async function fetchSuppliers() {
  const { data } = await api.get("/suppliers");
  return data;
}

export async function fetchProducts() {
  const { data } = await api.get("/products");
  return data;
}

export async function fetchBatches() {
  const { data } = await api.get("/inventory/batches");
  return data;
}

export async function fetchSales() {
  const { data } = await api.get("/sales");
  return data;
}

export async function createSupplier(payload: SupplierCreateInput) {
  const { data } = await api.post("/suppliers", payload);
  return data;
}

export async function createProduct(payload: ProductCreateInput) {
  const { data } = await api.post("/products", payload);
  return data;
}

export async function createBatch(payload: BatchCreateInput) {
  const { data } = await api.post("/inventory/batches", payload);
  return data;
}

export async function createSale(payload: SaleCreateInput) {
  const { data } = await api.post("/sales", payload);
  return data;
}
