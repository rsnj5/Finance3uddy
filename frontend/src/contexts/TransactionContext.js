import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const TransactionContext = createContext();

export const TransactionProvider = ({ children }) => {
  const [transactions, setTransactions] = useState([]);
  const [weeklyData, setWeeklyData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [yearlyData, setYearlyData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [incomeArray, setIncomeArray] = useState([]);
  const [expenseArray, setExpenseArray] = useState([]);

  const getAuthToken = () => localStorage.getItem("access");

  useEffect(() => {
    fetchTransactions();
    fetchWeeklyData();
    fetchMonthlyData();
    fetchYearlyData();
    fetchCategoryData();
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

  const fetchWeeklyData = async () => {
    const token = getAuthToken();
    if (!token) return;

    try {
      const response = await axios.get("http://localhost:8000/api/transactions/weekly/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setWeeklyData(response.data);
    } catch (error) {
      console.error("Error fetching weekly transactions:", error);
    }
  };

  const fetchMonthlyData = async () => {
    const token = getAuthToken();
    if (!token) return;

    try {
      const response = await axios.get("http://localhost:8000/api/transactions/monthly/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMonthlyData(response.data);
    } catch (error) {
      console.error("Error fetching monthly transactions:", error);
    }
  };

  const fetchYearlyData = async () => {
    const token = getAuthToken();
    if (!token) return;

    try {
      const response = await axios.get("http://localhost:8000/api/transactions/yearly/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setYearlyData(response.data);
    } catch (error) {
      console.error("Error fetching yearly transactions:", error);
    }
  };

  const fetchCategoryData = async () => {
    const token = getAuthToken();
    if (!token) return;

    try {
      const response = await axios.get("http://localhost:8000/api/transactions/category/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCategoryData(response.data);

      // Extract categories and amounts
      const allCategories = response.data.map((item) => item.category);
      setAllCategories(allCategories);

      const expenseArray = response.data.map((item) => item.total_expense || 0);
      setExpenseArray(expenseArray);

      const incomeArray = response.data.map((item) => item.total_income || 0);
      setIncomeArray(incomeArray);
    } catch (error) {
      console.error("Error fetching category transactions:", error);
    }
  };

  const addTransaction = async (data) => {
    const token = getAuthToken();
    if (!token) return;

    try {
      const response = await axios.post("http://localhost:8000/api/transactions/", data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTransactions((prev) => [...prev, response.data]);
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
      value={{
        transactions,
        fetchTransactions,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        weeklyData,
        monthlyData,
        yearlyData,
        categoryData,
        allCategories,
        incomeArray,
        expenseArray,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};

