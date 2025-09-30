import { beforeAll, afterAll, describe, it, expect } from "@jest/globals";
import { PrismaClient, CompanyRole } from "@prisma/client";
import { MembershipPostgresAdapter } from "../src/adapters/postgres/MembershipAdapter";
import { MembershipRepository } from "../src/repositories/MembershipRepository";
import { MembershipService } from "../src/services/MembershipService";
import { Membership } from "../src/app/types/types";

let prisma = new PrismaClient();
let adapter: MembershipPostgresAdapter;
let repository: MembershipRepository;
let service: MembershipService;
let createdMembership: Membership;
let validCompanyId: string;
let validUserId: string;

beforeAll(async () => {
    adapter = new MembershipPostgresAdapter(prisma);
    repository = new MembershipRepository(adapter);
    service = new MembershipService(repository);

    // Crie o usuário primeiro
    const user = await prisma.user.create({
        data: {
            name: "Usuário Teste",
            email: "user@test.com",
            password: "senha123"
        }
    });
    validUserId = user.id;

    // Agora crie a company usando o ownerId válido
    const company = await prisma.company.create({
        data: {
            name: "Empresa Teste",
            type: "SOFTWARE",
            ownerId: validUserId, // Use o id do usuário criado acima
            createdAt: new Date(),
            updatedAt: new Date()
        }
    });
    validCompanyId = company.id;
});

afterAll(async () => {
    await prisma.membership.deleteMany({ where: { companyId: validCompanyId } });
    await prisma.company.deleteMany({ where: { id: validCompanyId } });
    await prisma.user.deleteMany({ where: { id: validUserId } });
    await prisma.$disconnect();
});

describe("MembershipService", () => {
    it("deve criar uma associação válida", async () => {
        const data: Partial<Membership> = {
            userId: validUserId,
            companyId: validCompanyId,
            role: CompanyRole.COLABORADOR,
            active: true,
            createdAt: new Date(),
            updatedAt: new Date()
        };
        createdMembership = await service.createMembership(data);
        expect(createdMembership).toHaveProperty("id");
        expect(createdMembership.userId).toBe(validUserId);
        expect(createdMembership.companyId).toBe(validCompanyId);
        expect(createdMembership.role).toBe(CompanyRole.COLABORADOR);
    });

    it("deve falhar ao criar associação sem userId", async () => {
        const data: Partial<Membership> = {
            companyId: validCompanyId,
            role: CompanyRole.COLABORADOR,
            active: true,
            createdAt: new Date(),
            updatedAt: new Date()
        };
        await expect(service.createMembership(data)).rejects.toThrow();
    });

    it("deve ler associações existentes", async () => {
        const memberships = await service.getMemberships({ companyId: validCompanyId });
        expect(Array.isArray(memberships)).toBe(true);
        expect(memberships.length).toBeGreaterThan(0);
        expect(memberships[0].companyId).toBe(validCompanyId);
    });

    it("deve atualizar uma associação existente", async () => {
        const result = await service.updateMembership(createdMembership.id, { role: CompanyRole.ADMIN_EMPRESA });
        expect(result).toBe(1);
        const updated = await service.getMemberships({ id: createdMembership.id });
        expect(updated[0].role).toBe(CompanyRole.ADMIN_EMPRESA);
    });

    it("deve falhar ao atualizar associação inexistente", async () => {
        await expect(service.updateMembership("non-existent-id", { role: CompanyRole.ADMIN_EMPRESA })).rejects.toThrow();
    });

    it("deve deletar uma associação existente", async () => {
        const result = await service.deleteMembership({ id: createdMembership.id });
        expect(result).toBe(1);
        const memberships = await service.getMemberships({ id: createdMembership.id });
        expect(memberships.length).toBe(0);
    });

    it("deve retornar 0 ao tentar deletar associação inexistente", async () => {
        const result = await service.deleteMembership({ id: "non-existent-id" });
        expect(result).toBe(0);
    });

    it("should return company for a user with membership", async () => {
        // Cria o membership
        await service.createMembership({
            userId: validUserId,
            companyId: validCompanyId,
            role: CompanyRole.COLABORADOR,
            active: true,
            createdAt: new Date(),
            updatedAt: new Date(),
        });
        // Testa o método
        const foundCompany = await service.findCompanyByUserId(validUserId);
        expect(foundCompany).not.toBeNull();
        expect(foundCompany.id).toBe(validCompanyId);
    })
});