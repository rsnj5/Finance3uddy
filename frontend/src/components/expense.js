import React, { useState, useEffect } from "react";
import axios from "axios";

const Expenses = () => {
    const [expenses, setExpenses] = useState([]);
    const [expenseData, setExpenseData] = useState({ description: "", amount: "", category: "" });

    const getAuthToken = () => localStorage.getItem("access");

    useEffect(() => {
        fetchExpenses();
    }, []);

    const fetchExpenses = async () => {
        const token = getAuthToken();
        if (!token) return;

        try {
            const response = await axios.get("http://localhost:8000/api/expensesplit/", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setExpenses(response.data);
        } catch (error) {
            console.error("Error fetching expenses:", error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setExpenseData((prev) => ({ ...prev, [name]: value }));
    };

    const handleAddExpense = async () => {
        const token = getAuthToken();
        if (!token) return;

        try {
            await axios.post("http://localhost:8000/api/expensesplit/", expenseData, {
                headers: { Authorization: `Bearer ${token}` },
            });
            fetchExpenses();
            setExpenseData({ description: "", amount: "", category: "" });
        } catch (error) {
            console.error("Add expense failed:", error);
        }
    };

    return (
        <div className="expense-container">
            <h2>Expenses</h2>

            <div className="add-expense">
                <input type="text" name="description" placeholder="Description" value={expenseData.description} onChange={handleChange} />
                <input type="number" name="amount" placeholder="Amount" value={expenseData.amount} onChange={handleChange} />
                <input type="text" name="category" placeholder="Category" value={expenseData.category} onChange={handleChange} />
                <button onClick={handleAddExpense}>Add Expense</button>
            </div>

            {expenses.map((expense) => (
                <div key={expense.id} className="expense-card">
                    <h3>{expense.description}</h3>
                    <p>₹{expense.amount}</p>
                    <p>Category: {expense.category}</p>
                </div>
            ))}
        </div>
    );
};

export default Expenses;
