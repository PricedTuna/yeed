import { HealthStatus } from "@/features/health/HealthStatus";
import styles from "./HomePage.module.css";

export function HomePage() {
  return (
    <div className={styles.page}>
      <div className={styles.intro}>
        <h1 className={styles.title}>Welcome to Yeed</h1>
        <p className={styles.lead}>
          Search educational resources, rate them and get recommendations based
          on your interests.
        </p>
      </div>
      <HealthStatus />
    </div>
  );
}
