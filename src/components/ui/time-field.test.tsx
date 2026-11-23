import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { TimeField } from "./time-field";

describe("TimeField", () => {
  it("commits a typed half-hour on blur", async () => {
    const user = userEvent.setup();
    const onCommit = vi.fn();
    render(<TimeField label="De la" value="08:00" onCommit={onCommit} />);
    const input = screen.getByLabelText("De la");
    await user.clear(input);
    await user.type(input, "09:00");
    await user.tab();
    expect(onCommit).toHaveBeenCalledWith("09:00");
  });

  it("reverts invalid input on blur", async () => {
    const user = userEvent.setup();
    const onCommit = vi.fn();
    render(<TimeField label="Până la" value="20:30" onCommit={onCommit} />);
    const input = screen.getByLabelText("Până la");
    await user.clear(input);
    await user.type(input, "20:15");
    await user.tab();
    expect(onCommit).not.toHaveBeenCalled();
    expect(input).toHaveValue("20:30");
  });
});
