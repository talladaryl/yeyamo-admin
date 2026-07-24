import {
  mockAuditLogs,
  mockCatalogAssets,
  mockDashboard,
  mockPartnerValidations,
  mockPlaceValidations,
  mockReports,
  mockUsers
} from "@/lib/mocks";
import type {
  AuditLog,
  CatalogAsset,
  DashboardData,
  PageResult,
  PartnerValidation,
  PlaceValidation,
  ReportItem,
  UserProfile
} from "@/lib/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8083";

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {})
    },
    cache: "no-store"
  });

  if (!response.ok) {
    throw new Error(`API error ${response.status} on ${path}`);
  }

  return (await response.json()) as T;
}

export async function getDashboardData(): Promise<DashboardData> {
  try {
    return await apiFetch<DashboardData>("/api/v1/analytics/admin/dashboard");
  } catch {
    return mockDashboard;
  }
}

export async function getUsers(query = ""): Promise<PageResult<UserProfile>> {
  try {
    const search = query ? `?q=${encodeURIComponent(query)}` : "?q=";
    return await apiFetch<PageResult<UserProfile>>(`/api/v1/users${search}`);
  } catch {
    return mockUsers;
  }
}

export async function getPartnerValidations(): Promise<PartnerValidation[]> {
  try {
    return await apiFetch<PartnerValidation[]>("/api/v1/admin/validations/partners");
  } catch {
    return mockPartnerValidations;
  }
}

export async function getPlaceValidations(): Promise<PlaceValidation[]> {
  try {
    return await apiFetch<PlaceValidation[]>("/api/v1/admin/validations/places");
  } catch {
    return mockPlaceValidations;
  }
}

export async function getReports(): Promise<ReportItem[]> {
  try {
    return await apiFetch<ReportItem[]>("/api/v1/admin/reports");
  } catch {
    return mockReports;
  }
}

export async function getAuditLogs(): Promise<AuditLog[]> {
  try {
    return await apiFetch<AuditLog[]>("/api/v1/admin/audit-logs");
  } catch {
    return mockAuditLogs;
  }
}

export async function getCatalogAssets(): Promise<CatalogAsset[]> {
  try {
    return await apiFetch<CatalogAsset[]>("/api/v1/catalog/assets");
  } catch {
    return mockCatalogAssets;
  }
}
