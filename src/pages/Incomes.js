import React, { useState, useEffect } from "react";
import AddIncome from "../components/Modals/AddIncome";
import { toast } from "react-toastify";
import { auth, db } from "../firebase";
import { addDoc, collection, query, getDocs, doc, deleteDoc, updateDoc } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import "./styles/incomes.css"; // Custom CSS for styling

const Incomes = () => {
  const [isIncomeModalVisible, setIsIncomeModalVisible] = useState(false);
  const [editIncome, setEditIncome] = useState(null);
  const [user] = useAuthState(auth);
  const [incomes, setIncomes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("date");

  useEffect(() => {
    if (user) {
      fetchIncomes();
    }
  }, [user]);

  const fetchIncomes = async () => {
    try {
      const incomesCollection = query(collection(db, `users/${user.uid}/incomes`));
      const incomesSnapshot = await getDocs(incomesCollection);
      const incomesList = incomesSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setIncomes(incomesList);
    } catch (error) {
      toast.error("Error fetching incomes: " + error.message);
    }
  };

  const showIncomeModal = () => setIsIncomeModalVisible(true);
  const handleIncomeCancel = () => {
    setIsIncomeModalVisible(false);
    setEditIncome(null);
  };

  const onFinish = async (values) => {
    try {
      const { name, amount, date } = values;

      if (!user) {
        toast.error("You must be logged in to add income!");
        return;
      }

      if (editIncome) {
        await updateDoc(doc(db, `users/${user.uid}/incomes`, editIncome.id), {
          name,
          amount: parseFloat(amount),
          date: date.format("DD-MM-YYYY"),
          type: "income", // Ensure type field is present
        });
        toast.success("Income updated successfully!");
      } else {
        await addDoc(collection(db, `users/${user.uid}/incomes`), {
          name,
          amount: parseFloat(amount),
          date: date.format("DD-MM-YYYY"),
          type: "income", // Ensure type field is present
        });
        toast.success("Income added successfully!");
      }

      setIsIncomeModalVisible(false);
      setEditIncome(null);
      fetchIncomes();
    } catch (error) {
      toast.error("Error adding/updating income: " + error.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, `users/${user.uid}/incomes`, id));
      toast.success("Income deleted successfully!");
      fetchIncomes();
    } catch (error) {
      toast.error("Error deleting income: " + error.message);
    }
  };

  const filteredIncomes = incomes
    .filter((income) =>
      income.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortOption === "amount") return b.amount - a.amount;
      if (sortOption === "name") return a.name.localeCompare(b.name);
      return new Date(b.date) - new Date(a.date);
    });

  return (
    <div className="income-page">
      <div className="income-header">
        <h1>Manage Incomes</h1>
        <p>Keep track of your income sources effortlessly!</p>
      </div>
      <div className="income-actions">
        <input
          type="text"
          className="search-input"
          placeholder="Search incomes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="sort-dropdown"
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
        >
          <option value="date">Sort by Date</option>
          <option value="amount">Sort by Amount</option>
          <option value="name">Sort by Name</option>
        </select>
        <button className="add-income-button" onClick={showIncomeModal}>
          + Add Income
        </button>
      </div>
      <AddIncome
        isIncomeModalVisible={isIncomeModalVisible}
        handleIncomeCancel={handleIncomeCancel}
        onFinish={onFinish}
        initialValues={editIncome}
      />

      <div className="income-list">
        {filteredIncomes.length > 0 ? (
          filteredIncomes.map((income) => (
            <div className="income-card" key={income.id}>
              <div className="income-details">
                <h3>{income.name}</h3>
                <p><strong>Amount:</strong> ₹{income.amount}</p>
                <p><strong>Date:</strong> {income.date}</p>
              </div>
              <div className="income-actions">
                <button
                  className="edit-button"
                  onClick={() => {
                    setEditIncome(income);
                    setIsIncomeModalVisible(true);
                  }}
                >
                  Edit
                </button>
                <button
                  className="delete-button"
                  onClick={() => handleDelete(income.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>No incomes added yet. Start by clicking "Add Income"!</p>
        )}
      </div>
    </div>
  );
};

export default Incomes;
