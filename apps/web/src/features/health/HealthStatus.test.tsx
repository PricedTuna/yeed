import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi, type Mock } from "vitest";
import { HealthStatus } from "./HealthStatus";

let fetchMock: Mock<typeof fetch>;

beforeEach(() => {
  fetchMock = vi.fn<typeof fetch>();
  vi.stubGlobal("fetch", fetchMock);
});

function healthResponse(): Response {
  return new Response(JSON.stringify({ status: "ok", service: "yeed-api" }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

describe("HealthStatus", () => {
  it("shows that the API is reachable", async () => {
    fetchMock.mockResolvedValue(healthResponse());

    render(<HealthStatus />);

    expect(screen.getByRole("status")).toHaveTextContent(
      "Checking the connection…",
    );
    expect(
      await screen.findByText("Connected to yeed-api."),
    ).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledWith(
      "http://api.test/health",
      expect.objectContaining({ method: "GET" }),
    );
  });

  it("shows the error and tries again when the user asks", async () => {
    const user = userEvent.setup();
    fetchMock
      .mockRejectedValueOnce(new TypeError("Failed to fetch"))
      .mockResolvedValueOnce(healthResponse());

    render(<HealthStatus />);

    expect(
      await screen.findByText(/could not connect to the server/i),
    ).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Try again" }));
    expect(
      await screen.findByText("Connected to yeed-api."),
    ).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });
});
