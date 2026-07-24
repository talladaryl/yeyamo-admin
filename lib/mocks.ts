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

export const mockDashboard: DashboardData = {
  latestKpis: [
    { kpiName: "Utilisateurs actifs", kpiValue: 14280, variation: 8.2, capturedAt: "2026-07-23T09:00:00Z" },
    { kpiName: "Partenaires en attente", kpiValue: 31, variation: -2.1, capturedAt: "2026-07-23T09:00:00Z" },
    { kpiName: "Assets publies", kpiValue: 824, variation: 5.5, capturedAt: "2026-07-23T09:00:00Z" },
    { kpiName: "Reports ouverts", kpiValue: 18, variation: 3.4, capturedAt: "2026-07-23T09:00:00Z" }
  ],
  popularPlaces: [
    { placeId: "p-01", placeName: "Lac Rose de Kribi", score: 94, views: 1830, saves: 414, regionName: "Sud" },
    { placeId: "p-02", placeName: "Chefferie de Bafut", score: 91, views: 1540, saves: 322, regionName: "Nord-Ouest" },
    { placeId: "p-03", placeName: "Mont Cameroun", score: 88, views: 1492, saves: 276, regionName: "Sud-Ouest" }
  ]
};

export const mockUsers: PageResult<UserProfile> = {
  content: [
    {
      id: "d45a0cb6-612e-4e27-93e5-f44d1290b101",
      displayName: "Esther Ndzi",
      bio: "Voyage, culture et patrimoine.",
      language: "FR",
      visibility: "PUBLIC",
      createdAt: "2026-07-18T11:20:00Z"
    },
    {
      id: "af6cdb94-1b8a-42c0-9dc7-94e6b558f820",
      displayName: "Martin Talla",
      bio: "Guide local a Douala.",
      language: "FR",
      visibility: "PRIVATE",
      createdAt: "2026-07-16T08:10:00Z"
    },
    {
      id: "407f9ff1-95d8-4dcc-9198-0424157ec0fb",
      displayName: "Ariane Nyobe",
      bio: "Photographie et traditions.",
      language: "EN",
      visibility: "PUBLIC",
      createdAt: "2026-07-10T16:42:00Z"
    }
  ],
  totalElements: 3,
  totalPages: 1,
  size: 20,
  number: 0
};

export const mockPartnerValidations: PartnerValidation[] = [
  {
    id: "d1",
    partnerId: "partner-kribi",
    requesterId: "usr-101",
    status: "PENDING",
    kycDocumentUrls: ["https://example.com/kyc/license.pdf"],
    kycDocumentTypes: ["BUSINESS_LICENSE", "IDENTITY_CARD"],
    riskScore: 32,
    reviewComment: "Dossier complet, verification manuelle requise.",
    createdAt: "2026-07-21T12:00:00Z",
    updatedAt: "2026-07-22T09:10:00Z"
  },
  {
    id: "d2",
    partnerId: "partner-bamenda",
    requesterId: "usr-202",
    status: "APPROVED",
    kycDocumentUrls: ["https://example.com/kyc/id.png"],
    kycDocumentTypes: ["IDENTITY_CARD"],
    riskScore: 14,
    validatedAt: "2026-07-20T10:12:00Z",
    createdAt: "2026-07-19T11:10:00Z",
    updatedAt: "2026-07-20T10:12:00Z"
  }
];

export const mockPlaceValidations: PlaceValidation[] = [
  {
    id: "pv-1",
    placeId: "place-kribi-beach",
    submittedBy: "partner-kribi",
    status: "PENDING",
    reviewComment: "Verifier la precision geo et les horaires.",
    changesRequested: { address: "Bloc 4, Kribi", openingHours: "08:00-22:00" },
    createdAt: "2026-07-22T14:05:00Z",
    updatedAt: "2026-07-22T14:05:00Z"
  },
  {
    id: "pv-2",
    placeId: "place-bafoussam-market",
    submittedBy: "partner-bafoussam",
    status: "APPROVED",
    changesRequested: {},
    approvedAt: "2026-07-20T08:30:00Z",
    createdAt: "2026-07-19T08:30:00Z",
    updatedAt: "2026-07-20T08:30:00Z"
  }
];

export const mockReports: ReportItem[] = [
  {
    id: "r-01",
    reportType: "POST",
    targetId: "post-990",
    reporterId: "user-14",
    reason: "Contenu sensible",
    description: "Images violentes sans contexte editorial.",
    status: "PENDING",
    createdAt: "2026-07-22T17:10:00Z",
    updatedAt: "2026-07-22T17:10:00Z"
  },
  {
    id: "r-02",
    reportType: "COMMENT",
    targetId: "comment-22",
    reporterId: "user-88",
    reason: "Haine",
    description: "Insultes ciblees.",
    status: "IN_REVIEW",
    assignedTo: "admin-5",
    createdAt: "2026-07-21T10:00:00Z",
    updatedAt: "2026-07-22T10:00:00Z"
  }
];

export const mockAuditLogs: AuditLog[] = [
  {
    id: "a-01",
    adminId: "admin-01",
    action: "PARTNER_REVIEW_APPROVED",
    targetType: "PARTNER_VALIDATION",
    targetId: "d2",
    details: { previousStatus: "PENDING", newStatus: "APPROVED" },
    createdAt: "2026-07-20T10:12:00Z"
  },
  {
    id: "a-02",
    adminId: "admin-03",
    action: "REPORT_ESCALATED",
    targetType: "REPORT",
    targetId: "r-02",
    details: { assignedTo: "moderator-11", severity: "HIGH" },
    createdAt: "2026-07-22T10:30:00Z"
  }
];

export const mockCatalogAssets: CatalogAsset[] = [
  {
    id: "asset-01",
    title: "Chefferies du Grassfield",
    type: "CULTURAL_ASSET",
    region: "Ouest",
    category: "Patrimoine",
    status: "PUBLISHED",
    source: "MINAC",
    qualityScore: 93
  },
  {
    id: "asset-02",
    title: "Chutes de la Lobe",
    type: "PLACE",
    region: "Sud",
    category: "Tourisme",
    status: "PENDING",
    source: "Editorial",
    qualityScore: 81
  },
  {
    id: "asset-03",
    title: "Ngondo",
    type: "TRADITION",
    region: "Littoral",
    category: "Culture",
    status: "DRAFT",
    source: "Community",
    qualityScore: 74
  }
];
