import { AppLayout } from "@/layouts/AppLayout";
import { HomePage } from "@/pages/HomePage";

/** Root component. Routing and global providers will be added here when they are needed. */
export function App() {
  return (
    <AppLayout>
      <HomePage />
    </AppLayout>
  );
}
