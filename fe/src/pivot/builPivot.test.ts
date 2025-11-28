
import { describe, it, expect } from "vitest";
import { buildPivot } from "./buildPivot";
import type { Transaction, PivotConfig } from "../types";

describe("buildPivot", () => {
  it("groups by year (rows) and status (columns) and sums amounts", () => {
    const transactions: Transaction[] = [
      {
        id: 1,
        transaction_type: "invoice",
        transaction_number: "T1",
        amount: 100,
        status: "paid",
        year: 2023,
      },
      {
        id: 2,
        transaction_type: "invoice",
        transaction_number: "T2",
        amount: 50,
        status: "unpaid",
        year: 2023,
      },
      {
        id: 3,
        transaction_type: "refund",
        transaction_number: "T3",
        amount: 30,
        status: "paid",
        year: 2023,
      },
      {
        id: 4,
        transaction_type: "invoice",
        transaction_number: "T4",
        amount: 200,
        status: "paid",
        year: 2024,
      },
    ];

    const config: PivotConfig = {
      rowField: "year",
      columnFields: ["status"],
    };

    const pivot = buildPivot(transactions, config);

    expect(pivot).not.toBeNull();
    if (!pivot) return;

    // Row + column keys
    expect(pivot.rowKeys.sort()).toEqual(["2023", "2024"].sort());
    expect(pivot.columnKeys.sort()).toEqual(["paid", "unpaid"].sort());

    // Data values in the underlying map
    const key2023Paid = "2023|||paid";
    const key2023Unpaid = "2023|||unpaid";
    const key2024Paid = "2024|||paid";

    expect(pivot.data[key2023Paid]).toBe(130);  // 100 + 30
    expect(pivot.data[key2023Unpaid]).toBe(50);
    expect(pivot.data[key2024Paid]).toBe(200);
  });

  it("returns null when rowField is null", () => {
    const transactions: Transaction[] = [];
    const config: PivotConfig = {
      rowField: null,
      columnFields: [],
    };
    const pivot = buildPivot(transactions, config);
    expect(pivot).toBeNull();
  });
});
