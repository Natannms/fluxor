export interface AuthAdapterInterface {
  createUser(data: AuthData): Promise<AuthUser | { errors: string[] }>;
  signInUser(data: AuthData): Promise<AuthUser | { errors: string[] }>;
  findUnique(email: string): Promise<AuthUser | null>;
}

export interface AuthData {
  email: string;
  password: string;
}

export interface AuthRegisterData extends AuthData {
  name: string;
}

export interface AuthUser {
  id: string;
  email: string;
  password: string;
  name?: string;
}