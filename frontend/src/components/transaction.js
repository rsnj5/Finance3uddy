import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Transactions = () => {
    const [transactions, setTransactions] = useState([]);
    const [transactionData, setTransactionData] = useState({
        amount: "",
        payer: "",
        participants: "",
        date: "",
    });
    const [showEdit, setShowEdit] = useState(false);
    const [editingTransaction, setEditingTransaction] = useState(null);

    const navigate = useNavigate();
    const getAuthToken = () => localStorage.getItem("access");

    useEffect(() => {
        fetchTransactions();
    }, []);

    const fetchTransactions = async () => {
        const token = getAuthToken();
        if (!token) return;

        try {
            const response = await axios.get("http://localhost:8000/api/expensesplit/", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setTransactions(response.data);
        } catch (error) {
            console.error("Error fetching transactions:", error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "participants") {
            setTransactionData((prev) => ({ ...prev, participants: value.split(",") }));
        } else {
            setTransactionData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleAddTransaction = async () => {
        const token = getAuthToken();
        if (!token) {
            alert("User not authenticated.");
            navigate("/login");
            return;
        }

        if (!transactionData.amount || !transactionData.payer || transactionData.participants.length === 0) {
            alert("Please fill in all fields.");
            return;
        }

        try {
            await axios.post("http://localhost:8000/api/expensesplit/", transactionData, {
                headers: { Authorization: `Bearer ${token}` },
            });
            fetchTransactions();
            setTransactionData({ amount: "", payer: "", participants: "", date: "" });
        } catch (error) {
            console.error("Add transaction failed:", error);
        }
    };

    const handleUpdate = async () => {
        const token = getAuthToken();
        if (!token || !editingTransaction) return;

        try {
            await axios.put(`http://localhost:8000/api/expensesplit/${editingTransaction.id}/`, editingTransaction, {
                headers: { Authorization: `Bearer ${token}` },
            });
            fetchTransactions();
            setShowEdit(false);
            setEditingTransaction(null);
        } catch (error) {
            console.error("Update failed:", error);
        }
    };

    const handleDelete = async (id) => {
        const token = getAuthToken();
        if (!token) return;

        if (window.confirm("Are you sure you want to delete this transaction?")) {
            try {
                await axios.delete(`http://localhost:8000/api/expensesplit/${id}/`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                fetchTransactions();
            } catch (error) {
                console.error("Delete failed:", error);
            }
        }
    };

    return (
        <div className="transaction-container">
            <h2>Transactions</h2>

            <div className="add-transaction">
                <h3>Add Transaction</h3>
                <input type="number" name="amount" placeholder="Amount" value={transactionData.amount} onChange={handleChange} />
                <input type="text" name="payer" placeholder="Payer Email" value={transactionData.payer} onChange={handleChange} />
                <input type="text" name="participants" placeholder="Participants (comma-separated)" value={transactionData.participants} onChange={handleChange} />
                <input type="date" name="date" value={transactionData.date} onChange={handleChange} />
                <button onClick={handleAddTransaction}>Add Transaction</button>
            </div>

            {transactions.map((transaction) => (
                <div key={transaction.id} className="transaction-card">
                    <h3>₹{transaction.amount}</h3>
                    <p>Payer: {transaction.payer}</p>
                    <p>Participants: {transaction.participants.join(", ")}</p>
                    <p>Date: {transaction.date}</p>

                    <button onClick={() => { setShowEdit(true); setEditingTransaction({ ...transaction }); }}>Edit</button>
                    <button onClick={() => handleDelete(transaction.id)}>Delete</button>
                </div>
            ))}

            {showEdit && editingTransaction && (
                <div className="modal">
                    <h3>Edit Transaction</h3>
                    <input type="number" name="amount" value={editingTransaction.amount} onChange={(e) => setEditingTransaction({ ...editingTransaction, amount: e.target.value })} />
                    <input type="text" name="payer" value={editingTransaction.payer} onChange={(e) => setEditingTransaction({ ...editingTransaction, payer: e.target.value })} />
                    <input type="text" name="participants" value={editingTransaction.participants.join(", ")} onChange={(e) => setEditingTransaction({ ...editingTransaction, participants: e.target.value.split(",") })} />
                    <button onClick={handleUpdate}>Save</button>
                    <button onClick={() => setShowEdit(false)}>Cancel</button>
                </div>
            )}
        </div>
    );
};

export default Transactions;
