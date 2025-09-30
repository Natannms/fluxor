import { AuthRepositoryInterface } from "../repositories/AuthRepository";
import { AuthData, AuthUser } from "../adapters/AuthInterface";
import { AuthDataSchema } from "../utils/zodSchemas";


export interface AuthServiceInterface {
  signUp(data: AuthData): Promise<AuthUser | { errors: string[] }>;
  signIn(data: AuthData): Promise<AuthUser | { errors: string[] }>;
}

export class AuthService implements AuthServiceInterface {
  public repository: AuthRepositoryInterface;

  constructor(repository: AuthRepositoryInterface) {
    this.repository = repository;
  }

  async signUp(data: AuthData): Promise<AuthUser | { errors: string[] }> {
    const result = AuthDataSchema.safeParse(data);
    if (!result.success) {
      const errors = result.error.issues.map(e => e.message);
      return { errors };
    }

    const existingUser = await this.repository.findUnique(data.email);
    if (existingUser) {
      return { errors: ["E-mail já cadastrado"] };
    }

    return this.repository.createUser(data);
  }

  async signIn(data: AuthData): Promise<AuthUser | { errors: string[] }> {
    const result = AuthDataSchema.safeParse(data);
    if (!result.success) {
      const errors = result.error.issues.map(e => e.message);
      return { errors };
    }
    return this.repository.signIn(data);
  }
}