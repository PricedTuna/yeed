import type { ReactNode } from "react";
import styles from "./AppLayout.module.css";

interface AppLayoutProps {
  children: ReactNode;
}

/** Frame shared by every screen: a header and the main content area. */
export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <div className={styles.container}>
          <span className={styles.brand}>Yeed</span>
        </div>
      </header>
      <main className={styles.main}>{children}</main>
    </div>
  );
}
