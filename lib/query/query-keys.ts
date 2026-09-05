const domain = (name: string) => ({ all: [name] as const, lists: () => [name, "list"] as const, list: (params?: unknown) => [name, "list", params ?? {}] as const, details: () => [name, "detail"] as const, detail: (id: string | number) => [name, "detail", id] as const });

export const queryKeys = {
  session: { current: ["session", "current"] as const },
  users: domain("users"), administrators: domain("administrators"), partners: domain("partners"), places: domain("places"), catalog: domain("catalog"), culture: domain("culture"), events: domain("events"), reservations: domain("reservations"), payments: domain("payments"), commerce: domain("commerce"), moderation: domain("moderation"), trust: domain("trust"), gamification: domain("gamification"), campaigns: domain("campaigns"), analytics: domain("analytics"), support: domain("support"), newsletter: domain("newsletter"), searchDiscovery: domain("search-discovery"), settings: domain("settings"), notifications: domain("notifications")
} as const;
