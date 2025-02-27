import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import '../styles/expensesplit.css';

const ExpenseSplit = () => {
  const [groups, setGroups] = useState([]);
  const [groupName, setGroupName] = useState("");
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [authorizedUsers, setAuthorizedUsers] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [transactionData, setTransactionData] = useState({
    amount: "",
    description: "",
    payer: "",
    participants: [],
  });

  const navigate = useNavigate();
  const getAuthToken = () => localStorage.getItem("access");

  useEffect(() => {
    fetchGroups();
    fetchAuthorizedUsers();
  }, []);
  useEffect(() => {
    if (selectedGroup) {
      fetchTransactions();
      fetchExpenses();
    }
  }, [selectedGroup]);

  const fetchGroups = async () => {
    const token = getAuthToken();
    if (!token) return;
  
    try {
      const response = await axios.get("http://localhost:8000/api/expensesplit/groups/", {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      console.log("Fetched Groups:", response.data); // Debugging
      setGroups(response.data);
    } catch (error) {
      console.error("Error fetching groups:", error);
    }
  };
  
  

  const fetchExpenses = async () => {
    const token = getAuthToken();
    if (!token || !selectedGroup) return;

    try {
      const response = await axios.get(
        `http://localhost:8000/api/expensesplit/groups/${selectedGroup.id}/expenses/`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setExpenses(response.data.expenses);
    } catch (error) {
      console.error("Error fetching expenses:", error);
    }
  };

const fetchTransactions = async () => {
    const token = getAuthToken();
    if (!token || !selectedGroup) return;

    try {
      const response = await axios.get(
        `http://localhost:8000/api/expensesplit/groups/${selectedGroup.id}/transactions/`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setTransactions(response.data);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  const fetchAuthorizedUsers = async () => {
    const token = getAuthToken();
    if (!token) return;

    try {
      const response = await axios.get("http://localhost:8000/api/users/authorized/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAuthorizedUsers(response.data);
    } catch (error) {
      console.error("Error fetching authorized users:", error);
    }
  };

  const handleCreateGroup = async () => {
    const token = getAuthToken();
    if (!token) {
      alert("Please log in.");
      navigate("/login");
      return;
    }
    if (!groupName) {
      alert("Enter a group name.");
      return;
    }
    if (selectedMembers.length === 0) {
      alert("Select at least one member.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8000/api/expensesplit/groups/",
        { 
          name: groupName,
          members: selectedMembers
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setGroups([...groups, response.data]); 
      setGroupName(""); 
      setSelectedMembers([]);
    } catch (error) {
      console.error("Error creating group:", error);
    }
  };

   const handleAddMembers = async () => {
    const token = getAuthToken();
    if (!token || !selectedGroup || selectedMembers.length === 0) {
      alert("Select a group and members.");
      return;
    }
  
    try {
      await axios.post(
        `http://localhost:8000/api/expensesplit/groups/${selectedGroup.id}/add_members/`,
        { members: selectedMembers },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSelectedMembers([]); 
      fetchGroups();
    } catch (error) {
      console.error("Error adding members:", error);
    }
  };  
  

  const handleAddTransaction = async () => {
    const token = getAuthToken();
    if (!token || !selectedGroup || !transactionData.amount || !transactionData.payer) return;

    try {
      await axios.post(
        `http://localhost:8000/api/expensesplit/groups/${selectedGroup.id}/transactions/`,
        {
          amount: transactionData.amount,
          description: transactionData.description,
          payer: transactionData.payer,
          participants: transactionData.participants.map((p) => p.username),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchTransactions();
      setTransactionData({ amount: "", description: "", payer: "", participants: [] });
    } catch (error) {
      console.error("Error adding transaction:", error);
    }
  };


  const handleMarkCompleted = async () => {
    const token = getAuthToken();
    if (!token || !selectedGroup) {
      alert("Please select a group.");
      return;
    }
  
    try {
      await axios.post(
        `http://localhost:8000/api/expensesplit/groups/${selectedGroup.id}/complete/`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Marked as completed!");
    } catch (error) {
      console.error("Error marking completed:", error);
    }
  };
  

  return (
    <div className="expense-split-container">
      <h2>Expense Split</h2>

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
  {groups.length === 0 ? (
    <p>No groups available. Create one!</p>
  ) : (
    groups.map((group) => (
      <li key={group.id} onClick={() => setSelectedGroup(group)}>
        {group.name}
      </li>
    ))
  )}
</ul>

      {selectedGroup && (
        <div className="group-details">
          <h2>{selectedGroup.name} - Transactions</h2>
          <ul>
            {selectedMembers.map((member, index) => (
              <li key={index}>{member.username}</li>
            ))}
          </ul>

          <div className="add-members">
        <h3>Add Members</h3>
        <select
      multiple
     value={selectedMembers}
     onChange={(e) => {
    const options = Array.from(e.target.selectedOptions, (option) => option.value);
    setSelectedMembers(options);
  }}
>
  {authorizedUsers
    .filter((user) => !selectedGroup.members.some((member) => member.id === user.id)) // Exclude already added members
    .map((user) => (
      <option key={user.id} value={user.id}>
        {user.username}
      </option>
    ))}
</select>


        <button onClick={handleAddMembers}>Add Members</button>
          </div>
          <h2>Transactions</h2>
          <ul>
            {transactions.map((tx, index) => (
              <li key={index}>
                {tx.description} - ₹{tx.amount} (Paid by {tx.payer})
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
            
            <select
              value={transactionData.payer}
              onChange={(e) => setTransactionData({ ...transactionData, payer: e.target.value })}
            >
              <option value="">Select Payer</option>
              {selectedMembers.map((member) => (
                <option key={member.username} value={member.username}>
                  {member.username}
                </option>
              ))}
            </select>
            <button onClick={handleAddTransaction}>Add Transaction</button>
          </div>

          <button onClick={handleMarkCompleted}>Mark as Completed</button>
        </div>
      )}
    </div>
  );
};

export default ExpenseSplit;
