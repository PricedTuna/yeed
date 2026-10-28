import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ContentTypeGrid } from "./ContentTypeGrid";

describe("ContentTypeGrid", () => {
  it("shows the five content types of the catalog", () => {
    render(<ContentTypeGrid />);

    const list = screen.getByRole("list");
    const titles = within(list)
      .getAllByRole("heading", { level: 3 })
      .map((heading) => heading.textContent);
    expect(titles).toEqual([
      "Documents",
      "Videos",
      "Audio",
      "Images",
      "Markdown",
    ]);
  });
});
