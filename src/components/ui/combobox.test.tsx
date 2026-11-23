import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Combobox } from "./combobox";
import { theme } from "@/config/theme";

describe("Combobox", () => {
  it("filters options by search and selects with coral highlight", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <Combobox
        label="Județ"
        value=""
        emptyLabel="Toate"
        options={[
          { value: "Cluj", label: "Cluj" },
          { value: "Timiș", label: "Timiș" },
          { value: "Brașov", label: "Brașov" },
        ]}
        onValueChange={onValueChange}
      />,
    );

    const trigger = screen.getByRole("combobox", { name: "Județ" });
    expect(trigger.querySelector("svg")).toBeTruthy();
    await user.click(trigger);
    await user.type(screen.getByRole("searchbox", { name: "Caută în Județ" }), "clu");
    expect(screen.getByRole("option", { name: "Cluj" })).toBeInTheDocument();
    expect(screen.queryByRole("option", { name: "Timiș" })).not.toBeInTheDocument();

    await user.click(screen.getByRole("option", { name: "Cluj" }));
    expect(onValueChange).toHaveBeenCalledWith("Cluj");
  });

  it("styles the active option with coral, not browser blue", async () => {
    const user = userEvent.setup();
    render(
      <Combobox
        label="Oraș"
        value="Cluj-Napoca"
        options={[{ value: "Cluj-Napoca", label: "Cluj-Napoca" }]}
        onValueChange={() => {}}
      />,
    );
    await user.click(screen.getByRole("combobox", { name: "Oraș" }));
    const option = screen.getByRole("option", { name: "Cluj-Napoca" });
    expect(option).toHaveAttribute("aria-selected", "true");
    expect(option).toHaveStyle({ backgroundColor: theme.colors.coral });
    expect(option).toHaveStyle({ color: theme.colors.forest });
  });

  it("shows an empty search state when nothing matches", async () => {
    const user = userEvent.setup();
    render(
      <Combobox
        label="Zonă"
        options={[{ value: "Grigorescu", label: "Grigorescu" }]}
        onValueChange={() => {}}
      />,
    );
    await user.click(screen.getByRole("combobox", { name: "Zonă" }));
    await user.type(screen.getByRole("searchbox", { name: "Caută în Zonă" }), "xyz");
    expect(screen.getByRole("status")).toHaveTextContent("Niciun rezultat");
    expect(
      screen.getByText("Încearcă alt cuvânt sau șterge căutarea."),
    ).toBeInTheDocument();
  });
});

