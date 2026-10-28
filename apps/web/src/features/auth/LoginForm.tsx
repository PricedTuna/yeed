import styles from "./AuthPanel.module.css";
import { FormField } from "./FormField";
import { useAuthForm } from "./useAuthForm";
import { normalizeEmail, validateLogin, type LoginValues } from "./validation";

interface LoginFormProps {
  onSubmit: (values: LoginValues) => void;
}

export function LoginForm({ onSubmit }: LoginFormProps) {
  const { field, handleSubmit } = useAuthForm<LoginValues>({
    initialValues: { email: "", password: "" },
    fields: ["email", "password"],
    validate: validateLogin,
    onValid: (values) => {
      onSubmit({ ...values, email: normalizeEmail(values.email) });
    },
  });

  return (
    // noValidate: our messages replace the browser's bubbles, same look everywhere.
    <form noValidate onSubmit={handleSubmit} className={styles.form}>
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
        autoComplete="current-password"
        {...field("password")}
      />
      <button
        type="submit"
        className="mk-button mk-button--primary mk-button--lg"
      >
        Log in
      </button>
    </form>
  );
}
