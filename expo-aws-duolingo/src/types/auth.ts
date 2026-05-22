export interface User {
  id: string;
  name: string;
  email: string;
  xp: number;
  level: number;
  streak: number;
}

export interface AuthSession {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

export interface AuthResponse {
  user: User;
  token: string;
}
