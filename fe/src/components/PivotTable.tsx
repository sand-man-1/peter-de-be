import React from "react";
import { getCellValue, type PivotTableData } from "../pivot/buildPivot";

type PivotTableProps = {
  pivot: PivotTableData;
};

//Take the already-prepared pivot data (rows, columns, and sums)
//draw as a clean HTML table


export const PivotTable: React.FC<PivotTableProps> = ({ pivot }) => {
  // for easy use
  const { rowField, columnFields, rowKeys, columnKeys } = pivot;

  if (rowKeys.length === 0 || columnKeys.length === 0) {
    return <p>No data for current pivot configuration.</p>;
  }

  // Column totals: for each column key, sum all rows
const columnTotals: Record<string, number> = {};

// go through each row and column and sum totals
for (const row of rowKeys) {
  for (const col of columnKeys) {
    const value = getCellValue(pivot, row, col);
    columnTotals[col] = (columnTotals[col] ?? 0) + value;
  }
}

  // Split "invoice / unpaid" → ["invoice", "unpaid"]
  const columnTuples = columnKeys.map((key) => key.split(" / "));
  // rows will be row lables and total
  const levels = columnFields.length > 0 ? columnFields.length : 1; 

  return (
    <table
      style={{
        borderCollapse: "collapse",
        marginTop: "0.5rem",
        minWidth: "600px",
      }}
    >
      <thead>
        {/* One header row per column level */}
        {Array.from({ length: levels }).map((_, levelIndex) => {
          const headerCells = [];
          let colIndex = 0;

          while (colIndex < columnKeys.length) {
            const value = columnTuples[colIndex][levelIndex] ?? "";
            let span = 1;
            let j = colIndex + 1;

            // Group contiguous columns with same value at this level
            while (
              j < columnKeys.length &&
              (columnTuples[j][levelIndex] ?? "") === value
            ) {
              span++;
              j++;
            }

            headerCells.push(
              <th
                key={`h-${levelIndex}-${colIndex}`}
                colSpan={span}
                style={{
                  border: "1px solid #ccc",
                  padding: "4px 8px",
                  background: "#f7f7f7",
                  textAlign: "center",
                }}
              >
                {value}
              </th>,
            );

            colIndex = j;
          }

          return (
            <tr key={`row-header-${levelIndex}`}>
              {levelIndex === 0 && (
                <th
                  rowSpan={levels}
                  style={{
                    border: "1px solid #ccc",
                    padding: "4px 8px",
                    background: "#f7f7f7",
                  }}
                >
                  {rowField}
                </th>
              )}
              {headerCells}
            </tr>
          );
        })}
      </thead>

      <tbody>
        {rowKeys.map((row) => (
          <tr key={row}>
            <td
              style={{
                border: "1px solid #ddd",
                padding: "4px 8px",
                fontWeight: 500,
              }}
            >
              {row}
            </td>

            {columnKeys.map((col) => {
              const value = getCellValue(pivot, row, col);
              return (
                <td
                  key={`${row}-${col}`}
                  style={{
                    border: "1px solid #ddd",
                    padding: "4px 8px",
                    textAlign: "right",
                  }}
                >
                  {value.toFixed(2)}
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
      {/* Bottom "Total" row with totals per column */}
      <tfoot>
        <tr>
          <td
            style={{
              padding: "4px 8px",
              textAlign: "left",
              fontWeight: 600,
              borderTop: "2px solid #ccc",
            }}
          >
            Total
          </td>

          {/* One total per column, in the same order as columnKeys */}
          {columnKeys.map((col) => (
            <td
              key={`total-${col}`}
              style={{
                padding: "4px 8px",
                textAlign: "right",
                fontWeight: 600,
                borderTop: "2px solid #ccc",
              }}
            >
              {(columnTotals[col] ?? 0).toFixed(2)}
            </td>
          ))}
        </tr>
      </tfoot>
    </table>
  );
};
