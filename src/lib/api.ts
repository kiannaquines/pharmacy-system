import axios from "axios";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000/api/v1";

export const api = axios.create({ baseURL: BASE_URL });

// Attach auth headers on every browser-side request
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("access_token");
    const tenantSlug = localStorage.getItem("tenant_slug");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    if (tenantSlug) config.headers["X-Tenant-Slug"] = tenantSlug;
  }
  return config;
});

// ── Shared helpers ────────────────────────────────────────────────────────────

export type PageMeta = {
  page: number;
  limit: number;
  total: number;
  total_pages: number;
};

export type PaginatedResponse<T> = {
  items: T[];
  meta: PageMeta;
};

export type MessageResponse = {
  message: string;
};

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

export type SessionRead = {
  id: number;
  session_id: string;
  user_agent: string;
  ip_address: string;
  created_at: string;
  last_seen_at: string;
  expires_at: string;
  is_current: boolean;
  is_revoked: boolean;
};

// ── Tenant types ──────────────────────────────────────────────────────────────

export type TenantRead = {
  id: number;
  name: string;
  slug: string;
  legal_name: string;
  contact_email: string | null;
  contact_phone: string;
  address_line_1: string;
  address_line_2: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type TenantUpdate = {
  name: string;
  legal_name?: string;
  contact_email?: string | null;
  contact_phone?: string;
  address_line_1?: string;
  address_line_2?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  country?: string;
};

// ── User types ────────────────────────────────────────────────────────────────

export type UserRead = {
  id: number;
  full_name: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  role_id: number;
  role_code: string;
  role_name: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  last_login_at: string | null;
};

export type UserCreate = {
  full_name: string;
  first_name?: string;
  last_name?: string;
  email: string;
  phone?: string;
  role_id: number;
  password: string;
  is_active?: boolean;
};

export type UserUpdate = {
  full_name: string;
  first_name?: string;
  last_name?: string;
  email: string;
  phone?: string;
  role_id: number;
  is_active?: boolean;
};

export type UserPasswordUpdate = {
  password: string;
};

// ── Role types ────────────────────────────────────────────────────────────────

export type RoleRead = {
  id: number;
  code: string;
  name: string;
  description: string;
  permissions: string[];
  is_system: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type RoleCreate = {
  code: string;
  name: string;
  description?: string;
  permissions: string[];
  is_active?: boolean;
};

export type RoleUpdate = {
  name: string;
  description?: string;
  permissions: string[];
  is_active?: boolean;
};

// ── Settings types ────────────────────────────────────────────────────────────

export type SiteSettingsRead = {
  pharmacy_name: string;
  legal_name: string;
  support_email: string;
  support_phone: string;
  currency: string;
  timezone: string;
  tax_id: string;
  address_line_1: string;
  address_line_2: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  receipt_footer: string;
  low_stock_threshold: string;
  logo_url: string;
};

export type SiteSettingsUpdate = Partial<SiteSettingsRead>;

// ── Customer types ────────────────────────────────────────────────────────────

export type CustomerRead = {
  id: number;
  customer_code: string;
  full_name: string;
  email: string | null;
  phone: string;
  gender: string;
  birth_date: string | null;
  address_line_1: string;
  address_line_2: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  notes: string;
  loyalty_points: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type CustomerCreate = {
  customer_code: string;
  full_name: string;
  email?: string | null;
  phone?: string;
  gender?: string;
  birth_date?: string | null;
  address_line_1?: string;
  address_line_2?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  country?: string;
  notes?: string;
  loyalty_points?: number;
  is_active?: boolean;
};

export type CustomerUpdate = CustomerCreate;

// ── Supplier types ────────────────────────────────────────────────────────────

export type SupplierRead = {
  id: number;
  supplier_code: string;
  name: string;
  contact_person: string;
  phone: string;
  email: string | null;
  address_line_1: string;
  address_line_2: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  tax_id: string;
  payment_terms: string;
  notes: string;
  status: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type SupplierCreate = {
  supplier_code: string;
  name: string;
  contact_person?: string;
  phone?: string;
  email?: string | null;
  address_line_1?: string;
  address_line_2?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  country?: string;
  tax_id?: string;
  payment_terms?: string;
  notes?: string;
  status?: string;
  is_active?: boolean;
};

export type SupplierUpdate = SupplierCreate;

// Keep legacy aliases for existing component compatibility
export type SupplierCreateInput = SupplierCreate;
export type SupplierUpdateInput = SupplierUpdate;

// ── Product types ─────────────────────────────────────────────────────────────

export type ProductCategoryRead = {
  id: number;
  name: string;
  description: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type ProductCategoryCreate = {
  name: string;
  description?: string;
  is_active?: boolean;
};

export type ProductCategoryUpdate = ProductCategoryCreate;

export type ProductRead = {
  id: number;
  sku: string;
  barcode: string;
  generic_name: string;
  brand_name: string;
  category_id: number;
  category_name: string;
  supplier_id: number;
  supplier_name: string;
  classification: string;
  dosage_form: string;
  strength: string;
  manufacturer: string;
  unit: string;
  description: string;
  cost_price: number;
  selling_price: number;
  tax_rate: number;
  reorder_level: number;
  max_stock_level: number;
  requires_prescription: boolean;
  is_active: boolean;
  stock_available: number;
  created_at: string;
  updated_at: string;
};

export type ProductCreate = {
  category_id: number;
  supplier_id: number;
  sku: string;
  barcode?: string;
  generic_name: string;
  brand_name: string;
  classification: string;
  dosage_form?: string;
  strength?: string;
  manufacturer?: string;
  unit: string;
  description?: string;
  cost_price?: number;
  selling_price: number;
  tax_rate?: number;
  reorder_level?: number;
  max_stock_level?: number;
  requires_prescription?: boolean;
  is_active?: boolean;
};

export type ProductUpdate = ProductCreate;

// Keep legacy aliases
export type ProductCreateInput = ProductCreate;
export type ProductUpdateInput = ProductUpdate;

// ── Inventory types ───────────────────────────────────────────────────────────

export type StockBatchRead = {
  id: number;
  batch_number: string;
  product_id: number;
  product_name: string;
  supplier_id: number;
  supplier_name: string;
  expiry_date: string;
  quantity_received: number;
  quantity_available: number;
  purchase_cost: number;
  received_at: string;
  created_at: string;
  updated_at: string;
};

export type StockBatchCreate = {
  product_id: number;
  supplier_id: number;
  batch_number: string;
  expiry_date: string;
  quantity_received: number;
  purchase_cost: number;
};

export type StockBatchUpdate = StockBatchCreate & {
  quantity_available: number;
};

export type StockAdjustmentCreate = {
  quantity_change: number;
  notes?: string;
};

export type InventoryTransactionRead = {
  id: number;
  transaction_type: string;
  quantity_change: number;
  reference_type: string;
  reference_id: string;
  unit_cost: number;
  notes: string;
  created_at: string;
};

// Keep legacy aliases
export type BatchCreateInput = StockBatchCreate;
export type BatchUpdateInput = StockBatchUpdate;

// ── Sale types ────────────────────────────────────────────────────────────────

export type SaleItemCreate = {
  product_id: number;
  quantity: number;
  discount_amount?: number;
};

export type SaleItemRead = {
  id: number;
  product_id: number;
  product_name: string;
  batch_id: number;
  quantity: number;
  unit_price: number;
  discount_amount: number;
  tax_amount: number;
  subtotal: number;
};

export type SaleRead = {
  id: number;
  sale_number: string;
  sale_date: string;
  customer_id: number | null;
  customer_name: string;
  cashier_id: number;
  cashier_name: string;
  customer_type: string;
  payment_method: string;
  payment_status: string;
  status: string;
  notes: string;
  gross_amount: number;
  discount_amount: number;
  tax_amount: number;
  net_amount: number;
  items: SaleItemRead[];
  created_at: string;
  updated_at: string;
};

export type SaleCreate = {
  customer_id?: number | null;
  customer_type?: string;
  payment_method?: string;
  payment_status?: string;
  discount_amount?: number;
  notes?: string;
  items: SaleItemCreate[];
};

export type SaleUpdate = {
  customer_id?: number | null;
  customer_type?: string;
  payment_method?: string;
  payment_status?: string;
  notes?: string;
};

// Keep legacy aliases
export type SaleCreateInput = SaleCreate;
export type SaleUpdateInput = SaleUpdate;

// ── Dashboard types ───────────────────────────────────────────────────────────

export type DashboardTotals = {
  products: number;
  customers: number;
  suppliers: number;
  lowStock: number;
  nearExpiry: number;
  activeUsers: number;
};

export type DashboardSales = {
  daily: number;
  monthly: number;
  yearly: number;
};

export type TopSellingItem = {
  name: string;
  quantity: number;
};

export type DashboardSummary = {
  totals: DashboardTotals;
  sales: DashboardSales;
  topSelling: TopSellingItem[];
};

// ── Pagination helper ─────────────────────────────────────────────────────────

export type ListParams = {
  page?: number;
  limit?: number;
  search?: string;
};

// ── Auth functions ────────────────────────────────────────────────────────────

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

export async function getMe(): Promise<UserSummary> {
  const { data } = await api.get<UserSummary>("/auth/me");
  return data;
}

export async function getSessions(): Promise<SessionRead[]> {
  const { data } = await api.get<SessionRead[]>("/auth/sessions");
  return data;
}

export async function removeSession(sessionId: string): Promise<MessageResponse> {
  const { data } = await api.delete<MessageResponse>(
    `/auth/sessions/${sessionId}`,
  );
  return data;
}

// ── Dashboard functions ───────────────────────────────────────────────────────

export async function fetchDashboardSummary(): Promise<DashboardSummary> {
  const { data } = await api.get<DashboardSummary>("/dashboard/summary");
  return data;
}

// ── Tenant functions ──────────────────────────────────────────────────────────

export async function fetchCurrentTenant(): Promise<TenantRead> {
  const { data } = await api.get<TenantRead>("/tenants/current");
  return data;
}

export async function updateCurrentTenant(
  payload: TenantUpdate,
): Promise<TenantRead> {
  const { data } = await api.put<TenantRead>("/tenants/current", payload);
  return data;
}

// ── User functions ────────────────────────────────────────────────────────────

export async function fetchUsers(
  params?: ListParams,
): Promise<PaginatedResponse<UserRead>> {
  const { data } = await api.get<PaginatedResponse<UserRead>>("/users", {
    params,
  });
  return data;
}

export async function addUser(payload: UserCreate): Promise<UserRead> {
  const { data } = await api.post<UserRead>("/users", payload);
  return data;
}

export async function fetchUser(userId: number): Promise<UserRead> {
  const { data } = await api.get<UserRead>(`/users/${userId}`);
  return data;
}

export async function updateUser(
  userId: number,
  payload: UserUpdate,
): Promise<UserRead> {
  const { data } = await api.put<UserRead>(`/users/${userId}`, payload);
  return data;
}

export async function removeUser(userId: number): Promise<MessageResponse> {
  const { data } = await api.delete<MessageResponse>(`/users/${userId}`);
  return data;
}

export async function updateUserPassword(
  userId: number,
  payload: UserPasswordUpdate,
): Promise<MessageResponse> {
  const { data } = await api.put<MessageResponse>(
    `/users/${userId}/password`,
    payload,
  );
  return data;
}

// ── Role functions ────────────────────────────────────────────────────────────

export async function fetchRoles(
  params?: ListParams,
): Promise<PaginatedResponse<RoleRead>> {
  const { data } = await api.get<PaginatedResponse<RoleRead>>("/roles", {
    params,
  });
  return data;
}

export async function addRole(payload: RoleCreate): Promise<RoleRead> {
  const { data } = await api.post<RoleRead>("/roles", payload);
  return data;
}

export async function fetchRole(roleId: number): Promise<RoleRead> {
  const { data } = await api.get<RoleRead>(`/roles/${roleId}`);
  return data;
}

export async function updateRole(
  roleId: number,
  payload: RoleUpdate,
): Promise<RoleRead> {
  const { data } = await api.put<RoleRead>(`/roles/${roleId}`, payload);
  return data;
}

export async function removeRole(roleId: number): Promise<MessageResponse> {
  const { data } = await api.delete<MessageResponse>(`/roles/${roleId}`);
  return data;
}

// ── Settings functions ────────────────────────────────────────────────────────

export async function fetchSiteSettings(): Promise<SiteSettingsRead> {
  const { data } = await api.get<SiteSettingsRead>("/settings/site");
  return data;
}

export async function updateSiteSettings(
  payload: SiteSettingsUpdate,
): Promise<SiteSettingsRead> {
  const { data } = await api.put<SiteSettingsRead>("/settings/site", payload);
  return data;
}

// ── Customer functions ────────────────────────────────────────────────────────

export async function fetchCustomers(
  params?: ListParams,
): Promise<PaginatedResponse<CustomerRead>> {
  const { data } = await api.get<PaginatedResponse<CustomerRead>>(
    "/customers",
    { params },
  );
  return data;
}

export async function addCustomer(
  payload: CustomerCreate,
): Promise<CustomerRead> {
  const { data } = await api.post<CustomerRead>("/customers", payload);
  return data;
}

export async function fetchCustomer(customerId: number): Promise<CustomerRead> {
  const { data } = await api.get<CustomerRead>(`/customers/${customerId}`);
  return data;
}

export async function updateCustomer(
  customerId: number,
  payload: CustomerUpdate,
): Promise<CustomerRead> {
  const { data } = await api.put<CustomerRead>(
    `/customers/${customerId}`,
    payload,
  );
  return data;
}

export async function removeCustomer(
  customerId: number,
): Promise<MessageResponse> {
  const { data } = await api.delete<MessageResponse>(
    `/customers/${customerId}`,
  );
  return data;
}

// ── Supplier functions ────────────────────────────────────────────────────────

export async function fetchSuppliers(
  params?: ListParams,
): Promise<SupplierRead[]> {
  const { data } = await api.get<PaginatedResponse<SupplierRead>>(
    "/suppliers",
    { params },
  );
  return data.items;
}

export async function fetchSuppliersPaginated(
  params?: ListParams,
): Promise<PaginatedResponse<SupplierRead>> {
  const { data } = await api.get<PaginatedResponse<SupplierRead>>(
    "/suppliers",
    { params },
  );
  return data;
}

export async function addSupplier(
  payload: SupplierCreate,
): Promise<SupplierRead> {
  const { data } = await api.post<SupplierRead>("/suppliers", payload);
  return data;
}

export async function fetchSupplier(supplierId: number): Promise<SupplierRead> {
  const { data } = await api.get<SupplierRead>(`/suppliers/${supplierId}`);
  return data;
}

export async function updateSupplier(
  supplierId: number,
  payload: SupplierUpdate,
): Promise<SupplierRead> {
  const { data } = await api.put<SupplierRead>(
    `/suppliers/${supplierId}`,
    payload,
  );
  return data;
}

export async function removeSupplier(
  supplierId: number,
): Promise<MessageResponse> {
  const { data } = await api.delete<MessageResponse>(
    `/suppliers/${supplierId}`,
  );
  return data;
}

// Keep legacy alias
export const createSupplier = addSupplier;

// ── Product category functions ────────────────────────────────────────────────

export async function fetchCategories(
  params?: ListParams,
): Promise<ProductCategoryRead[]> {
  const { data } = await api.get<PaginatedResponse<ProductCategoryRead>>(
    "/products/categories",
    { params },
  );
  return data.items;
}

export async function fetchCategoriesPaginated(
  params?: ListParams,
): Promise<PaginatedResponse<ProductCategoryRead>> {
  const { data } = await api.get<PaginatedResponse<ProductCategoryRead>>(
    "/products/categories",
    { params },
  );
  return data;
}

export async function addCategory(
  payload: ProductCategoryCreate,
): Promise<ProductCategoryRead> {
  const { data } = await api.post<ProductCategoryRead>(
    "/products/categories",
    payload,
  );
  return data;
}

export async function updateCategory(
  categoryId: number,
  payload: ProductCategoryUpdate,
): Promise<ProductCategoryRead> {
  const { data } = await api.put<ProductCategoryRead>(
    `/products/categories/${categoryId}`,
    payload,
  );
  return data;
}

export async function removeCategory(
  categoryId: number,
): Promise<MessageResponse> {
  const { data } = await api.delete<MessageResponse>(
    `/products/categories/${categoryId}`,
  );
  return data;
}

// ── Product functions ─────────────────────────────────────────────────────────

export async function fetchProducts(
  params?: ListParams,
): Promise<ProductRead[]> {
  const { data } = await api.get<PaginatedResponse<ProductRead>>("/products", {
    params,
  });
  return data.items;
}

export async function fetchProductsPaginated(
  params?: ListParams,
): Promise<PaginatedResponse<ProductRead>> {
  const { data } = await api.get<PaginatedResponse<ProductRead>>("/products", {
    params,
  });
  return data;
}

export async function addProduct(
  payload: ProductCreate,
): Promise<ProductRead> {
  const { data } = await api.post<ProductRead>("/products", payload);
  return data;
}

export async function fetchProduct(productId: number): Promise<ProductRead> {
  const { data } = await api.get<ProductRead>(`/products/${productId}`);
  return data;
}

export async function updateProduct(
  productId: number,
  payload: ProductUpdate,
): Promise<ProductRead> {
  const { data } = await api.put<ProductRead>(
    `/products/${productId}`,
    payload,
  );
  return data;
}

export async function removeProduct(
  productId: number,
): Promise<MessageResponse> {
  const { data } = await api.delete<MessageResponse>(`/products/${productId}`);
  return data;
}

// Keep legacy alias
export const createProduct = addProduct;

// ── Inventory batch functions ─────────────────────────────────────────────────

export async function fetchBatches(
  params?: ListParams,
): Promise<StockBatchRead[]> {
  const { data } = await api.get<PaginatedResponse<StockBatchRead>>(
    "/inventory/batches",
    { params },
  );
  return data.items;
}

export async function fetchBatchesPaginated(
  params?: ListParams,
): Promise<PaginatedResponse<StockBatchRead>> {
  const { data } = await api.get<PaginatedResponse<StockBatchRead>>(
    "/inventory/batches",
    { params },
  );
  return data;
}

export async function addBatch(
  payload: StockBatchCreate,
): Promise<StockBatchRead> {
  const { data } = await api.post<StockBatchRead>(
    "/inventory/batches",
    payload,
  );
  return data;
}

export async function fetchBatch(batchId: number): Promise<StockBatchRead> {
  const { data } = await api.get<StockBatchRead>(
    `/inventory/batches/${batchId}`,
  );
  return data;
}

export async function updateBatch(
  batchId: number,
  payload: StockBatchUpdate,
): Promise<StockBatchRead> {
  const { data } = await api.put<StockBatchRead>(
    `/inventory/batches/${batchId}`,
    payload,
  );
  return data;
}

export async function removeBatch(batchId: number): Promise<MessageResponse> {
  const { data } = await api.delete<MessageResponse>(
    `/inventory/batches/${batchId}`,
  );
  return data;
}

export async function adjustBatch(
  batchId: number,
  payload: StockAdjustmentCreate,
): Promise<StockBatchRead> {
  const { data } = await api.post<StockBatchRead>(
    `/inventory/batches/${batchId}/adjust`,
    payload,
  );
  return data;
}

export async function fetchTransactions(params?: {
  page?: number;
  limit?: number;
  batch_id?: number;
}): Promise<PaginatedResponse<InventoryTransactionRead>> {
  const { data } = await api.get<PaginatedResponse<InventoryTransactionRead>>(
    "/inventory/transactions",
    { params },
  );
  return data;
}

// Keep legacy aliases
export const createBatch = addBatch;

// ── Sale functions ────────────────────────────────────────────────────────────

export async function fetchSales(params?: ListParams): Promise<SaleRead[]> {
  const { data } = await api.get<PaginatedResponse<SaleRead>>("/sales", {
    params,
  });
  return data.items;
}

export async function fetchSalesPaginated(
  params?: ListParams,
): Promise<PaginatedResponse<SaleRead>> {
  const { data } = await api.get<PaginatedResponse<SaleRead>>("/sales", {
    params,
  });
  return data;
}

export async function addSale(payload: SaleCreate): Promise<SaleRead> {
  const { data } = await api.post<SaleRead>("/sales", payload);
  return data;
}

export async function fetchSale(saleId: number): Promise<SaleRead> {
  const { data } = await api.get<SaleRead>(`/sales/${saleId}`);
  return data;
}

export async function updateSale(
  saleId: number,
  payload: SaleUpdate,
): Promise<SaleRead> {
  const { data } = await api.put<SaleRead>(`/sales/${saleId}`, payload);
  return data;
}

export async function voidSale(saleId: number): Promise<SaleRead> {
  const { data } = await api.post<SaleRead>(`/sales/${saleId}/cancel`);
  return data;
}

// Keep legacy alias
export const createSale = addSale;
