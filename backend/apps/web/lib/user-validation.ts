export interface UserRegistrationInput {
  email: string;
  password: string;
  displayName?: string;
  role?: "ADMIN" | "TEACHER" | "STUDENT";
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const VALID_ROLES = new Set(["ADMIN", "TEACHER", "STUDENT"]);

export function validateUserRegistration(input: UserRegistrationInput): ValidationResult {
  const errors: string[] = [];

  if (!input.email || input.email.trim().length === 0) {
    errors.push("Email is required");
  } else if (!EMAIL_REGEX.test(input.email.trim())) {
    errors.push("Email must be a valid email address");
  } else if (input.email.trim().length > 255) {
    errors.push("Email must not exceed 255 characters");
  }

  if (!input.password || input.password.length === 0) {
    errors.push("Password is required");
  } else if (input.password.length < 8) {
    errors.push("Password must be at least 8 characters long");
  } else if (input.password.length > 128) {
    errors.push("Password must not exceed 128 characters");
  } else if (!/[A-Z]/.test(input.password)) {
    errors.push("Password must contain at least one uppercase letter");
  } else if (!/[a-z]/.test(input.password)) {
    errors.push("Password must contain at least one lowercase letter");
  } else if (!/[0-9]/.test(input.password)) {
    errors.push("Password must contain at least one digit");
  }

  if (
    input.displayName !== undefined &&
    input.displayName !== null &&
    input.displayName.trim().length > 0 &&
    input.displayName.trim().length < 2
  ) {
    errors.push("Display name must be at least 2 characters if provided");
  }
  if (
    input.displayName !== undefined &&
    input.displayName !== null &&
    input.displayName.length > 100
  ) {
    errors.push("Display name must not exceed 100 characters");
  }

  if (input.role !== undefined && !VALID_ROLES.has(input.role)) {
    errors.push(`Role must be one of: ${[...VALID_ROLES].join(", ")}`);
  }

  return { valid: errors.length === 0, errors };
}
