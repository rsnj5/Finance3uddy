import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [incomeData, setIncomeData] = useState({ category: "", amount: "", desc: "" });
  const [expenseData, setExpenseData] = useState({ category: "", amount: "", desc: "" });
  const [showEdit, setShowEdit] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);

  const navigate = useNavigate();

  // Function to get auth token from localStorage
  const getAuthToken = () => localStorage.getItem("token");

  // Fetch transactions
  useEffect(() => {
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

    fetchTransactions();
  }, []);

  // Handle input changes
  const handleChange = (e, type) => {
    const { name, value } = e.target;
    type === "income"
      ? setIncomeData((prev) => ({ ...prev, [name]: value }))
      : setExpenseData((prev) => ({ ...prev, [name]: value }));
  };

  // Add transaction (only if authenticated)
  const handleAddTransaction = async (type) => {
    const token = getAuthToken();
    if (!token) {
      alert("User not authenticated. Redirecting to login...");
      navigate("/login");
      return;
    }

    const data = type === "income" ? incomeData : expenseData;

    if (!data.category || !data.amount || !data.desc) {
      alert("Please fill in all fields");
      return;
    }

    try {
      await axios.post(
        "http://localhost:8000/api/transactions/",
        { ...data, type },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      refreshTransactions();
      if (type === "income") setIncomeData({ category: "", amount: "", desc: "" });
      else setExpenseData({ category: "", amount: "", desc: "" });

    } catch (error) {
      console.error("Add Transaction failed:", error);
    }
  };

  // Update transaction (only if authenticated)
  const handleUpdate = async () => {
    const token = getAuthToken();
    if (!token) {
      alert("User not authenticated. Redirecting to login...");
      navigate("/login");
      return;
    }

    if (!editingTransaction) return;
    if (!editingTransaction.category || !editingTransaction.amount || !editingTransaction.desc) {
      alert("Please fill in all fields before saving.");
      return;
    }

    try {
      await axios.put(
        `http://localhost:8000/api/transactions/${editingTransaction.id}/`,
        editingTransaction,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      refreshTransactions();
      setShowEdit(false);
      setEditingTransaction(null);
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  // Delete transaction (only if authenticated)
  const handleDelete = async (id) => {
    const token = getAuthToken();
    if (!token) {
      alert("User not authenticated. Redirecting to login...");
      navigate("/login");
      return;
    }

    try {
      await axios.delete(`http://localhost:8000/api/transactions/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      refreshTransactions();
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  // Refresh transactions
  const refreshTransactions = async () => {
    const token = getAuthToken();
    if (!token) return;

    try {
      const response = await axios.get("http://localhost:8000/api/transactions/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTransactions(response.data);
    } catch (error) {
      console.error("Error refreshing transactions:", error);
    }
  };

  const token = getAuthToken();

  return (
    <div className="transactions-container">
      <h2>Transactions</h2>

      {!token ? (
        <p className="auth-warning">You need to <a href="/login">log in</a> to add transactions.</p>
      ) : (
        <>
          {/* Add Income and Expense Forms */}
          <div className="add-transaction income">
            <h3>Add Income</h3>
            <input type="text" name="category" placeholder="Category" value={incomeData.category} onChange={(e) => handleChange(e, "income")} />
            <input type="number" name="amount" placeholder="Amount" value={incomeData.amount} onChange={(e) => handleChange(e, "income")} />
            <input type="text" name="desc" placeholder="Description" value={incomeData.desc} onChange={(e) => handleChange(e, "income")} />
            <button className="btn add income" onClick={() => handleAddTransaction("income")}>Add Income</button>
          </div>

          <div className="add-transaction expense">
            <h3>Add Expense</h3>
            <input type="text" name="category" placeholder="Category" value={expenseData.category} onChange={(e) => handleChange(e, "expense")} />
            <input type="number" name="amount" placeholder="Amount" value={expenseData.amount} onChange={(e) => handleChange(e, "expense")} />
            <input type="text" name="desc" placeholder="Description" value={expenseData.desc} onChange={(e) => handleChange(e, "expense")} />
            <button className="btn add expense" onClick={() => handleAddTransaction("expense")}>Add Expense</button>
          </div>
        </>
      )}

      {/* Transaction List */}
      {transactions.length > 0 ? (
        transactions.map((transaction) => (
          <div key={transaction.id} className={`transaction-card ${transaction.type}`}>
            <div className="card-header">
              <h3>{transaction.category} - ₹{transaction.amount}</h3>
              <p>{transaction.desc}</p>
              <span className={`tag ${transaction.type}`}>{transaction.type.toUpperCase()}</span>
            </div>
            <div className="card-actions">
              <button className="btn edit" onClick={() => {
                setShowEdit(true);
                setEditingTransaction({ ...transaction });
              }}>Edit</button>
              <button className="btn delete" onClick={() => handleDelete(transaction.id)}>Delete</button>
            </div>
          </div>
        ))
      ) : (
        <p>No transactions available</p>
      )}

      {/* Edit Modal */}
      {showEdit && (
        <div className="modal">
          <h3>Edit Transaction</h3>
          <input type="text" name="category" placeholder="Category" value={editingTransaction?.category} onChange={(e) => setEditingTransaction({ ...editingTransaction, category: e.target.value })} />
          <input type="number" name="amount" placeholder="Amount" value={editingTransaction?.amount} onChange={(e) => setEditingTransaction({ ...editingTransaction, amount: e.target.value })} />
          <input type="text" name="desc" placeholder="Description" value={editingTransaction?.desc} onChange={(e) => setEditingTransaction({ ...editingTransaction, desc: e.target.value })} />
          <button className="btn save" onClick={handleUpdate}>Save</button>
          <button className="btn cancel" onClick={() => setShowEdit(false)}>Cancel</button>
        </div>
      )}
    </div>
  );
};

export default Transactions;

