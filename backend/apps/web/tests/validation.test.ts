import { describe, it, expect } from "@jest/globals";
import { validateUserRegistration, type UserRegistrationInput } from "@/lib/user-validation";

function makeValidInput(overrides: Partial<UserRegistrationInput> = {}): UserRegistrationInput {
  return {
    email: "newuser@example.com",
    password: "SecurePass1",
    displayName: "New User",
    role: "STUDENT",
    ...overrides,
  };
}

describe("validateUserRegistration", () => {
  // ── Valid ──────────────────────────────────────────────────────────────────

  it("returns valid for a correct registration input", () => {
    const result = validateUserRegistration(makeValidInput());
    expect(result.valid).toBe(true);
    expect(result.errors).toEqual([]);
  });

  it("allows optional displayName to be empty", () => {
    const result = validateUserRegistration(makeValidInput({ displayName: "" }));
    expect(result.valid).toBe(true);
  });

  it("allows optional displayName to be undefined", () => {
    const rest = makeValidInput();
    delete rest.displayName;
    const result = validateUserRegistration(rest);
    expect(result.valid).toBe(true);
  });

  it("allows optional role to be undefined (defaults on server)", () => {
    const rest = makeValidInput();
    delete rest.role;
    const result = validateUserRegistration(rest);
    expect(result.valid).toBe(true);
  });

  // ── Email ──────────────────────────────────────────────────────────────────

  it("rejects missing email", () => {
    const result = validateUserRegistration(makeValidInput({ email: "" }));
    expect(result.valid).toBe(false);
    expect(result.errors).toContain("Email is required");
  });

  it("rejects malformed email (no @)", () => {
    const result = validateUserRegistration(makeValidInput({ email: "notanemail" }));
    expect(result.valid).toBe(false);
    expect(result.errors).toContain("Email must be a valid email address");
  });

  it("rejects malformed email (no domain)", () => {
    const result = validateUserRegistration(makeValidInput({ email: "user@" }));
    expect(result.valid).toBe(false);
    expect(result.errors).toContain("Email must be a valid email address");
  });

  it("rejects email exceeding 255 chars", () => {
    const local = "a".repeat(251);
    const result = validateUserRegistration(makeValidInput({ email: `${local}@b.co` }));
    expect(result.valid).toBe(false);
    expect(result.errors).toContain("Email must not exceed 255 characters");
  });

  // ── Password ───────────────────────────────────────────────────────────────

  it("rejects missing password", () => {
    const result = validateUserRegistration(makeValidInput({ password: "" }));
    expect(result.valid).toBe(false);
    expect(result.errors).toContain("Password is required");
  });

  it("rejects short password (< 8 chars)", () => {
    const result = validateUserRegistration(makeValidInput({ password: "Ab1" }));
    expect(result.valid).toBe(false);
    expect(result.errors).toContain("Password must be at least 8 characters long");
  });

  it("rejects password with no uppercase letter", () => {
    const result = validateUserRegistration(makeValidInput({ password: "lowercase1" }));
    expect(result.valid).toBe(false);
    expect(result.errors).toContain("Password must contain at least one uppercase letter");
  });

  it("rejects password with no lowercase letter", () => {
    const result = validateUserRegistration(makeValidInput({ password: "UPPERCASE1" }));
    expect(result.valid).toBe(false);
    expect(result.errors).toContain("Password must contain at least one lowercase letter");
  });

  it("rejects password with no digit", () => {
    const result = validateUserRegistration(makeValidInput({ password: "NoDigitsA" }));
    expect(result.valid).toBe(false);
    expect(result.errors).toContain("Password must contain at least one digit");
  });

  it("rejects password exceeding 128 chars", () => {
    const result = validateUserRegistration(
      makeValidInput({ password: "A" + "a1".repeat(64) + "x" })
    );
    expect(result.valid).toBe(false);
    expect(result.errors).toContain("Password must not exceed 128 characters");
  });

  // ── Display name ───────────────────────────────────────────────────────────

  it("rejects displayName shorter than 2 chars when provided", () => {
    const result = validateUserRegistration(makeValidInput({ displayName: "A" }));
    expect(result.valid).toBe(false);
    expect(result.errors).toContain("Display name must be at least 2 characters if provided");
  });

  it("rejects displayName exceeding 100 chars", () => {
    const result = validateUserRegistration(makeValidInput({ displayName: "A".repeat(101) }));
    expect(result.valid).toBe(false);
    expect(result.errors).toContain("Display name must not exceed 100 characters");
  });

  // ── Role ───────────────────────────────────────────────────────────────────

  it("rejects invalid role", () => {
    const result = validateUserRegistration(makeValidInput({ role: "INVALID" as "ADMIN" }));
    expect(result.valid).toBe(false);
    expect(result.errors).toContain("Role must be one of: ADMIN, TEACHER, STUDENT");
  });

  // ── Multiple errors ────────────────────────────────────────────────────────

  it("collects multiple errors at once", () => {
    const result = validateUserRegistration({
      email: "",
      password: "",
    });
    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThanOrEqual(2);
    expect(result.errors).toContain("Email is required");
    expect(result.errors).toContain("Password is required");
  });
});
