import { beforeAll, afterAll, describe, it, expect } from "@jest/globals";
import { CompanyPostgresAdapter } from "../src/adapters/postgres/CompanyAdapter";
import { CompanyRepository } from "../src/repositories/CompanyRepository";
import { CompanyService } from "../src/services/CompanyService";
import prisma from "../prisma/prismaClient";
import { Company } from "@/app/types/types";
import { faker } from '@faker-js/faker';

let adapter: CompanyPostgresAdapter;
let repository: CompanyRepository;
let service: CompanyService;
let ownerId: string;
let companyId: string;

beforeAll(async () => {
    adapter = new CompanyPostgresAdapter(prisma);
    repository = new CompanyRepository(adapter);
    service = new CompanyService(repository);

    // Crie o usuário primeiro
    const user = await prisma.user.create({
        data: {
            name: faker.person.fullName(),
            email: faker.internet.email(),
            password: faker.internet.password({ length: 12, memorable: false })
        }
    });
    ownerId = user.id;

    // Agora crie a empresa usando o ownerId válido
    const company = await prisma.company.create({
        data: {
            name: faker.company.name(),
            type: faker.helpers.arrayElement(['MARKETING', 'SOFTWARE']),
            ownerId,
            createdAt: new Date(),
            updatedAt: new Date()
        }
    });
    companyId = company.id;
});

afterAll(async () => {
    // Remove todas as empresas e usuários do banco de dados
    // await prisma.company.deleteMany({});
    // await prisma.user.deleteMany({});
    await prisma.$disconnect();
});


describe("CompanyService", () => {
    it("deve criar uma empresa válida", async () => {
        const data: Partial<Company> = {
            name: faker.company.name(),
            ownerId: ownerId,
            type: faker.helpers.arrayElement(['MARKETING', 'SOFTWARE']),
            description: faker.lorem.sentence(),
        };
        const result = await service.createCompany(data);
        expect(result).toHaveProperty("id");
        expect(result.name).toBe(data.name);
    });

    it("deve falhar ao criar empresa sem nome", async () => {
        const data: Partial<Company> = {
            ownerId: "cmfywsf320001va8gcol9w1o5",
            type: "SOFTWARE"
        };
        await expect(service.createCompany(data)).rejects.toThrow();
    });
});