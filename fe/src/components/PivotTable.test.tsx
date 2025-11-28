
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { PivotTable } from "./PivotTable";
import type { PivotTableData } from "../pivot/buildPivot";

describe("<PivotTable />", () => {
  it("renders headers and values for a simple pivot", () => {
    const pivot: PivotTableData = {
      rowField: "year",
      columnFields: ["status"],
      rowKeys: ["2023", "2024"],
      columnKeys: ["paid", "unpaid"],
      data: {
        "2023|||paid": 130,
        "2023|||unpaid": 50,
        "2024|||paid": 200,
        "2024|||unpaid": 0,
      },
    };

    render(<PivotTable pivot={pivot} />);

    // Check that the row label is rendered
    expect(screen.getByText("year")).toBeInTheDocument();

    // Check column headers
    expect(screen.getByText("paid")).toBeInTheDocument();
    expect(screen.getByText("unpaid")).toBeInTheDocument();

    // Check one of the data cells 
    expect(screen.getByText("130.00")).toBeInTheDocument();
    expect(screen.getByText("200.00")).toBeInTheDocument();
    const fiftyCells = screen.getAllByText("50.00");
    expect(fiftyCells).toHaveLength(2);

    // Optionally check row labels
    expect(screen.getByText("2023")).toBeInTheDocument();
    expect(screen.getByText("2024")).toBeInTheDocument();
  });

  it("shows 'No data' message when there are no rows or columns", () => {
    const emptyPivot: PivotTableData = {
      rowField: "year",
      columnFields: ["status"],
      rowKeys: [],
      columnKeys: [],
      data: {},
    };

    render(<PivotTable pivot={emptyPivot} />);

    expect(
      screen.getByText(/No data for current pivot configuration/i),
    ).toBeInTheDocument();
  });
});
