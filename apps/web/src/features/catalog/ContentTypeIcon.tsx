import type { ContentType } from "./contentTypes";

const PATHS: Record<ContentType, string> = {
  document: "M7 3h7l5 5v13H7zM14 3v5h5M10 13h6M10 17h6",
  video: "M3 6h18v12H3zM10 9.5l4.5 2.5-4.5 2.5z",
  audio: "M4 15v-3a8 8 0 0 1 16 0v3M4 15h3v5H4zM17 15h3v5h-3z",
  image: "M3 5h18v14H3zM3 16l5-5 4 4 3-3 6 6M15.5 9.5h.01",
  markdown: "M2 6h20v12H2zM5.5 15V9l3 3 3-3v6M17 9v6M14.5 12.5 17 15l2.5-2.5",
};

/** Decorative icon for a content type: the card's text already names it. */
export function ContentTypeIcon({ type }: { type: ContentType }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="28"
      height="28"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={PATHS[type]} />
    </svg>
  );
}
