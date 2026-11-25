import { AppErrors } from "../errors/AppErrors.js";

export function validatePassword(
  password: unknown,
): asserts password is string {
  if (typeof password !== "string") {
    throw new AppErrors(400, "Password must be a string");
  }

  if (password.length < 8 || password.length > 64) {
    throw new AppErrors(400, "Password must be between 8 and 64 characters");
  }
}