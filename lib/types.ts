export type AdminRole =
  | "SUPER_ADMIN"
  | "ADMIN"
  | "MODERATOR"
  | "EDITOR"
  | "SUPPORT"
  | "COMMERCIAL";

export type UserProfile = {
  id: string;
  displayName: string;
  avatarUrl?: string | null;
  bio?: string | null;
  language?: string | null;
  visibility?: string | null;
  createdAt?: string | null;
};

export type PartnerValidation = {
  id: string;
  partnerId: string;
  requesterId?: string | null;
  status: "PENDING" | "APPROVED" | "REJECTED";
  kycDocumentUrls: string[];
  kycDocumentTypes: string[];
  reviewComment?: string | null;
  riskScore?: number | null;
  validatedBy?: string | null;
  validatedAt?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
};

export type PlaceValidation = {
  id: string;
  placeId: string;
  submittedBy: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  reviewedBy?: string | null;
  reviewComment?: string | null;
  changesRequested: Record<string, unknown>;
  approvedAt?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
};

export type ReportItem = {
  id: string;
  reportType: string;
  targetId: string;
  reporterId: string;
  reason: string;
  description?: string | null;
  status: "PENDING" | "IN_REVIEW" | "RESOLVED" | "REJECTED";
  assignedTo?: string | null;
  resolvedBy?: string | null;
  resolutionComment?: string | null;
  resolvedAt?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
};

export type AuditLog = {
  id: string;
  adminId: string;
  action: string;
  targetType: string;
  targetId?: string | null;
  details: Record<string, unknown>;
  ipAddress?: string | null;
  userAgent?: string | null;
  correlationId?: string | null;
  createdAt?: string | null;
};

export type KpiHistory = {
  id?: string;
  kpiName: string;
  kpiValue: number;
  variation?: number | null;
  capturedAt?: string | null;
};

export type PopularPlace = {
  placeId: string;
  placeName: string;
  score: number;
  views?: number | null;
  saves?: number | null;
  regionName?: string | null;
};

export type DashboardData = {
  latestKpis: KpiHistory[];
  popularPlaces: PopularPlace[];
};

export type CatalogAsset = {
  id: string;
  title: string;
  type: string;
  region: string;
  category: string;
  status: "DRAFT" | "PUBLISHED" | "PENDING" | "REJECTED";
  source: string;
  qualityScore: number;
};

export type PageResult<T> = {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
};
