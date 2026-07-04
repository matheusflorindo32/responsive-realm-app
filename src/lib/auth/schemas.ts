import { z } from "zod";

export const emailSchema = z.string().trim().email({ message: "Email inválido" }).max(255);

export const strongPassword = z
  .string()
  .min(12, { message: "Mínimo de 12 caracteres" })
  .max(128, { message: "Máximo de 128 caracteres" })
  .refine((v) => /[a-z]/.test(v), { message: "Deve conter letra minúscula" })
  .refine((v) => /[A-Z]/.test(v), { message: "Deve conter letra maiúscula" })
  .refine((v) => /\d/.test(v), { message: "Deve conter número" })
  .refine((v) => /[^A-Za-z0-9]/.test(v), { message: "Deve conter símbolo" });

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, { message: "Informe a senha" }).max(128),
});

export const signupSchema = z.object({
  name: z.string().trim().min(2, { message: "Informe seu nome" }).max(100),
  email: emailSchema,
  password: strongPassword,
});

export const resetSchema = z
  .object({
    password: strongPassword,
    confirm: z.string(),
  })
  .refine((d) => d.password === d.confirm, {
    message: "As senhas não conferem",
    path: ["confirm"],
  });

export interface PasswordChecks {
  length: boolean;
  lower: boolean;
  upper: boolean;
  number: boolean;
  symbol: boolean;
}
export function passwordChecks(v: string): PasswordChecks {
  return {
    length: v.length >= 12,
    lower: /[a-z]/.test(v),
    upper: /[A-Z]/.test(v),
    number: /\d/.test(v),
    symbol: /[^A-Za-z0-9]/.test(v),
  };
}
