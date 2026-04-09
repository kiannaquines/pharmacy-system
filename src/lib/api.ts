import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000/api/v1",
});

// ── Auth types ────────────────────────────────────────────────────────────────

export type LoginInput = {
  email: string;
  password: string;
  tenant_slug: string;
};

export type TokenResponse = {
  access_token: string;
  token_type: string;
  expires_in: number;
  session_id: string;
  role: string;
  permissions: string[];
  tenant_slug: string;
};

export type RegistrationInput = {
  tenant_name: string;
  tenant_slug: string;
  full_name: string;
  email: string;
  password: string;
  phone?: string;
};

export type UserSummary = {
  id: number;
  full_name: string;
  email: string;
  role: string;
  tenant_id: number;
  tenant_slug: string;
  permissions: string[];
};

export type ForgotPasswordInput = {
  email: string;
  tenant_slug: string;
};

export type PasswordResetResponse = {
  message: string;
  reset_token: string;
  expires_at: string;
};

export type ResetPasswordInput = {
  token: string;
  password: string;
};

export type MessageResponse = {
  message: string;
};

// ── Auth API functions ────────────────────────────────────────────────────────

export async function loginUser(payload: LoginInput): Promise<TokenResponse> {
  const { data } = await api.post<TokenResponse>("/auth/login", payload);
  return data;
}

export async function registerUser(
  payload: RegistrationInput,
): Promise<UserSummary> {
  const { data } = await api.post<UserSummary>("/auth/register", payload);
  return data;
}

export async function forgotPassword(
  payload: ForgotPasswordInput,
): Promise<PasswordResetResponse> {
  const { data } = await api.post<PasswordResetResponse>(
    "/auth/forgot-password",
    payload,
  );
  return data;
}

export async function resetPassword(
  payload: ResetPasswordInput,
): Promise<MessageResponse> {
  const { data } = await api.post<MessageResponse>(
    "/auth/reset-password",
    payload,
  );
  return data;
}

export type SupplierCreateInput = {
  name: string;
  contact_person: string;
  phone: string;
  email: string;
  status: string;
};

export type SupplierUpdateInput = SupplierCreateInput;

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

export type ProductUpdateInput = ProductCreateInput;

export type BatchCreateInput = {
  product_id: number;
  supplier_id: number;
  batch_number: string;
  expiry_date: string;
  quantity_received: number;
  purchase_cost: number;
};

export type BatchUpdateInput = BatchCreateInput & {
  quantity_available: number;
};

export type SaleCreateInput = {
  customer_type: string;
  items: Array<{
    product_id: number;
    quantity: number;
  }>;
};

export type SaleUpdateInput = {
  customer_type: string;
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

export async function updateSupplier(id: number, payload: SupplierUpdateInput) {
  const { data } = await api.put(`/suppliers/${id}`, payload);
  return data;
}

export async function createProduct(payload: ProductCreateInput) {
  const { data } = await api.post("/products", payload);
  return data;
}

export async function updateProduct(id: number, payload: ProductUpdateInput) {
  const { data } = await api.put(`/products/${id}`, payload);
  return data;
}

export async function createBatch(payload: BatchCreateInput) {
  const { data } = await api.post("/inventory/batches", payload);
  return data;
}

export async function updateBatch(id: number, payload: BatchUpdateInput) {
  const { data } = await api.put(`/inventory/batches/${id}`, payload);
  return data;
}

export async function createSale(payload: SaleCreateInput) {
  const { data } = await api.post("/sales", payload);
  return data;
}

export async function updateSale(id: number, payload: SaleUpdateInput) {
  const { data } = await api.put(`/sales/${id}`, payload);
  return data;
}
