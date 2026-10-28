import { Dialog } from "@yewdiel21/motion-kit/react";
import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ButtonHTMLAttributes,
  type ReactNode,
} from "react";
import { AuthPanel, type AuthMode } from "./AuthPanel";

interface AuthModeContextValue {
  mode: AuthMode;
  setMode: (mode: AuthMode) => void;
}

const AuthModeContext = createContext<AuthModeContextValue | null>(null);

function useAuthMode(): AuthModeContextValue {
  const value = useContext(AuthModeContext);
  if (!value) {
    throw new Error("Auth components must be inside <AuthDialogProvider>.");
  }
  return value;
}

/**
 * Shares one account dialog with every button that opens it. Wrap the app once;
 * render <AuthDialog /> once and <AuthTrigger /> wherever a button is needed.
 */
export function AuthDialogProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<AuthMode>("login");
  const value = useMemo(() => ({ mode, setMode }), [mode]);

  return (
    <AuthModeContext value={value}>
      <Dialog.Root>{children}</Dialog.Root>
    </AuthModeContext>
  );
}

interface AuthTriggerProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  mode: AuthMode;
}

/** Opens the dialog in the given mode; the dialog grows out of this button. */
export function AuthTrigger({ mode, onClick, ...props }: AuthTriggerProps) {
  const { setMode } = useAuthMode();

  return (
    <Dialog.Trigger
      {...props}
      onClick={(event) => {
        onClick?.(event);
        setMode(mode);
      }}
    />
  );
}

/**
 * The account dialog itself (motion-kit Dialog: native <dialog>, focus trap,
 * Escape). The engine names it after the visible title.
 */
export function AuthDialog() {
  const { mode, setMode } = useAuthMode();

  return (
    <Dialog.Content>
      <AuthPanel mode={mode} onModeChange={setMode} />
    </Dialog.Content>
  );
}
