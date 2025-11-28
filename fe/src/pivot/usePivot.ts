import { useState } from "react";
import type { Transaction, PivotConfig } from "../types";
import { buildPivot, type PivotTableData } from "./buildPivot";

export function usePivot(transactions: Transaction[]) {
  // using transactions means pivot tables will renrender when transactions changes
  const [pivotData, setPivotData] = useState<PivotTableData | null>(null);

  // generate the table hook
  const generatePivot = (config: PivotConfig) => {

    // It returns a ready-made pivot table:
    //unique years (or whatever row was selected)
    //unique columns
    //all summed amounts
    const result = buildPivot(transactions, config);

    // Saving it triggers the UI to update and show the new pivot table.
    setPivotData(result);
  };

  const clearPivot = () => setPivotData(null);

  return { pivotData, generatePivot, clearPivot };
}
