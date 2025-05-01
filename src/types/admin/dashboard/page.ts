// src / types / admin / dashboard / page.ts;

import { User } from "../../auth";

export interface UsersQueryResult {
  users: User[];
  isLoading: boolean;
  error: Error | null;
}
