import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const TransactionContext = createContext();

export const TransactionProvider = ({ children }) => {
  const [transactions, setTransactions] = useState([]);

  const getAuthToken = () => localStorage.getItem("access");

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    const token = getAuthToken();
    if (!token) return;

    try {
      const response = await axios.get("http://localhost:8000/api/transactions/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTransactions(response.data);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  const addTransaction = async (data) => {
    const token = getAuthToken();
    if (!token) return;

    try {
      const response = await axios.post("http://localhost:8000/api/transactions/", data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTransactions((prev) => [...prev, response.data]); // Add new transaction to the state
    } catch (error) {
      console.error("Add Transaction failed:", error);
    }
  };

  const updateTransaction = async (id, updatedData) => {
    const token = getAuthToken();
    if (!token) return;

    try {
      await axios.put(`http://localhost:8000/api/transactions/${id}/`, updatedData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setTransactions((prev) =>
        prev.map((transaction) => (transaction.id === id ? { ...transaction, ...updatedData } : transaction))
      );
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  const deleteTransaction = async (id) => {
    const token = getAuthToken();
    if (!token) return;

    try {
      await axios.delete(`http://localhost:8000/api/transactions/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setTransactions((prev) => prev.filter((transaction) => transaction.id !== id));
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  return (
    <TransactionContext.Provider
      value={{ transactions, fetchTransactions, addTransaction, updateTransaction, deleteTransaction }}
    >
      {children}
    </TransactionContext.Provider>
  );
};
