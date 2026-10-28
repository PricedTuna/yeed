import { useFlow } from "@yewdiel21/motion-kit/react";
import { useRef } from "react";
import { ContentTypeIcon } from "./ContentTypeIcon";
import styles from "./ContentTypeGrid.module.css";
import { CONTENT_TYPES } from "./contentTypes";

/** The five kinds of resources in the catalog, one colored card each. */
export function ContentTypeGrid() {
  const listRef = useRef<HTMLUListElement>(null);
  // motion-kit "flow": the cards fall into place one after another (blur + rise)
  // the first time the list scrolls into view.
  useFlow(listRef, { stagger: 0.08 });

  return (
    <section id="resources" className={styles.section}>
      <div className={styles.header}>
        <h2 className={styles.heading}>Every kind of resource</h2>
        <p className={styles.lead}>
          Yeed links to resources on their own sites and keeps what students
          think of them.
        </p>
      </div>
      {/* role="list" keeps list semantics in Safari, which drops them with list-style: none. */}
      <ul ref={listRef} data-mk="flow" role="list" className={styles.grid}>
        {CONTENT_TYPES.map((type) => (
          <li key={type.id} className={styles.card} data-tone={type.tone}>
            <span className={styles.icon}>
              <ContentTypeIcon type={type.id} />
            </span>
            <h3 className={styles.title}>{type.label}</h3>
            <p className={styles.description}>{type.description}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
