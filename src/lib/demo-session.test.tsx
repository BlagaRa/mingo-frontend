import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DemoSessionProvider, useDemoSession } from "./demo-session";

function Probe() {
  const { role, setRole } = useDemoSession();
  return (
    <div>
      <span data-testid="role">{role}</span>
      <button type="button" onClick={() => setRole("owner")}>
        owner
      </button>
      <button type="button" onClick={() => setRole("admin")}>
        admin
      </button>
    </div>
  );
}

describe("DemoSessionProvider", () => {
  it("starts as player and can switch roles", async () => {
    const user = userEvent.setup();
    render(
      <DemoSessionProvider>
        <Probe />
      </DemoSessionProvider>,
    );
    expect(screen.getByTestId("role")).toHaveTextContent("player");
    await user.click(screen.getByRole("button", { name: "owner" }));
    expect(screen.getByTestId("role")).toHaveTextContent("owner");
    await user.click(screen.getByRole("button", { name: "admin" }));
    expect(screen.getByTestId("role")).toHaveTextContent("admin");
  });
});
