// Allowed fields you can pivot on
export type GroupField = "transaction_type" | "status" | "year";


export interface Transaction {
  id: number, 
  transaction_type: string;
  transaction_number: string;
  amount: number; // 
  status: string;
  year: number;
}

// Pivot configuration stored in React state
export interface PivotConfig {
  rowField: GroupField | null;
  columnFields: GroupField[]; // ["status"] or ["transaction_type", "status"]
}
