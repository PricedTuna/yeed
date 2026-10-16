import { useId } from "react";
import styles from "./HealthStatus.module.css";
import { useHealthCheck, type HealthCheckState } from "./useHealthCheck";

/** Shows whether the frontend can reach the Yeed API. */
export function HealthStatus() {
  const headingId = useId();
  const { state, retry } = useHealthCheck();

  return (
    <section className={styles.card} aria-labelledby={headingId}>
      <h2 id={headingId} className={styles.heading}>
        API connection
      </h2>
      <p role="status" className={styles.status} data-status={state.status}>
        {describe(state)}
      </p>
      {state.status === "error" && (
        <button type="button" className={styles.button} onClick={retry}>
          Try again
        </button>
      )}
    </section>
  );
}

function describe(state: HealthCheckState): string {
  switch (state.status) {
    case "loading":
      return "Checking the connection…";
    case "success":
      return `Connected to ${state.health.service}.`;
    case "error":
      return state.message;
  }
}
