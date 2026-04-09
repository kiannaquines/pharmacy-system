/**
 * Server-side API helpers for Next.js server components.
 * Reads auth credentials from cookies (set at login) instead of localStorage.
 * Returns empty/default data when no token is present (build time / unauthenticated).
 * Runtime auth enforcement is handled by middleware.ts.
 */
import { cookies } from "next/headers";
import axios from "axios";
import type {
  DashboardSummary,
  ListParams,
  PaginatedResponse,
  ProductRead,
  SaleRead,
  StockBatchRead,
  SupplierRead,
} from "@/lib/api";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000/api/v1";

const EMPTY_DASHBOARD: DashboardSummary = {
  totals: {
    products: 0,
    customers: 0,
    suppliers: 0,
    lowStock: 0,
    nearExpiry: 0,
    activeUsers: 0,
  },
  sales: { daily: 0, monthly: 0, yearly: 0 },
  topSelling: [],
};

function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const payload = token.split(".")[1];
    const decoded = Buffer.from(payload, "base64url").toString("utf-8");
    return JSON.parse(decoded);
  } catch {
    return null;
  }
}

async function getServerApi() {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;
  if (!token) return null;

  let tenantSlug = cookieStore.get("tenant_slug")?.value;
  if (!tenantSlug) {
    const payload = decodeJwtPayload(token);
    if (payload?.tenant_slug && typeof payload.tenant_slug === "string") {
      tenantSlug = payload.tenant_slug;
    }
  }

  return axios.create({
    baseURL: BASE_URL,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(tenantSlug && { "X-Tenant-Slug": tenantSlug }),
    },
  });
}

export async function fetchDashboardSummary(): Promise<DashboardSummary> {
  try {
    const api = await getServerApi();
    if (!api) return EMPTY_DASHBOARD;
    const { data } = await api.get<DashboardSummary>("/dashboard/summary");
    return data;
  } catch {
    return EMPTY_DASHBOARD;
  }
}

export async function fetchProducts(
  params?: ListParams,
): Promise<ProductRead[]> {
  try {
    const api = await getServerApi();
    if (!api) return [];
    const { data } = await api.get<PaginatedResponse<ProductRead>>(
      "/products",
      {
        params,
      },
    );
    return data.items;
  } catch {
    return [];
  }
}

export async function fetchSuppliers(
  params?: ListParams,
): Promise<SupplierRead[]> {
  try {
    const api = await getServerApi();
    if (!api) return [];
    const { data } = await api.get<PaginatedResponse<SupplierRead>>(
      "/suppliers",
      { params },
    );
    return data.items;
  } catch {
    return [];
  }
}

export async function fetchSales(params?: ListParams): Promise<SaleRead[]> {
  try {
    const api = await getServerApi();
    if (!api) return [];
    const { data } = await api.get<PaginatedResponse<SaleRead>>("/sales", {
      params,
    });
    return data.items;
  } catch {
    return [];
  }
}

export async function fetchBatches(
  params?: ListParams,
): Promise<StockBatchRead[]> {
  try {
    const api = await getServerApi();
    if (!api) return [];
    const { data } = await api.get<PaginatedResponse<StockBatchRead>>(
      "/inventory/batches",
      { params },
    );
    return data.items;
  } catch {
    return [];
  }
}
