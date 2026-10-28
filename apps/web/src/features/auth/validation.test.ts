import { describe, expect, it } from "vitest";
import {
  normalizeEmail,
  PASSWORD_MIN_LENGTH,
  validateLogin,
  validateRegister,
} from "./validation";

describe("normalizeEmail", () => {
  it("trims and lowercases the address", () => {
    expect(normalizeEmail("  Ada@Example.COM ")).toBe("ada@example.com");
  });
});

describe("validateLogin", () => {
  it("accepts an email and a password", () => {
    expect(validateLogin({ email: "ada@example.com", password: "x" })).toEqual(
      {},
    );
  });

  it("asks for both fields when they are empty", () => {
    expect(validateLogin({ email: " ", password: "" })).toEqual({
      email: "Enter your email address.",
      password: "Enter your password.",
    });
  });

  it("rejects an address without a domain", () => {
    expect(
      validateLogin({ email: "ada@example", password: "x" }).email,
    ).toMatch(/valid email/);
  });
});

describe("validateRegister", () => {
  const valid = {
    name: "Ada Lovelace",
    email: "ada@example.com",
    password: "a".repeat(PASSWORD_MIN_LENGTH),
  };

  it("accepts valid values", () => {
    expect(validateRegister(valid)).toEqual({});
  });

  it("requires a name that is not only spaces", () => {
    expect(validateRegister({ ...valid, name: "   " }).name).toBe(
      "Enter your name.",
    );
  });

  it("rejects a password shorter than the minimum", () => {
    expect(
      validateRegister({
        ...valid,
        password: "a".repeat(PASSWORD_MIN_LENGTH - 1),
      }).password,
    ).toMatch(/at least/);
  });

  it("rejects a name longer than 100 characters", () => {
    expect(validateRegister({ ...valid, name: "a".repeat(101) }).name).toMatch(
      /at most 100/,
    );
  });
});
