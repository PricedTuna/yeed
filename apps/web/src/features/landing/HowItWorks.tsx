import { useFlow } from "@yewdiel21/motion-kit/react";
import { useRef } from "react";
import styles from "./HowItWorks.module.css";

const STEPS = [
  {
    title: "Search",
    text: "Look up a topic and filter by documents, videos, audio, images or Markdown.",
    tone: "sky",
  },
  {
    title: "Rate",
    text: "Rate what you studied from 1 to 5, so Yeed learns what helps you.",
    tone: "coral",
  },
  {
    title: "Get recommendations",
    text: "See resources picked from your interests and from your ratings.",
    tone: "mint",
  },
] as const;

export function HowItWorks() {
  const listRef = useRef<HTMLOListElement>(null);
  // motion-kit "flow": the steps fall into place when they scroll into view.
  useFlow(listRef, { stagger: 0.1 });

  return (
    <section id="how-it-works" className={styles.section}>
      <h2 className={styles.heading}>How it works</h2>
      {/* role="list" keeps list semantics in Safari, which drops them with list-style: none. */}
      <ol ref={listRef} data-mk="flow" role="list" className={styles.steps}>
        {STEPS.map((step, index) => (
          <li key={step.title} className={styles.step} data-tone={step.tone}>
            <span className={styles.number} aria-hidden="true">
              {index + 1}
            </span>
            <h3 className={styles.title}>{step.title}</h3>
            <p className={styles.text}>{step.text}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
