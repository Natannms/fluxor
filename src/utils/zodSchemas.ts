import z from "zod";

export const AuthDataSchema = z.object({
  email: z.email("Invalid email"),
  password: z.string().min(6, { message: "A senha deve ter pelo menos 6 caracteres" }),
});

export const CompanyDataSchema = z.object({
  name: z.string().min(1, { message: "O nome é obrigatório" }),
  description: z.string().optional(),
  type: z.enum(['MARKETING', 'SOFTWARE']),
});

export const AuthRegisterDataSchema = z.object({
  name: z.string().min(1, { message: "O nome é obrigatório" }),
  email: z.email("Invalid email"),
  password: z.string().min(6, { message: "A senha deve ter pelo menos 6 caracteres" }),
});
