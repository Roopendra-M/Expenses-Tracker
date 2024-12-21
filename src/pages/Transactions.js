import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { query, collection, getDocs, addDoc } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import Analytics from "./Analytics";
import Papa from "papaparse"; // For CSV operations
import "./styles/Transactions.css"; // Import CSS for styling

const Transactions = () => {
  const [user] = useAuthState(auth);
  const [transactions, setTransactions] = useState([]);
  const navigate = useNavigate();

  // Fetch transactions from Firestore
  const fetchTransactions = async () => {
    if (!user) return;
    try {
      const dataRef = query(collection(db, `users/${user.uid}/transactions`));
      const querySnapshot = await getDocs(dataRef);
      const transactionArray = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTransactions(transactionArray);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [user]);

  // Export transactions to a CSV file
  const handleExport = () => {
    if (transactions.length === 0) {
      alert("No transactions to export.");
      return;
    }
    const csv = Papa.unparse(transactions);
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "transactions.csv";
    link.click();
  };

  // Import transactions from a CSV file
  const handleImport = async (e) => {
    const file = e.target.files[0];
    if (!file) {
      alert("Please select a file to import.");
      return;
    }
    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const csv = reader.result;
        const { data } = Papa.parse(csv, { header: true });
        for (const row of data) {
          if (row.name && row.amount && row.date && row.type) {
            await addDoc(collection(db, `users/${user.uid}/transactions`), {
              name: row.name,
              amount: parseFloat(row.amount),
              date: row.date,
              type: row.type,
            });
          }
        }
        fetchTransactions(); // Refresh transactions after import
      };
      reader.readAsText(file);
    } catch (error) {
      console.error("Error importing transactions:", error);
    }
  };

  // Navigate to ManageTransactions page
  const handleManageTransactions = () => {
    navigate("/manage-transactions", { state: { transactions } });
  };

  return (
    <div className="transactions-container">
      <h1 className="transactions-title">Analytics</h1>
      <div className="actions-container">
        <button
          className="action-button export-button"
          onClick={handleExport}
          title="Export all transactions to a CSV file"
        >
          Export Transactions
        </button>
        <label className="import-label">
          <input
            type="file"
            className="import-input"
            onChange={handleImport}
            accept=".csv"
            title="Import transactions from a CSV file"
          />
          Import Transactions
        </label>
        <button
          className="action-button manage-button"
          onClick={handleManageTransactions}
          title="View and manage your transactions"
        >
          Manage Transactions
        </button>
      </div>
      <div className="analytics-container">
        <Analytics transactions={transactions} />
      </div>
    </div>
  );
};

export default Transactions;
