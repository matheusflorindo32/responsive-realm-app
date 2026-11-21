import { describe, expect, test } from "bun:test";
import { emailSchema, loginSchema, signupSchema, resetSchema, passwordChecks } from "../src/lib/auth/schemas";

const strong = "Aa!23456789012";

describe("Zod 4 authentication schema contract", () => {
  test("trims valid email but rejects malformed email", () => {
    expect(emailSchema.parse("  pessoa@example.com  ")).toBe("pessoa@example.com");
    expect(emailSchema.safeParse("not-an-email").success).toBe(false);
  });

  test("login accepts valid credentials and rejects empty password", () => {
    expect(loginSchema.safeParse({ email: "user@example.com", password: "secret" }).success).toBe(true);
    expect(loginSchema.safeParse({ email: "user@example.com", password: "" }).success).toBe(false);
  });

  test("signup validates minimum name, email and password strength", () => {
    expect(signupSchema.safeParse({ name: "Pessoa Teste", email: "user@example.com", password: strong }).success).toBe(true);
    expect(signupSchema.safeParse({ name: "P", email: "user@example.com", password: strong }).success).toBe(false);
    expect(signupSchema.safeParse({ name: "Pessoa Teste", email: "user@example.com", password: "weak" }).success).toBe(false);
  });

  test("reset confirmation mismatch reports confirm field", () => {
    expect(resetSchema.safeParse({ password: strong, confirm: strong }).success).toBe(true);
    const mismatch = resetSchema.safeParse({ password: strong, confirm: strong + "X" });
    expect(mismatch.success).toBe(false);
    if (!mismatch.success) {
      expect(mismatch.error.issues.some((issue) => issue.path.join(".") === "confirm")).toBe(true);
    }
  });

  test("password checklist matches strong password validation", () => {
    const checks = passwordChecks(strong);
    expect(Object.values(checks).every(Boolean)).toBe(true);
    expect(signupSchema.safeParse({ name: "Pessoa", email: "user@example.com", password: strong }).success).toBe(true);
  });
});
