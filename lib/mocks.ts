import type {
  AdminDashboardData,
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

export const mockAdminDashboard: AdminDashboardData = {
  kpis: [
    {
      label: "Utilisateurs totaux",
      value: "128,450",
      change: "+12.5%",
      positive: true,
      icon: "users",
      sparkline: [18, 21, 20, 24, 26, 28, 31]
    },
    {
      label: "Lieux répertoriés",
      value: "8,736",
      change: "+15.3%",
      positive: true,
      icon: "place",
      sparkline: [14, 15, 17, 18, 19, 21, 23]
    },
    {
      label: "Événements",
      value: "3,245",
      change: "+8.2%",
      positive: true,
      icon: "calendar",
      sparkline: [9, 11, 10, 12, 12, 13, 14]
    },
    {
      label: "Réservations",
      value: "1,254",
      change: "+10.7%",
      positive: true,
      icon: "ticket",
      sparkline: [7, 8, 8, 9, 10, 11, 12]
    },
    {
      label: "Avis publiés",
      value: "12,389",
      change: "+9.1%",
      positive: true,
      icon: "star",
      sparkline: [11, 11, 12, 13, 13, 14, 15]
    }
  ],
  evolution: [
    { day: "Lun", value: 6500 },
    { day: "Mar", value: 7200 },
    { day: "Mer", value: 6800 },
    { day: "Jeu", value: 11000 },
    { day: "Ven", value: 10000 },
    { day: "Sam", value: 14000 },
    { day: "Dim", value: 18500 }
  ],
  roles: [
    { label: "Utilisateurs", value: 76.4, color: "#E30613" },
    { label: "Partenaires", value: 12.6, color: "#2563EB" },
    { label: "Modérateurs", value: 7.8, color: "#D1D5DB" },
    { label: "Administrateurs", value: 3.2, color: "#111827" }
  ],
  activities: [
    {
      title: "Nouveau lieu ajouté",
      description: "Mont Cameroun",
      time: "Il y a 2 min",
      icon: "map-pin",
      tone: "success"
    },
    {
      title: "Nouvelle réservation",
      description: "Parc national de Waza",
      time: "Il y a 5 min",
      icon: "ticket",
      tone: "warning"
    },
    {
      title: "Avis publié",
      description: "Kribi - Plage de Grand Batanga",
      time: "Il y a 8 min",
      icon: "star",
      tone: "info"
    },
    {
      title: "Signalement reçu",
      description: "Contenu inapproprié",
      time: "Il y a 12 min",
      icon: "flag",
      tone: "danger"
    },
    {
      title: "Nouveau partenaire",
      description: "Hôtel La Falaise",
      time: "Il y a 15 min",
      icon: "partner",
      tone: "info"
    }
  ],
  reports: [
    { label: "Contenu inapproprié", count: 12 },
    { label: "Fausse information", count: 7 },
    { label: "Spam", count: 14 },
    { label: "Lieu inapproprié", count: 5 },
    { label: "Utilisateur signalé", count: 3 }
  ],
  events: [
    {
      title: "Festival des cultures",
      place: "Yaoundé",
      date: "15 Juin 2024",
      badge: "À venir"
    },
    {
      title: "Randonnée Mont Cameroun",
      place: "Buéa",
      date: "22 Juin 2024",
      badge: "À venir"
    },
    {
      title: "Fête de la musique",
      place: "Douala",
      date: "21 Juin 2024",
      badge: "À venir"
    },
    {
      title: "Salon du tourisme",
      place: "Yaoundé",
      date: "05 Juillet 2024",
      badge: "À venir"
    }
  ],
  places: [
    { name: "Mont Cameroun", region: "Sud-Ouest", rating: 4.8, imageLabel: "MC" },
    { name: "Kribi", region: "Sud", rating: 4.6, imageLabel: "KB" },
    { name: "Parc national de Waza", region: "Extrême-Nord", rating: 4.7, imageLabel: "WZ" },
    { name: "Foumban", region: "Ouest", rating: 4.5, imageLabel: "FB" },
    { name: "Limbe", region: "Sud-Ouest", rating: 4.4, imageLabel: "LB" }
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
