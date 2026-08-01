export type ApiRecord = Record<string, unknown>;

export type AuthUser = {
  id: number;
  email: string | null;
  phone: string | null;
  status: string;
  roles: string[];
};

export type AuthResponse = {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  user: AuthUser;
};

export type PageResponse<T> = {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  numberOfElements?: number;
  first?: boolean;
  last?: boolean;
  empty?: boolean;
};

export type ApiErrorPayload = {
  code?: string;
  message?: string;
  correlationId?: string;
  details?: unknown;
};

export type AdminSession = {
  id: number;
  firstName?: string;
  lastName?: string;
  email: string;
  avatar?: string;
  roles: string[];
  permissions: string[];
  scopes: string[];
};
