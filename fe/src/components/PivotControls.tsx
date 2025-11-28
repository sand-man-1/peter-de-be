import type { PivotConfig, GroupField } from "../types";

type PivotControlsProps = {
  pivotConfig: PivotConfig;
  setPivotConfig: React.Dispatch<React.SetStateAction<PivotConfig>>;
  onGeneratePivot: () => void;
};

export function PivotControls({
  pivotConfig,
  setPivotConfig,
  onGeneratePivot,
}: PivotControlsProps) {
  const allGroupFields: GroupField[] = ["transaction_type", "status", "year"];

  return (
    <section
      style={{
        marginBottom: "1rem",
        padding: "0.75rem",
        borderRadius: "4px",
      }}
    >
      <h1 style={{ marginTop: 0 }}>Transaction Pivot Report</h1>

      <h2 style={{ fontSize: "1rem", marginBottom: "0.5rem" }}>
        Pivot Configuration
      </h2>

      {/* Row field select */}
      <div style={{ marginBottom: "0.5rem" }}>
        <label>
          Row field:&nbsp;
          <select
            value={pivotConfig.rowField ?? ""}
            onChange={(e) =>{
                const newRowField = e.target.value as GroupField
              setPivotConfig((prev) => ({
                rowField: newRowField,
                columnFields: prev.columnFields.filter((f) => f !== newRowField),
              }))
            }}
          >
            <option value="" disabled>
              Select row field
            </option>
            {allGroupFields.map((field) => (
              <option key={field} value={field}>
                {field.toLocaleUpperCase()}
              </option>
            ))}
          </select>
        </label>
      </div>

      {/* Column fields as checkboxes (multi-select) */}
      <div>
        <span>Column fields:</span>
        <div
          style={{
            display: "flex",
            gap: "0.75rem",
            marginTop: "0.25rem",
            flexWrap: "wrap",
          }}
        >
          {allGroupFields.map((field) => {
            const checked = pivotConfig.columnFields.includes(field);
            const disabled = pivotConfig.rowField === field; // can't use same field on both axes

            return (
              <label key={field} style={{ opacity: disabled ? 0.5 : 1 }}>
                <input
                  type="checkbox"
                  disabled={disabled}
                  checked={checked && !disabled}
                  onChange={(e) => {
                    setPivotConfig((prev) => {
                      if (disabled) return prev;

                      const currentlySelected = prev.columnFields;
                      if (e.target.checked) {
                        return {
                          ...prev,
                          columnFields: [...currentlySelected, field],
                        };
                      }
                      return {
                        ...prev,
                        columnFields: currentlySelected.filter(
                          (f) => f !== field,
                        ),
                      };
                    });
                  }}
                />
                &nbsp;{field}
              </label>
            );
          })}
        </div>
      </div>

      <div style={{ marginTop: "0.75rem" }}>
        <button type="button" onClick={onGeneratePivot}>
          Generate pivot
        </button>
      </div>
    </section>
  );
}
