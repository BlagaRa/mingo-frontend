import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ActivityList } from "./activity-list";

describe("ActivityList", () => {
  it("lists activity titles", () => {
    render(
      <ActivityList
        items={[
          { id: "1", title: "Verde Nord 1", meta: "azi · open" },
        ]}
      />,
    );
    expect(screen.getByText("Verde Nord 1")).toBeInTheDocument();
    expect(screen.getByText("azi · open")).toBeInTheDocument();
  });

  it("shows empty copy when there are no items", () => {
    render(<ActivityList items={[]} />);
    expect(screen.getByText("Nu există activitate recentă")).toBeInTheDocument();
  });
});
