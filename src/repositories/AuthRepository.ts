import { AuthAdapterInterface, AuthData, AuthRegisterData, AuthUser } from "../adapters/AuthInterface";

export interface AuthRepositoryInterface {
    createUser(data: AuthData): Promise<AuthUser | { errors: string[] }>;
    signIn(data: AuthData): Promise<AuthUser | { errors: string[] }>;
    findUnique(email: string): Promise<AuthUser | null>;
}

export class AuthRepository implements AuthRepositoryInterface {
    private adapter: AuthAdapterInterface;

    constructor(adapter: AuthAdapterInterface) {
        this.adapter = adapter;
    }

    async createUser(data: AuthData): Promise<AuthUser | { errors: string[] }> {
        return this.adapter.createUser(data);
    }

    async signIn(data: AuthData): Promise<AuthUser | { errors: string[] }> {
        const result = await this.adapter.signInUser(data);

        return result
    }

    async findUnique(email: string): Promise<AuthUser | null> {
        return this.adapter.findUnique(email);
    }
}