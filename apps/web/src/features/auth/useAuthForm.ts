import { useState, type ChangeEvent, type SubmitEvent } from "react";
import type { FieldErrors } from "./validation";

/** Any object whose fields are all text, such as the login or sign-up values. */
type TextFields<T> = Record<keyof T, string>;

interface UseAuthFormOptions<T extends TextFields<T>> {
  initialValues: T;
  /** Field names in the order they appear, to focus the first invalid one. */
  fields: readonly (keyof T & string)[];
  validate: (values: T) => FieldErrors<T>;
  onValid: (values: T) => void;
}

/** Values, errors and submit handling shared by the login and sign-up forms. */
export function useAuthForm<T extends TextFields<T>>({
  initialValues,
  fields,
  validate,
  onValid,
}: UseAuthFormOptions<T>) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<FieldErrors<T>>({});

  const field = (name: keyof T & string) => ({
    name,
    value: values[name],
    error: errors[name],
    onChange: (event: ChangeEvent<HTMLInputElement>) => {
      const { value } = event.target;
      setValues((current) => ({ ...current, [name]: value }));
      // The message goes away as soon as the user starts fixing the field.
      setErrors((current) => ({ ...current, [name]: undefined }));
    },
  });

  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    const found = validate(values);
    setErrors(found);
    const firstInvalid = fields.find((name) => found[name]);
    if (firstInvalid) {
      const input = event.currentTarget.elements.namedItem(firstInvalid);
      if (input instanceof HTMLInputElement) {
        input.focus();
      }
      return;
    }
    onValid(values);
  };

  return { field, handleSubmit };
}
