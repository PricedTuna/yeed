/**
 * Client-side checks for the account forms (RF-01, RF-02). They give quick
 * feedback only: the API validates everything again and has the final word.
 */

export const NAME_MAX_LENGTH = 100;
export const EMAIL_MAX_LENGTH = 254;
/** Provisional until the password policy is defined with RF-01. */
export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_MAX_LENGTH = 128;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface LoginValues {
  email: string;
  password: string;
}

export interface RegisterValues extends LoginValues {
  name: string;
}

/** One message per invalid field; valid fields are absent. */
export type FieldErrors<T> = Partial<Record<keyof T, string>>;

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function checkEmail(email: string): string | undefined {
  const value = normalizeEmail(email);
  if (value === "") {
    return "Enter your email address.";
  }
  if (value.length > EMAIL_MAX_LENGTH || !EMAIL_PATTERN.test(value)) {
    return "Enter a valid email address, like name@example.com.";
  }
  return undefined;
}

export function validateLogin(values: LoginValues): FieldErrors<LoginValues> {
  const errors: FieldErrors<LoginValues> = {};
  const email = checkEmail(values.email);
  if (email) {
    errors.email = email;
  }
  if (values.password === "") {
    errors.password = "Enter your password.";
  }
  return errors;
}

export function validateRegister(
  values: RegisterValues,
): FieldErrors<RegisterValues> {
  const errors: FieldErrors<RegisterValues> = {};
  const name = values.name.trim();
  if (name === "") {
    errors.name = "Enter your name.";
  } else if (name.length > NAME_MAX_LENGTH) {
    errors.name = `Use at most ${String(NAME_MAX_LENGTH)} characters.`;
  }
  const email = checkEmail(values.email);
  if (email) {
    errors.email = email;
  }
  if (values.password.length < PASSWORD_MIN_LENGTH) {
    errors.password = `Use at least ${String(PASSWORD_MIN_LENGTH)} characters.`;
  } else if (values.password.length > PASSWORD_MAX_LENGTH) {
    errors.password = `Use at most ${String(PASSWORD_MAX_LENGTH)} characters.`;
  }
  return errors;
}
