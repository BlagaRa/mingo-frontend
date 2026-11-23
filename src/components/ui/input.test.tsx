import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Input } from "./input";

describe("Input", () => {
  it("associates a visible label with the field", () => {
    render(<Input label="Email" name="email" />);
    expect(screen.getByLabelText("Email")).toHaveAttribute("name", "email");
  });

  it("shows an error alert when provided", () => {
    render(<Input label="Cod" name="code" error="Cod invalid" />);
    expect(screen.getByRole("alert")).toHaveTextContent("Cod invalid");
  });
});
