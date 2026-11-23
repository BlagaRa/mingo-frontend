import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ActionMenu } from "./action-menu";
import { theme } from "@/config/theme";

const sampleItems = [
  { id: "confirm", label: "Confirmă", onSelect: vi.fn() },
  { id: "cancel", label: "Anulează", danger: true, onSelect: vi.fn() },
];

describe("ActionMenu", () => {
  it("opens from ⋮ trigger, runs onSelect, and hides actions when closed", async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn();
    render(
      <ActionMenu
        items={[
          { id: "confirm", label: "Confirmă", onSelect: onConfirm },
          { id: "cancel", label: "Anulează", danger: true, onSelect: vi.fn() },
        ]}
      />,
    );

    const trigger = screen.getByRole("button", { name: "Acțiuni" });
    expect(trigger).toHaveTextContent("⋯");
    expect(screen.queryByRole("menuitem", { name: "Confirmă" })).not.toBeInTheDocument();

    await user.click(trigger);
    const confirmItem = screen.getByRole("menuitem", { name: "Confirmă" });
    expect(confirmItem).toBeInTheDocument();
    await user.click(confirmItem);
    expect(onConfirm).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole("menuitem", { name: "Confirmă" })).not.toBeInTheDocument();
  });

  it("uses a custom trigger label when provided", () => {
    render(<ActionMenu label="Opțiuni rezervare" items={sampleItems} />);
    expect(screen.getByRole("button", { name: "Opțiuni rezervare" })).toBeInTheDocument();
  });

  it("closes on Escape and outside click", async () => {
    const user = userEvent.setup();
    render(<ActionMenu items={sampleItems} />);
    const trigger = screen.getByRole("button", { name: "Acțiuni" });

    await user.click(trigger);
    expect(screen.getByRole("menu")).toBeInTheDocument();

    await user.keyboard("{Escape}");
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();

    await user.click(trigger);
    expect(screen.getByRole("menu")).toBeInTheDocument();
    await user.click(document.body);
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  it("styles danger items distinctly", async () => {
    const user = userEvent.setup();
    render(<ActionMenu items={sampleItems} />);
    await user.click(screen.getByRole("button", { name: "Acțiuni" }));
    const dangerItem = screen.getByRole("menuitem", { name: "Anulează" });
    expect(dangerItem).toHaveStyle({ color: theme.colors.coral });
  });

  it("opens from keyboard and toggles closed from the trigger", async () => {
    const user = userEvent.setup();
    render(<ActionMenu items={sampleItems} />);
    const trigger = screen.getByRole("button", { name: "Acțiuni" });
    trigger.focus();
    await user.keyboard("{ArrowDown}");
    expect(screen.getByRole("menu")).toBeInTheDocument();
    await user.click(trigger);
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  it("highlights menu items on hover", async () => {
    const user = userEvent.setup();
    render(<ActionMenu items={sampleItems} />);
    await user.click(screen.getByRole("button", { name: "Acțiuni" }));
    const confirmItem = screen.getByRole("menuitem", { name: "Confirmă" });
    fireEvent.mouseEnter(confirmItem);
    expect(confirmItem).toHaveStyle({
      backgroundColor: theme.colors.surfaceMuted,
    });
    fireEvent.mouseLeave(confirmItem);
    expect(confirmItem.style.backgroundColor).toBe("transparent");

    const dangerItem = screen.getByRole("menuitem", { name: "Anulează" });
    fireEvent.mouseEnter(dangerItem);
    expect(dangerItem).toHaveStyle({ backgroundColor: theme.colors.coralSoft });
    fireEvent.mouseLeave(dangerItem);
    expect(dangerItem.style.backgroundColor).toBe("transparent");
  });
});