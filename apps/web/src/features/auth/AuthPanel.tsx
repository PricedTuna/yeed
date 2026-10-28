import { flowIn } from "@yewdiel21/motion-kit";
import { Dialog } from "@yewdiel21/motion-kit/react";
import { useEffect, useRef, useState } from "react";
import styles from "./AuthPanel.module.css";
import { LoginForm } from "./LoginForm";
import { RegisterForm } from "./RegisterForm";

export type AuthMode = "login" | "register";

const COPY: Record<
  AuthMode,
  {
    title: string;
    description: string;
    switchPrompt: string;
    switchLabel: string;
  }
> = {
  login: {
    title: "Welcome back",
    description: "Log in to rate resources and see your recommendations.",
    switchPrompt: "New to Yeed?",
    switchLabel: "Create an account",
  },
  register: {
    title: "Create your account",
    description:
      "Pick your topics, rate what you study and get recommendations.",
    switchPrompt: "Already have an account?",
    switchLabel: "Log in",
  },
};

interface AuthPanelProps {
  mode: AuthMode;
  onModeChange: (mode: AuthMode) => void;
}

/** Contents of the account dialog: one form per mode and a link to the other. */
export function AuthPanel({ mode, onModeChange }: AuthPanelProps) {
  const copy = COPY[mode];
  const [previewNotice, setPreviewNotice] = useState(false);
  const bodyRef = useRef<HTMLDivElement>(null);
  const switched = useRef(false);

  // After switching forms, the new fields fall into place (motion-kit flowIn)
  // and focus moves to the first one: the field that had it no longer exists.
  // flowIn hides the fields while they enter, and hidden fields cannot take
  // focus, so it moves when the animation ends (or at once with reduced motion).
  useEffect(() => {
    const body = bodyRef.current;
    if (switched.current && body) {
      const focusFirstField = () => body.querySelector("input")?.focus();
      const tween = flowIn(
        body.querySelectorAll(".mk-field, button[type=submit]"),
      );
      if (tween) {
        tween.eventCallback("onComplete", focusFirstField);
      } else {
        focusFirstField();
      }
    }
    switched.current = false;
  }, [mode]);

  const switchMode = () => {
    switched.current = true;
    setPreviewNotice(false);
    onModeChange(mode === "login" ? "register" : "login");
  };

  // Accounts need the backend (RF-01, RF-02). Until then, say so instead of pretending.
  const showPreviewNotice = () => {
    setPreviewNotice(true);
  };

  return (
    <>
      <Dialog.Header>
        <div className={styles.heading}>
          <Dialog.Title className={styles.title}>{copy.title}</Dialog.Title>
          <Dialog.Description>{copy.description}</Dialog.Description>
        </div>
        <Dialog.Actions>
          <Dialog.Close label="Close" />
        </Dialog.Actions>
      </Dialog.Header>
      <Dialog.Body>
        <div ref={bodyRef} className={styles.body}>
          {mode === "login" ? (
            <LoginForm onSubmit={showPreviewNotice} />
          ) : (
            <RegisterForm onSubmit={showPreviewNotice} />
          )}
          {/* Always in the page, so screen readers announce the message when it appears. */}
          <div role="status">
            {previewNotice && (
              <p className={styles.notice}>
                Your details look good, but accounts are not available yet in
                this preview.
              </p>
            )}
          </div>
          <p className={styles.switch}>
            {copy.switchPrompt}{" "}
            <button
              type="button"
              className={styles.switchButton}
              onClick={switchMode}
            >
              {copy.switchLabel}
            </button>
          </p>
        </div>
      </Dialog.Body>
    </>
  );
}
