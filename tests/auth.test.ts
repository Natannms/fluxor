import { AuthService } from "../src/services/AuthService";
import { AuthRepository } from "../src/repositories/AuthRepository";
import { AuthPostgresAdapter } from "../src/adapters/postgres/AuthPostgresAdapter";
import { AuthData, AuthRegisterData } from "../src/adapters/AuthInterface";
import prisma from "../prisma/prismaClient";

const adapter = new AuthPostgresAdapter();
const repository = new AuthRepository(adapter);
const service = new AuthService(repository);

describe("AuthService", () => {
  const userData: AuthData = {
    email: "testuser@example.com",
    password: "123456"
  };
  const registerData: AuthRegisterData = {
    name: "Test User",
    ...userData
  };

  beforeAll(async () => {
    await prisma.user.deleteMany({ where: { email: userData.email } });
  });

  afterAll(async () => {
    await prisma.user.deleteMany({ where: { email: userData.email } });
    await prisma.$disconnect();
  });

  test("should sign up a new user", async () => {
    const result = await service.signUp(registerData);
    expect("id" in result).toBe(true);
    expect("email" in result && result.email).toBe(userData.email);
  });

  test("should not sign up with invalid email", async () => {
    const result = await service.signUp({ email: "invalid", password: "123456" });
    expect("errors" in result).toBe(true);
    expect("errors" in result && result.errors).toContain("Invalid email");
  });

  test("should not sign up with short password", async () => {
    const result = await service.signUp({ email: "valid@email.com", password: "123" });
    expect("errors" in result).toBe(true);
    expect("errors" in result && result.errors).toContain("A senha deve ter pelo menos 6 caracteres");
  });

  test("should not sign up with duplicate email", async () => {
    await service.signUp(registerData);
    const result = await service.signUp(registerData);
    expect("id" in result).toBe(false);
  });

  test("should sign in with correct credentials", async () => {
    await service.signUp(registerData);
    const result = await service.signIn(userData);
    expect("id" in result).toBe(true);
    expect("email" in result && result.email).toBe(userData.email);
  });

  test("should not sign in with wrong password", async () => {
    await service.signUp(registerData);
    const result = await service.signIn({ email: userData.email, password: "wrongpass" });
    expect("id" in result).toBe(false);
  });

  test("should not sign in with non-existent email", async () => {
    const result = await service.signIn({ email: "notfound@email.com", password: "123456" });
    expect("id" in result).toBe(false);
  });

  test("should not sign in with invalid email format", async () => {
    const result = await service.signIn({ email: "invalid", password: "123456" });
    expect("errors" in result).toBe(true);
    expect("errors" in result && result.errors).toContain("Invalid email");
  });
});