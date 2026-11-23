import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";

vi.mock("next/navigation", () => ({
  useParams: () => ({ id: "b-1" }),
}));

import RezervareDetailPage from "./page";

describe("RezervareDetailPage status", () => {
  it("shows a status badge with an icon instead of raw status text", () => {
    render(<RezervareDetailPage />);
    expect(screen.getByText("Deschisă")).toBeInTheDocument();
    expect(screen.getByTestId("status-icon-open")).toBeInTheDocument();
  });
});
