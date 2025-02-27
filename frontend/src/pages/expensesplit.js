import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ExpenseSplit = () => {
  const [groups, setGroups] = useState([]);
  const [groupName, setGroupName] = useState("");
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [error, setError] = useState(null);
  const [transactionData, setTransactionData] = useState({
    amount: "",
    description: "",
    participants: [],
  });

  const navigate = useNavigate();
  const getAuthToken = () => localStorage.getItem("access");

  useEffect(() => {
    const fetchGroups = async () => {
      const token = getAuthToken();
      if (!token) return;

      try {
        const response = await axios.get("http://localhost:8000/api/expensesplit/groups/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setGroups(response.data);
      } catch (error) {
        console.error("Error fetching groups:", error);
      }
    };

    fetchGroups();
  }, []);

  const handleCreateGroup = async () => {
    const token = getAuthToken();
    if (!token) {
      alert("User not authenticated. Redirecting to login...");
      navigate("/login");
      return;
    }

    if (!groupName) {
      alert("Please enter a group name");
      return;
    }

    try {
      await axios.post("http://localhost:8000/api/expensesplit/groups/", { name: groupName }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      refreshGroups();
      setGroupName("");
    } catch (error) {
      console.error("Error creating group:", error);
    }
  };

  const refreshGroups = async () => {
    const token = getAuthToken();
    if (!token) return;

    try {
      const response = await axios.get("http://localhost:8000/api/expensesplit/groups/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setGroups(response.data);
    } catch (error) {
      console.error("Error refreshing groups:", error);
    }
  };

  const selectGroup = async (group) => {
    setSelectedGroup(group);
    const token = getAuthToken();
    if (!token) return;

    try {
      const [transactionsRes, expensesRes] = await Promise.all([
        axios.get(`http://localhost:8000/api/expensesplit/groups/${group.id}/transactions/`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`http://localhost:8000/api/expensesplit/groups/${group.id}/expenses/`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);
      setTransactions(transactionsRes.data);
      setExpenses(expensesRes.data.expenses);
    } catch (error) {
      console.error("Error fetching group details:", error);
    }
  };

  const handleAddTransaction = async () => {
    const token = getAuthToken();
    if (!token) {
      alert("User not authenticated. Redirecting to login...");
      navigate("/login");
      return;
    }

    if (!selectedGroup || !transactionData.amount || !transactionData.description) {
      alert("Please fill in all fields");
      return;
    }

    try {
      await axios.post(
        `http://localhost:8000/api/expensesplit/groups/${selectedGroup.id}/transactions/`,
        {
          amount: transactionData.amount,
          description: transactionData.description,
          participants: transactionData.participants.map((p) => p.id),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      refreshTransactionsAndExpenses();
      setTransactionData({ amount: "", description: "", participants: [] });
    } catch (error) {
      console.error("Error adding transaction:", error);
    }
  };

  const refreshTransactionsAndExpenses = async () => {
    if (!selectedGroup) return;
    const token = getAuthToken();
    if (!token) return;

    try {
      const [transactionsRes, expensesRes] = await Promise.all([
        axios.get(`http://localhost:8000/api/expensesplit/groups/${selectedGroup.id}/transactions/`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`http://localhost:8000/api/expensesplit/groups/${selectedGroup.id}/expenses/`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);
      setTransactions(transactionsRes.data);
      setExpenses(expensesRes.data.expenses);
    } catch (error) {
      console.error("Error updating transactions and expenses:", error);
    }
  };

  return (
    <div className="expense-split-container">
      <h2>Expense Split</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <div className="add-group">
        <h3>Create Group</h3>
        <input
          type="text"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          placeholder="Enter group name"
        />
        <button onClick={handleCreateGroup}>Create</button>
      </div>

      <ul className="group-list">
        {groups.map((group) => (
          <li key={group.id} onClick={() => selectGroup(group)}>
            {group.name}
          </li>
        ))}
      </ul>

      {selectedGroup && (
        <div className="group-details">
          <h2>{selectedGroup.name} Transactions</h2>
          <ul>
            {transactions.map((tx) => (
              <li key={tx.id}>
                {tx.description} - ₹{tx.amount} (Paid by {tx.payer.username})
              </li>
            ))}
          </ul>

          <div className="add-transaction">
            <h3>Add Transaction</h3>
            <input
              type="number"
              value={transactionData.amount}
              onChange={(e) =>
                setTransactionData({ ...transactionData, amount: e.target.value })
              }
              placeholder="Amount"
            />
            <input
              type="text"
              value={transactionData.description}
              onChange={(e) =>
                setTransactionData({ ...transactionData, description: e.target.value })
              }
              placeholder="Description"
            />
            <button onClick={handleAddTransaction}>Add</button>
          </div>

          <h2>Expense Summary</h2>
          <ul>
            {expenses.map((exp, index) => (
              <li key={index}>
                {exp.name} - Paid: ₹{exp.paid}, Owes: ₹{exp.owed}, Balance: ₹{exp.net_balance}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ExpenseSplit;

