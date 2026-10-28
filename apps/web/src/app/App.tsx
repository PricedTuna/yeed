import { AuthDialog, AuthDialogProvider } from "@/features/auth/AuthDialog";
import { AppLayout } from "@/layouts/AppLayout";
import { HomePage } from "@/pages/HomePage";

/** Root component: global providers, the shared layout and the current page. */
export function App() {
  return (
    <AuthDialogProvider>
      <AppLayout>
        <HomePage />
      </AppLayout>
      <AuthDialog />
    </AuthDialogProvider>
  );
}
