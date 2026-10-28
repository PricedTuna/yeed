import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { AuthPanel, type AuthMode } from "./AuthPanel";
import { RegisterForm } from "./RegisterForm";

function Harness({ initialMode = "login" }: { initialMode?: AuthMode }) {
  const [mode, setMode] = useState<AuthMode>(initialMode);
  return <AuthPanel mode={mode} onModeChange={setMode} />;
}

describe("AuthPanel", () => {
  it("switches between logging in and creating an account", async () => {
    const user = userEvent.setup();
    render(<Harness />);

    expect(
      screen.getByRole("heading", { name: "Welcome back" }),
    ).toBeInTheDocument();
    expect(screen.queryByLabelText("Name")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Create an account" }));

    expect(
      screen.getByRole("heading", { name: "Create your account" }),
    ).toBeInTheDocument();
    // The new form's first field takes the focus, ready to type.
    expect(screen.getByLabelText("Name")).toHaveFocus();
  });

  it("marks empty fields and focuses the first one", async () => {
    const user = userEvent.setup();
    render(<Harness />);

    await user.click(screen.getByRole("button", { name: "Log in" }));

    const email = screen.getByLabelText("Email");
    expect(email).toHaveAttribute("aria-invalid", "true");
    expect(email).toHaveAccessibleDescription("Enter your email address.");
    expect(email).toHaveFocus();
    expect(screen.getByLabelText("Password")).toHaveAttribute(
      "aria-invalid",
      "true",
    );
  });

  it("clears a field's error as soon as the user types in it", async () => {
    const user = userEvent.setup();
    render(<Harness />);

    await user.click(screen.getByRole("button", { name: "Log in" }));
    await user.type(screen.getByLabelText("Email"), "a");

    expect(screen.getByLabelText("Email")).not.toHaveAttribute("aria-invalid");
  });

  it("explains that accounts are not available yet after a valid submit", async () => {
    const user = userEvent.setup();
    render(<Harness initialMode="register" />);

    await user.type(screen.getByLabelText("Name"), "Ada Lovelace");
    await user.type(screen.getByLabelText("Email"), "ada@example.com");
    await user.type(screen.getByLabelText("Password"), "correct-horse");
    await user.click(screen.getByRole("button", { name: "Create account" }));

    expect(screen.getByRole("status")).toHaveTextContent(
      /accounts are not available yet/,
    );
  });
});

describe("RegisterForm", () => {
  it("sends a trimmed name and a normalized email", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<RegisterForm onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText("Name"), "  Ada Lovelace ");
    await user.type(screen.getByLabelText("Email"), " Ada@Example.COM ");
    await user.type(screen.getByLabelText("Password"), "correct-horse");
    await user.click(screen.getByRole("button", { name: "Create account" }));

    expect(onSubmit).toHaveBeenCalledWith({
      name: "Ada Lovelace",
      email: "ada@example.com",
      password: "correct-horse",
    });
  });
});
