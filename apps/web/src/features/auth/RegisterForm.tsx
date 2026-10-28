import styles from "./AuthPanel.module.css";
import { FormField } from "./FormField";
import { useAuthForm } from "./useAuthForm";
import {
  normalizeEmail,
  PASSWORD_MIN_LENGTH,
  validateRegister,
  type RegisterValues,
} from "./validation";

interface RegisterFormProps {
  onSubmit: (values: RegisterValues) => void;
}

export function RegisterForm({ onSubmit }: RegisterFormProps) {
  const { field, handleSubmit } = useAuthForm<RegisterValues>({
    initialValues: { name: "", email: "", password: "" },
    fields: ["name", "email", "password"],
    validate: validateRegister,
    onValid: (values) => {
      onSubmit({
        name: values.name.trim(),
        email: normalizeEmail(values.email),
        password: values.password,
      });
    },
  });

  return (
    <form noValidate onSubmit={handleSubmit} className={styles.form}>
      <FormField label="Name" autoComplete="name" {...field("name")} />
      <FormField
        label="Email"
        type="email"
        inputMode="email"
        autoComplete="email"
        {...field("email")}
      />
      <FormField
        label="Password"
        type="password"
        autoComplete="new-password"
        hint={`At least ${String(PASSWORD_MIN_LENGTH)} characters.`}
        {...field("password")}
      />
      <button
        type="submit"
        className="mk-button mk-button--primary mk-button--lg"
      >
        Create account
      </button>
    </form>
  );
}
