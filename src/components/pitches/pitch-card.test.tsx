import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { PitchCard } from "./pitch-card";
import { pitches } from "@/lib/mock/queries";

describe("PitchCard", () => {
  it("shows the hourly whole-pitch price", () => {
    render(<PitchCard pitch={pitches[0]} />);
    expect(screen.getByText(/\/ oră/)).toBeInTheDocument();
    expect(screen.queryByText(/\/ om/)).not.toBeInTheDocument();
    expect(screen.getByText(/200/)).toBeInTheDocument();
  });
});
