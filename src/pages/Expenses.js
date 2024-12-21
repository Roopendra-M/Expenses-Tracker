import React, { useState, useEffect } from "react";
import AddExpense from "../components/Modals/AddExpense"; // Import AddExpense Modal
import { toast } from "react-toastify";
import { auth, db } from "../firebase";
import { addDoc, collection, getDocs } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import "./styles/Expenses.css"; // Import the updated CSS file

const Expenses = () => {
  const [user] = useAuthState(auth); // Firebase authentication state
  const [isExpenseModalVisible, setIsExpenseModalVisible] = useState(false); // State for modal visibility
  const [expenses, setExpenses] = useState([]); // State to store expenses

  // Show the Add Expense Modal
  const showExpenseModal = () => setIsExpenseModalVisible(true);

  // Hide the Add Expense Modal
  const handleExpenseCancel = () => setIsExpenseModalVisible(false);

  // Fetch expenses from Firestore
  const fetchExpenses = async () => {
    if (!user) return;
    try {
      const snapshot = await getDocs(
        collection(db, `users/${user.uid}/transactions`)
      );
      const fetchedExpenses = snapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter((item) => item.type === "expense"); // Filter for expenses only
      setExpenses(fetchedExpenses);
    } catch (err) {
      toast.error("Error fetching expenses");
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, [user]);

  // Handle form submission for adding expense
  const onFinish = async (values) => {
    const newTransaction = {
      type: "expense",
      date: values.date.format("DD-MM-YYYY"),
      amount: parseFloat(values.amount),
      name: values.name,
    };
    try {
      await addDoc(
        collection(db, `users/${user.uid}/transactions`),
        newTransaction
      );
      toast.success("Expense Added!");
      setIsExpenseModalVisible(false); // Close the modal after successful submission
      fetchExpenses(); // Fetch updated expenses
    } catch (err) {
      toast.error("Couldn't add expense");
    }
  };

  return (
    <div className="expenses-container">
      <div className="expenses-header">
        <h1>Manage Expenses</h1>
        <p>Track and manage your expenses effortlessly.</p>
      </div>
      <div className="expenses-actions">
        {/* Button to open the Add Expense Modal */}
        <button className="add-expense-btn" onClick={showExpenseModal}>
          Add Expense
        </button>
      </div>

      {/* Display expenses */}
      <div className="expenses-list">
        {expenses.map((expense) => (
          <div key={expense.id} className="expense-card">
            <div className="expense-details">
              <div>
                <h3>{expense.name}</h3>
                <p>Expense Name</p>
              </div>
              <div>
                <h3>₹{expense.amount.toFixed(2)}</h3>
                <p>Amount</p>
              </div>
              <div>
                <h3>{expense.date}</h3>
                <p>Date</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* AddExpense Modal */}
      <AddExpense
        isExpenseModalVisible={isExpenseModalVisible}
        handleExpenseCancel={handleExpenseCancel}
        onFinish={onFinish} // Pass the onFinish handler to process form data
      />
    </div>
  );
};

export default Expenses;
