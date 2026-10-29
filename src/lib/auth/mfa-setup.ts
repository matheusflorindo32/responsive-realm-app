type Factor = { id: string; factor_type: string; status: string };

export function needsExistingMfa(factors: Factor[], currentLevel: string | null) {
  return factors.some((factor) => factor.factor_type === "totp" && factor.status === "verified") && currentLevel !== "aal2";
}

export function pendingTotpFactors(factors: Factor[]) {
  return factors.filter((factor) => factor.factor_type === "totp" && factor.status === "unverified");
}