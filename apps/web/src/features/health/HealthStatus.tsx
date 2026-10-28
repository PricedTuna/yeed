import { cx } from "@/utils/cx";
import styles from "./HealthStatus.module.css";
import { useHealthCheck, type HealthCheckState } from "./useHealthCheck";

/** Compact indicator of whether the frontend can reach the Yeed API. */
export function HealthStatus() {
  const { state, retry } = useHealthCheck();

  return (
    <div className={styles.root}>
      {/* motion-kit .mk-status: a pill with a pulsing dot. */}
      <p role="status" className={cx("mk-status", styles.status)}>
        <span className={dotClass(state)} aria-hidden="true" />
        <span>
          <span className={styles.label}>API: </span>
          {describe(state)}
        </span>
      </p>
      {state.status === "error" && (
        <button
          type="button"
          className="mk-button mk-button--tonal mk-button--sm"
          onClick={retry}
        >
          Try again
        </button>
      )}
    </div>
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

function dotClass(state: HealthCheckState): string {
  switch (state.status) {
    case "loading":
      return "mk-status__dot mk-status__dot--busy";
    case "success":
      return "mk-status__dot";
    case "error":
      return cx("mk-status__dot", styles.dotError);
  }
}
