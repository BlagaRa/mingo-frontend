import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { DataTable } from "./data-table";

describe("DataTable", () => {
  it("renders column headers and row children", () => {
    render(
      <DataTable columns={["Nume", "Rol"]}>
        <tr>
          <td>Andrei</td>
          <td>player</td>
        </tr>
      </DataTable>,
    );
    expect(screen.getByRole("columnheader", { name: "Nume" })).toBeInTheDocument();
    expect(screen.getByText("Andrei")).toBeInTheDocument();
  });

  it("renders empty slot when children are absent", () => {
    render(
      <DataTable columns={["Nume"]} empty={<p>Nimic de afișat</p>}>
        {null}
      </DataTable>,
    );
    expect(screen.getByText("Nimic de afișat")).toBeInTheDocument();
  });
});
