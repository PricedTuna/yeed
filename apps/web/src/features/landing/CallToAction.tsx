import { AuthTrigger } from "@/features/auth/AuthDialog";
import styles from "./CallToAction.module.css";

export function CallToAction() {
  return (
    <section className={styles.section} aria-labelledby="cta-heading">
      <span className={styles.shapeSun} aria-hidden="true" />
      <span className={styles.shapeGrape} aria-hidden="true" />
      <h2 id="cta-heading" className={styles.heading}>
        Start learning with Yeed
      </h2>
      <p className={styles.text}>
        Tell Yeed what you want to learn and keep the resources that worked for
        you.
      </p>
      <div className={styles.actions}>
        <AuthTrigger
          mode="register"
          className="mk-button mk-button--primary mk-button--lg"
        >
          Create an account
        </AuthTrigger>
        <AuthTrigger
          mode="login"
          className="mk-button mk-button--text mk-button--lg"
        >
          I already have an account
        </AuthTrigger>
      </div>
    </section>
  );
}
