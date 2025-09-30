import { AuthAdapterInterface, AuthData, AuthRegisterData, AuthUser } from "../AuthInterface";
import prisma from "../../../prisma/prismaClient";
import { hashPassword, comparePassword } from "../../utils/encrypt";

export class AuthPostgresAdapter implements AuthAdapterInterface {
    async createUser(data: AuthRegisterData): Promise<AuthUser> {
        const hashedPassword = await hashPassword(data.password);
        const userData: any = {
            name: data.name,
            email: data.email,
            password: hashedPassword,
        };
        const user = await prisma.user.create({
            data: userData,
        });
        return {
            id: user.id,
            email: user.email,
            password: user.password,
        };
    }

    async findUnique(email: string): Promise<AuthUser | null> {
        const user = await prisma.user.findUnique({
            where: { email },
        });
        if (!user) return null;
        return {
            id: user.id,
            email: user.email,
            password: user.password,
        };
    }
    async signInUser(data: AuthData): Promise<AuthUser | { errors: string[] }> {
        const user = await prisma.user.findUnique({
            where: { email: data.email },
        });
        if (!user) {
            return { errors: ["Usuário não encontrado ou credenciais inválidas"] };
        }
        const isPasswordValid = await comparePassword(data.password, user.password);
        if (!isPasswordValid) {
            return { errors: ["Usuário não encontrado ou credenciais inválidas"] };
        }
        return {
            id: user.id,
            name: user.name,
            email: user.email,
            password: user.password,
        };
    }
}