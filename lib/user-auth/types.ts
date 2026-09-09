export type UserAuthUser = {
  id: number;
  email: string | null;
  phone: string | null;
  status: string;
  roles: string[];
  permissions: string[];
  scopes: string[];
  createdAt: string;
  emailVerifiedAt: string | null;
};

export type UserAuthResponse = {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  user: UserAuthUser;
};

export type UserSessionView =
  | { authenticated: false }
  | {
      authenticated: true;
      user: UserAuthUser;
      partner: null;
      capabilities: string[];
    };

export type UserAuthErrorPayload = {
  code: string;
  message: string;
  correlationId?: string;
  fieldErrors?: Record<string, string>;
  retryable: boolean;
};
