import { useLetters } from "@yewdiel21/motion-kit/react";
import { useRef, type ReactNode } from "react";
import { AuthTrigger } from "@/features/auth/AuthDialog";
import { HealthStatus } from "@/features/health/HealthStatus";
import styles from "./AppLayout.module.css";

interface AppLayoutProps {
  children: ReactNode;
}

/** Frame shared by every screen: header, main content and footer. */
export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <Brand />
          <nav aria-label="Main" className={styles.nav}>
            <a href="#how-it-works" className={styles.navLink}>
              How it works
            </a>
            <a href="#resources" className={styles.navLink}>
              Resources
            </a>
          </nav>
          <div className={styles.account}>
            <AuthTrigger
              mode="login"
              className="mk-button mk-button--text mk-button--sm"
            >
              Log in
            </AuthTrigger>
            <AuthTrigger
              mode="register"
              className="mk-button mk-button--primary mk-button--sm"
            >
              Sign up
            </AuthTrigger>
          </div>
        </div>
      </header>
      <main className={styles.main}>{children}</main>
      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <Brand />
          <p className={styles.credits}>
            A Software Engineering project at UAS, Los Mochis · 2026
          </p>
          <HealthStatus />
        </div>
      </footer>
    </div>
  );
}

function Brand() {
  const wordmarkRef = useRef<HTMLSpanElement>(null);
  // motion-kit "letters": each letter grows with a spring when hovered.
  useLetters(wordmarkRef, { effect: "scale" });

  return (
    <a href="/" className={styles.brand}>
      <span className={styles.logo} aria-hidden="true">
        <span />
        <span />
        <span />
        <span />
      </span>
      <span ref={wordmarkRef} data-mk="letters" className={styles.wordmark}>
        Yeed
      </span>
    </a>
  );
}
