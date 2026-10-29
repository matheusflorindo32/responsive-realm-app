import { describe, expect, test } from "bun:test";
import { needsExistingMfa, pendingTotpFactors } from "./mfa-setup";

describe("safe authenticator enrollment", () => {
  const verified = { id: "existing", factor_type: "totp", status: "verified" };
  const pending = { id: "pending", factor_type: "totp", status: "unverified" };

  test("first enrollment does not require an existing MFA code", () => {
    expect(needsExistingMfa([pending], "aal1")).toBe(false);
  });
  test("an existing verified authenticator cannot be bypassed at aal1", () => {
    expect(needsExistingMfa([verified, pending], "aal1")).toBe(true);
  });
  test("an additional authenticator requires a verified aal2 session", () => {
    expect(needsExistingMfa([verified], "aal2")).toBe(false);
  });
  test("cleanup never removes verified factors or other factor types", () => {
    expect(pendingTotpFactors([verified, pending, { id: "phone", factor_type: "phone", status: "unverified" }])).toEqual([pending]);
  });
});