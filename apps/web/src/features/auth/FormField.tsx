import { useId, type InputHTMLAttributes } from "react";

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  /** Help shown under the field while it is valid. */
  hint?: string;
  /** Replaces the hint and marks the field invalid. */
  error?: string;
}

/**
 * A motion-kit .mk-field. The <label> holds only the label text, so the
 * field's accessible name stays short; the hint or error is its description.
 */
export function FormField({
  label,
  hint,
  error,
  ...inputProps
}: FormFieldProps) {
  const inputId = useId();
  const messageId = useId();
  const message = error ?? hint;

  return (
    <div className="mk-field">
      <label htmlFor={inputId} className="mk-field__label">
        {label}
      </label>
      <input
        {...inputProps}
        id={inputId}
        aria-invalid={error ? true : undefined}
        aria-describedby={message ? messageId : undefined}
      />
      {message && (
        <span id={messageId} className="mk-field__hint">
          {message}
        </span>
      )}
    </div>
  );
}
