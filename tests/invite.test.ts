import { beforeAll, afterAll, describe, it, expect } from "@jest/globals";
import { PrismaClient } from "@prisma/client";
import { InvitePostgresAdapter } from "../src/adapters/postgres/InviteAdapter";
import { InviteRepository } from "../src/repositories/InviteRepository";
import { InviteService } from "../src/services/InviteService";
import { Invite } from "../src/app/types/types";

let prisma = new PrismaClient();
let adapter: InvitePostgresAdapter;
let repository: InviteRepository;
let service: InviteService;
let createdInvite: Invite;
let validCompanyId: string;
let validUserId: string;

beforeAll(async () => {
    adapter = new InvitePostgresAdapter(prisma);
    repository = new InviteRepository(adapter);
    service = new InviteService(repository);

    // Crie o usuário que irá convidar
    const user = await prisma.user.create({
        data: {
            name: "Usuário Convidador",
            email: "inviter@test.com",
            password: "senha123"
        }
    });
    validUserId = user.id;

    // Crie a empresa para o convite
    const company = await prisma.company.create({
        data: {
            name: "Empresa Convite",
            type: "SOFTWARE",
            ownerId: validUserId,
            createdAt: new Date(),
            updatedAt: new Date()
        }
    });
    validCompanyId = company.id;
});

afterAll(async () => {
    await prisma.invite.deleteMany({ where: { companyId: validCompanyId } });
    await prisma.company.deleteMany({ where: { id: validCompanyId } });
    await prisma.user.deleteMany({ where: { id: validUserId } });
    await prisma.$disconnect();
});

describe("InviteService", () => {
    it("deve criar um convite válido", async () => {
        const data: Partial<Invite> = {
            inviterId: validUserId,
            companyId: validCompanyId,
            token: "token-teste-123",
            createdAt: new Date()
        };
        createdInvite = await service.createInvite(data);
        expect(createdInvite).toHaveProperty("id");
        expect(createdInvite.inviterId).toBe(validUserId);
        expect(createdInvite.companyId).toBe(validCompanyId);
        expect(createdInvite.token).toBe("token-teste-123");
    });

    it("deve falhar ao criar convite sem inviterId", async () => {
        const data: Partial<Invite> = {
            companyId: validCompanyId,
            token: "token-teste-456",
            createdAt: new Date()
        };
        await expect(service.createInvite(data)).rejects.toThrow();
    });

    it("deve ler convites existentes", async () => {
        const invites = await service.getInvites({ companyId: validCompanyId });
        expect(Array.isArray(invites)).toBe(true);
        expect(invites.length).toBeGreaterThan(0);
        expect(invites[0].companyId).toBe(validCompanyId);
    });

    it("deve atualizar um convite existente", async () => {
        const result = await service.updateInvite(createdInvite.id, { token: "token-atualizado" });
        expect(result).toBe(1);
        const updated = await service.getInvites({ id: createdInvite.id });
        expect(updated[0].token).toBe("token-atualizado");
    });

    it("deve falhar ao atualizar convite inexistente", async () => {
        await expect(service.updateInvite("non-existent-id", { token: "token-fake" })).rejects.toThrow();
    });

    it("deve deletar um convite existente", async () => {
        const result = await service.deleteInvite({ id: createdInvite.id });
        expect(result).toBe(1);
        const invites = await service.getInvites({ id: createdInvite.id });
        expect(invites.length).toBe(0);
    });

    it("deve retornar 0 ao tentar deletar convite inexistente", async () => {
        const result = await service.deleteInvite({ id: "non-existent-id" });
        expect(result).toBe(0);
    });

    it("deve buscar um convite pelo token corretamente", async () => {
        // Cria um novo convite para garantir o teste
        const token = "token-unico-busca";
        const data: Partial<Invite> = {
            inviterId: validUserId,
            companyId: validCompanyId,
            token,
            createdAt: new Date()
        };
        const invite = await service.createInvite(data);

        // Testa busca por token existente
        const found = await service.findInviteByToken(token);
        expect(found).not.toBeNull();
        expect(found?.id).toBe(invite.id);
        expect(found?.token).toBe(token);
    });

    it("deve retornar null ao buscar por token inexistente", async () => {
        const found = await service.findInviteByToken("token-inexistente-xyz");
        expect(found).toBeNull();
    });
});