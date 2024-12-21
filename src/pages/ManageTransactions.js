import React, { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { collection, query, getDocs, doc, deleteDoc, updateDoc } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { toast } from "react-toastify";
import "./styles/ManageTransactions.css";

const ManageTransactions = () => {
  const [user] = useAuthState(auth);
  const [transactions, setTransactions] = useState([]);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [filterType, setFilterType] = useState("all"); // Filter type: all, income, expense

  const fetchTransactions = async () => {
    if (user) {
      try {
        // Fetch transactions
        const transactionsQuery = query(collection(db, `users/${user.uid}/transactions`));
        const transactionsSnapshot = await getDocs(transactionsQuery);
        const transactionsList = transactionsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Fetch incomes
        const incomesQuery = query(collection(db, `users/${user.uid}/incomes`));
        const incomesSnapshot = await getDocs(incomesQuery);
        const incomesList = incomesSnapshot.docs.map((doc) => ({
          id: doc.id,
          type: "income", // Add type field for incomes
          ...doc.data(),
        }));

        // Combine both
        const combinedData = [...transactionsList, ...incomesList];
        setTransactions(combinedData);
      } catch (error) {
        toast.error("Error fetching transactions: " + error.message);
      }
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [user]);

  const deleteTransaction = async (id, collectionName) => {
    if (!user) return;
    try {
      await deleteDoc(doc(db, `users/${user.uid}/${collectionName}/${id}`));
      toast.success("Transaction deleted successfully!");
      fetchTransactions();
    } catch (error) {
      toast.error("Failed to delete transaction.");
    }
  };

  const updateTransaction = async (id, updatedData, collectionName) => {
    if (!user) return;
    try {
      const transactionRef = doc(db, `users/${user.uid}/${collectionName}/${id}`);
      await updateDoc(transactionRef, updatedData);
      toast.success("Transaction updated successfully!");
      fetchTransactions();
    } catch (error) {
      toast.error("Failed to update transaction.");
    }
  };

  const handleEditSubmit = (event) => {
    event.preventDefault();
    if (editingTransaction) {
      const updatedData = {
        name: event.target.name.value,
        amount: Number(event.target.amount.value),
        date: event.target.date.value,
        type: event.target.type.value,
      };
      const collectionName = editingTransaction.type === "income" ? "incomes" : "transactions";
      updateTransaction(editingTransaction.id, updatedData, collectionName);
      setEditingTransaction(null);
    }
  };

  const filteredTransactions = transactions.filter((transaction) => {
    if (filterType === "all") return true;
    return transaction.type === filterType;
  });

  return (
    <div className="manage-transactions-container">
      <h1>Manage Transactions</h1>
      <div className="filter-container">
        <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
          <option value="all">All</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
      </div>
      {filteredTransactions.length > 0 ? (
        <div className="transactions-list">
          {filteredTransactions.map((transaction) => (
            <div key={transaction.id} className="transaction-card">
              <div className="transaction-info">
                <p><strong>Name:</strong> {transaction.name}</p>
                <p><strong>Amount:</strong> ₹{transaction.amount}</p>
                <p><strong>Date:</strong> {transaction.date}</p>
                <p><strong>Type:</strong> {transaction.type}</p>
              </div>
              <div className="action-buttons">
                <button className="edit-btn" onClick={() => setEditingTransaction(transaction)}>
                  Edit
                </button>
                <button
                  className="delete-btn"
                  onClick={() =>
                    deleteTransaction(
                      transaction.id,
                      transaction.type === "income" ? "incomes" : "transactions"
                    )
                  }
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No transactions found. Add some to get started!</p>
      )}
      {editingTransaction && (
        <form className="edit-transaction-form" onSubmit={handleEditSubmit}>
          <h2>Edit Transaction</h2>
          <label>
            Name:
            <input name="name" defaultValue={editingTransaction.name} required />
          </label>
          <label>
            Amount:
            <input
              name="amount"
              defaultValue={editingTransaction.amount}
              type="number"
              required
            />
          </label>
          <label>
            Date:
            <input name="date" defaultValue={editingTransaction.date} required />
          </label>
          <label>
            Type:
            <select name="type" defaultValue={editingTransaction.type}>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </label>
          <div className="form-buttons">
            <button type="submit">Save</button>
            <button type="button" onClick={() => setEditingTransaction(null)}>
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default ManageTransactions;
