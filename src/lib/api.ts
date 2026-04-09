import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000/api/v1",
});

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
