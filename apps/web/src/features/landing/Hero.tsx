import { useMaskText } from "@yewdiel21/motion-kit/react";
import { useRef } from "react";
import { AuthTrigger } from "@/features/auth/AuthDialog";
import { ContentTypeIcon } from "@/features/catalog/ContentTypeIcon";
import { cx } from "@/utils/cx";
import styles from "./Hero.module.css";

export function Hero() {
  const titleRef = useRef<HTMLHeadingElement>(null);
  // motion-kit "mask-text": each word rises out of its own mask on load.
  useMaskText(titleRef, { by: "words", trigger: "load", once: true });

  return (
    <section className={styles.hero}>
      <div className={styles.copy}>
        <p className={styles.eyebrow}>
          For self-taught Software Engineering students
        </p>
        <h1 ref={titleRef} data-mk="mask-text" className={styles.title}>
          Find the resources that help you learn
        </h1>
        <p className={styles.lead}>
          Search documents, videos, podcasts and more in one place. Rate what
          helped you, and Yeed recommends what to study next.
        </p>
        <div className={styles.actions}>
          <AuthTrigger
            mode="register"
            className="mk-button mk-button--primary mk-button--lg"
          >
            Create an account
          </AuthTrigger>
          <a
            href="#how-it-works"
            className="mk-button mk-button--outlined mk-button--lg"
          >
            See how it works
          </a>
        </div>
      </div>
      <HeroIllustration />
    </section>
  );
}

/** Decorative: shapes and sample cards that suggest what Yeed shows. */
function HeroIllustration() {
  return (
    <div className={styles.illustration} aria-hidden="true">
      <span className={styles.blob} />
      <span className={styles.ring} />
      <span className={styles.dot} />
      <div className={cx(styles.cards, "mk-float-group")}>
        <div className={cx(styles.sample, styles.sampleSky)}>
          <span className={styles.sampleIcon}>
            <ContentTypeIcon type="document" />
          </span>
          <span className={styles.sampleText}>
            <strong>Git branching basics</strong>
            <span className={styles.stars}>★★★★★</span>
          </span>
        </div>
        <div className={cx(styles.sample, styles.sampleCoral)}>
          <span className={styles.sampleIcon}>
            <ContentTypeIcon type="video" />
          </span>
          <span className={styles.sampleText}>
            <strong>SQL joins, visually</strong>
            <span className={styles.stars}>★★★★☆</span>
          </span>
        </div>
        <div className={cx(styles.sample, styles.sampleSun)}>
          <span className={styles.sampleIcon}>
            <ContentTypeIcon type="audio" />
          </span>
          <span className={styles.sampleText}>
            <strong>Testing, explained</strong>
            <span className={styles.stars}>★★★★★</span>
          </span>
        </div>
        <span className={styles.badge}>✦ Recommended for you</span>
      </div>
    </div>
  );
}
