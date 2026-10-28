/** Content types a catalog resource can have (RF-05). */
export type ContentType = "document" | "video" | "audio" | "image" | "markdown";

/** Accent color from the Yeed palette (see app/global.css). */
export type Tone = "sky" | "coral" | "sun" | "mint" | "grape";

export interface ContentTypeInfo {
  id: ContentType;
  label: string;
  description: string;
  tone: Tone;
}

export const CONTENT_TYPES: readonly ContentTypeInfo[] = [
  {
    id: "document",
    label: "Documents",
    description: "Articles, official documentation, books and PDFs.",
    tone: "sky",
  },
  {
    id: "video",
    label: "Videos",
    description: "Talks, tutorials and full video courses.",
    tone: "coral",
  },
  {
    id: "audio",
    label: "Audio",
    description: "Podcasts and other lessons you can listen to.",
    tone: "sun",
  },
  {
    id: "image",
    label: "Images",
    description: "Infographics, diagrams and cheat sheets.",
    tone: "mint",
  },
  {
    id: "markdown",
    label: "Markdown",
    description: "Guides and READMEs published as Markdown files.",
    tone: "grape",
  },
];
