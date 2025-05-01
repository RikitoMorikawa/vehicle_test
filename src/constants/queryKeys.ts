export const QUERY_KEYS = {
  VEHICLES: ['vehicles'] as const,
  ACCOUNT: ['account'] as const,
  USERS: ['users'] as const,
} as const;

export type QueryKeys = typeof QUERY_KEYS;