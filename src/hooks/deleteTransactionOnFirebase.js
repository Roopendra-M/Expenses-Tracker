import { deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase";
import { toast } from "react-toastify";

// Corrected delete function
export const deleteTransactionOnFirebase = async (userId, transaction) => {
  try {
    // Get the document reference for the specific transaction in Firestore
    const transactionRef = doc(
      db,
      `users/${userId}/transactions/${transaction.id}`
    );

    // Delete the transaction document
    await deleteDoc(transactionRef);
    toast.success("Transaction deleted successfully.");
  } catch (error) {
    toast.error(error.message);
  }
};
