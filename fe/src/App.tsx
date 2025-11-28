import { useEffect, useState } from "react";
import type { Transaction, PivotConfig } from "./types";
import { PivotControls } from "./components/PivotControls";
import { PivotTable } from "./components/PivotTable";
import { usePivot } from "./pivot/usePivot";

function App() {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://127.0.0.1:8000";
  // transactions list to be fetched from backend
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  //error for failed calls to api
  const [error, setError] = useState<string | null>(null);
  const [loadingPivot, setLoadingPivot] =useState(false)
  
  // The user's selected pivot settings. These decide how the pivot is built (rows and columns).
  const [pivotConfig, setPivotConfig] = useState<PivotConfig>({
    rowField: "year",
    columnFields: ["status"],
  });

  // hook, uses lastest transactions
  const { pivotData, generatePivot, clearPivot } = usePivot(transactions);

  useEffect(() => {
  async function fetchTransactions() {
    setLoading(true);
    setError(null);

    const startTime = Date.now();

    try {
      const response = await fetch(`${API_BASE_URL}/api/transactions/`);
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }

      const data = await response.json();
      // normalise back end information
      const normalised: Transaction[] = data.map((item: any) => ({
        transaction_type: item.transaction_type,
        transaction_number: item.transaction_number,
        amount:
          typeof item.amount === "number"
            ? item.amount
            : parseFloat(item.amount),
        status: item.status,
        year:
          typeof item.year === "number"
            ? item.year
            : parseInt(String(item.year), 10),
      }));

      setTransactions(normalised);
    } catch (err: any) {
      setError(err.message ?? "Failed to load transactions");
    } finally {
      // ensure loading lasts at least 1 second
      const elapsed = Date.now() - startTime;
      const delay = Math.max(0, 1000 - elapsed); // enforce 1 sec
      setTimeout(() => setLoading(false), delay);
    }
  }

  fetchTransactions();
}, []);


  const handleGeneratePivot = () => {
    //ui ensures a row is selecetd
    if (!pivotConfig.rowField) {
      alert("Please select a row field");
      return;
    }
    setLoadingPivot(true)
    const startTime = Date.now()
    // handle generate pivot and build pivot etc, usign the configs in the config setter
    generatePivot(pivotConfig);

  const elapsed = Date.now() - startTime;
  const delay = Math.max(0, 500 - elapsed);

  setTimeout(() => {
    setLoadingPivot(false);
  }, delay);
  };

  return (
    <div style={{ padding: "1rem", fontFamily: "system-ui, sans-serif" }}>
      <PivotControls
        pivotConfig={pivotConfig}
        setPivotConfig={setPivotConfig}
        onGeneratePivot={handleGeneratePivot}
      />

      {/* {loading && <p>Loading transactions…..</p>} */}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {pivotData && (
        <section style={{ marginTop: "1rem" }}>
          <h2>Pivot result</h2>
          {loadingPivot && (
            <p style = {{ fontStyle: "italic", color: '#555'}}>
              Generating pivot...
            </p>
          )}

          {!loadingPivot && (
            <>
          <PivotTable pivot={pivotData} />
          <button
            type="button"
            onClick={clearPivot}
            style={{ marginTop: "0.5rem" }}
          >
            Clear pivot
          </button>
          </>
          )}
        </section>
      )}

      {/* Optional: Raw data table for debugging */}
      <section style={{ marginTop: "1.5rem" }}>
        <h2>Raw transactions</h2>

        {loading && (
          <p style={{ fontStyle: "italic", color: '#555'}}>
            Loading transactions.....
          </p>
        )}

        { !loading && (
        <table
          style={{
            borderCollapse: "collapse",
            marginTop: "0.5rem",
            minWidth: "400px",
          }}
        >
          <thead>
            <tr>
              <th style={{ border: "1px solid #ccc", padding: "4px 8px" }}>
                Id
              </th>
              <th style={{ border: "1px solid #ccc", padding: "4px 8px" }}>
                Type
              </th>
              <th style={{ border: "1px solid #ccc", padding: "4px 8px" }}>
                Number
              </th>
              <th style={{ border: "1px solid #ccc", padding: "4px 8px" }}>
                Amount
              </th>
              <th style={{ border: "1px solid #ccc", padding: "4px 8px" }}>
                Status
              </th>
              <th style={{ border: "1px solid #ccc", padding: "4px 8px" }}>
                Year
              </th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((t, idx) => (
              <tr key={t.id}>
                <td style={{ border: "1px solid #ddd", padding: "4px 8px" }}>
                  {idx+1}
                </td>
                <td style={{ border: "1px solid #ddd", padding: "4px 8px" }}>
                  {t.transaction_type}
                </td>
                <td style={{ border: "1px solid #ddd", padding: "4px 8px" }}>
                  {t.transaction_number}
                </td>
                <td
                  style={{
                    border: "1px solid #ddd",
                    padding: "4px 8px",
                    textAlign: "right",
                  }}
                >
                  {t.amount.toFixed(2)}
                </td>
                <td style={{ border: "1px solid #ddd", padding: "4px 8px" }}>
                  {t.status}
                </td>
                <td style={{ border: "1px solid #ddd", padding: "4px 8px" }}>
                  {t.year}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        )}
      </section>
    </div>
  );
}

export default App;
