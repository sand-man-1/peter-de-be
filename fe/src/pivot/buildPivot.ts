import type { Transaction, PivotConfig, GroupField } from "../types";

export interface PivotTableData {
  rowField: GroupField;
  columnFields: GroupField[];
  rowKeys: string[];      // distinct row labels
  columnKeys: string[];   // distinct column labels
  data: Record<string, number>; 
}

const CELL_KEY_SEPARATOR = "|||";

function makeCellKey(rowValue: string, columnValue: string): string {
  return `${rowValue}${CELL_KEY_SEPARATOR}${columnValue}`;
}

export function buildPivot(
  transactions: Transaction[],
  config: PivotConfig,
): PivotTableData | null {
  const { rowField, columnFields } = config;
//if no row field, no build although not possible from UI
  if (!rowField) {
    return null;
  }

  // if no transactions, no build pivot either
  if (transactions.length === 0) {
    return null;
  }

  //Using a set to remove duplictes of unique row labels, and unique column labels. eg. partailly paid or 2024. unique for reporting togehter,
  const rowSet = new Set<string>();
  const colSet = new Set<string>();

  // need summed amounts for each row or column label. this will store in the format of rowlabel || coll label for the key and then the corresposondig value. e.g 2023 || invoice paid
  const data: Record<string, number> = {};


  //if no columns create a single Total column
  const hasColumns = columnFields.length > 0;


  // looping through transactions 
  for (const t of transactions) {
    // using the seletd row field. pull the data from each transaction. so if rowfield is year its getting "year" from transaction
    const rowValue = String(t[rowField]);


    // If user selected column fields, combine their values using " / ".
    //   Example: ["transaction_type","status"] → "invoice / paid"
    //  If no columns were selected, we use a single column called "Total".
    const columnValue = hasColumns
      ? columnFields.map((val) => String(t[val])).join(" / ")
      : "Total";

    //add labels to our sets
    rowSet.add(rowValue);
    colSet.add(columnValue);

    const amount = t.amount;
    // handle errors
    if (Number.isNaN(amount)) continue;


    // summed amounts need to be held in a dict - but to define the key we will use format of rowlabel || collabel as stated earlier
    const key = makeCellKey(rowValue, columnValue);

    // add the sum to the mount in the value of the key in the dict
    data[key] = (data[key] ?? 0) + amount;
  }

  // Sort row + column labels for stable table layout
  const rowKeys = Array.from(rowSet).sort((a, b) => a.localeCompare(b));
  const columnKeys = Array.from(colSet).sort((a, b) => a.localeCompare(b));



  // Finally, return the entire pivot structure:
  // rowField: which field controls rows
  // columnFields: which fields control columns
  // rowKeys: all unique row labels (converted from Set to array)
  // clumnKeys: all unique column labels (converted from Set to array)
  // data: the dictionary of all summed amounts
  console.log(data)
  return {
    rowField,
    columnFields,
    rowKeys,
    columnKeys,
    data,
  };
}

//UI rendering
export function getCellValue(
  pivot: PivotTableData,
  rowValue: string,
  columnValue: string,
): number {
  const key = makeCellKey(rowValue, columnValue);
  return pivot.data[key] ?? 0;
}
