import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { toast } from "react-toastify";

// Corrected update function
export const updateTransactionOnFirebase = async (userId, updatedTransaction) => {
  try {
    // Get the document reference for the specific transaction
    const transactionRef = doc(
      db,
      `users/${userId}/transactions/${updatedTransaction.id}`
    );

    // Update the transaction in Firestore
    await updateDoc(transactionRef, {
      name: updatedTransaction.name,
      amount: updatedTransaction.amount,
      date: updatedTransaction.date,
      type: updatedTransaction.type,
    });

    toast.success("Transaction updated successfully.");
  } catch (error) {
    toast.error(error.message);
  }
};
