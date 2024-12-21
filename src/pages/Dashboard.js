import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { doc, getDoc, addDoc, collection, getDocs, query } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { db, auth } from "../firebase";
import { toast } from "react-toastify";
import { Modal } from "antd"; // Ant Design Modal
import ManageTransactions from "./ManageTransactions"; // Import ManageTransactions
import Incomes from "./Incomes"; // Import Incomes
import "./styles/Dashboard.css";

const Dashboard = () => {
  const [user] = useAuthState(auth);
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState([]);
  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);
  const [currentBalance, setCurrentBalance] = useState(0);
  const [isLimitExceeded, setIsLimitExceeded] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0); // Key to trigger refresh

  // Fetch transactions from Firestore
  const fetchTransactions = async () => {
    if (user) {
      try {
        const dataRef = query(collection(db, `users/${user.uid}/transactions`));
        const querySnapshot = await getDocs(dataRef);
        const transactionArray = [];
        querySnapshot.forEach((doc) => {
          transactionArray.push({ ...doc.data(), id: doc.id });
        });
        setTransactions(transactionArray);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  // Calculate income, expense, and current balance
  const calculateBalance = () => {
    let totalIncome = 0;
    let totalExpense = 0;

    transactions.forEach((transaction) => {
      if (transaction.type === "income") {
        totalIncome += parseFloat(transaction.amount);
      } else {
        totalExpense += parseFloat(transaction.amount);
      }
    });

    setIncome(totalIncome);
    setExpense(totalExpense);
    const balance = totalIncome - totalExpense;
    setCurrentBalance(balance);

    // Check if the balance is negative
    if (balance < 0) {
      setIsLimitExceeded(true);
    }
  };

  // Triggered by child components when data changes
  const handleDataChange = () => {
    setRefreshKey((prevKey) => prevKey + 1);
  };

  useEffect(() => {
    if (user) fetchTransactions();
  }, [user]);

  useEffect(() => {
    calculateBalance();
  }, [transactions]);

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Dashboard</h1>
        <p>Manage your finances with ease and precision.</p>
      </header>

      {/* Current Balance Section */}
      <div className="total-balance-box">
        <h2>Current Balance</h2>
        {loading ? <p>Loading...</p> : <p>₹{currentBalance}</p>}
      </div>

      {/* Dashboard Navigation Menu */}
      <section className="dashboard-menu">
        <Link to="/about" className="menu-card">
          <div className="card-icon">🏠</div>
          <h2>Home</h2>
        </Link>
        <Link to="/expenses" className="menu-card">
          <div className="card-icon">💸</div>
          <h2>Manage Expenses</h2>
          <p>Track and control your daily expenses.</p>
        </Link>
        <Link to="/incomes" className="menu-card">
          <div className="card-icon">💰</div>
          <h2>Manage Incomes</h2>
          <p>Keep a record of all your earnings.</p>
        </Link>
        <Link to="/manage-transactions" className="menu-card">
          <div className="card-icon">📜</div>
          <h2>View Transactions</h2>
          <p>Review your transaction history.</p>
        </Link>
        <Link to="/transactions" className="menu-card">
          <div className="card-icon">📊</div>
          <h2>View Analytics</h2>
          <p>Visualize your financial data.</p>
        </Link>
        <Link to="/settings" className="menu-card">
          <div className="card-icon">⚙️</div>
          <h2>Settings</h2>
          <p>Customize your preferences.</p>
        </Link>
      </section>

      {/* Incomes and Transactions */}
      {/* <Incomes onDataChange={handleDataChange} />
      <ManageTransactions refreshKey={refreshKey} /> */}

      <footer className="dashboard-footer">
        <p>© 2024 Expense Tracker. All rights reserved.</p>
      </footer>

      {/* Limit Exceeded Notification */}
      <Modal
        title="Alert: Spending Limit Exceeded!"
        open={isLimitExceeded}
        onOk={() => setIsLimitExceeded(false)}
        onCancel={() => setIsLimitExceeded(false)}
        okText="Got it"
        cancelText="Dismiss"
      >
        <p>Your spending has exceeded your available income. Please review your expenses and manage your budget.</p>
      </Modal>
    </div>
  );
};

export default Dashboard;
