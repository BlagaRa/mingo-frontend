import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import {
  CardSkeleton,
  EmptyState,
  ErrorState,
  Skeleton,
  TableSkeleton,
} from "./feedback";

describe("feedback states", () => {
  it("renders an empty state with action slot", () => {
    render(
      <EmptyState
        title="Nicio oră liberă"
        description="Încearcă altă zi din calendar."
        action={<button type="button">Alege altă zi</button>}
      />,
    );
    expect(screen.getByRole("status")).toHaveTextContent("Nicio oră liberă");
    expect(screen.getByText("Încearcă altă zi din calendar.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Alege altă zi" })).toBeInTheDocument();
  });

  it("renders an error state focused on recovery", () => {
    render(
      <ErrorState
        title="Nu am putut încărca"
        description="Reîncearcă peste o clipă."
        action={<button type="button">Reîncearcă</button>}
      />,
    );
    expect(screen.getByRole("alert")).toHaveTextContent("Nu am putut încărca");
    expect(screen.getByRole("button", { name: "Reîncearcă" })).toBeInTheDocument();
  });

  it("renders a skeleton loader for pending UI", () => {
    render(<Skeleton label="Se încarcă rezultatele" lines={3} />);
    expect(screen.getByRole("status", { name: "Se încarcă rezultatele" })).toBeInTheDocument();
    expect(screen.getAllByTestId("skeleton-line")).toHaveLength(3);
  });

  it("renders card skeletons for pitch grids", () => {
    render(<CardSkeleton count={2} />);
    expect(
      screen.getByRole("status", { name: "Se încarcă terenurile" }),
    ).toBeInTheDocument();
  });

  it("renders table skeletons for booking lists", () => {
    render(<TableSkeleton rows={3} />);
    expect(
      screen.getByRole("status", { name: "Se încarcă rezervările" }),
    ).toBeInTheDocument();
  });
});

