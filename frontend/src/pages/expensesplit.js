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
      const updatedGroupResponse = await axios.get(
        `http://localhost:8000/api/expensesplit/groups/${selectedGroup.id}/`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      setSelectedGroup(updatedGroupResponse.data);
  
      setSelectedMembers([]);
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
          participants: transactionData.participants,
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
      fetchGroups();
    } catch (error) {
      console.error("Error marking completed:", error);
    }
  };

  return (
    <div className="expense-split-container">
      <div className="animated-background"></div>

     

      <div className="dashboard-content">
        <h1>Expense Split</h1>

        <div className="create-group-section">
          <h2>Create a New Group</h2>
          <input
            type="text"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            placeholder="Enter group name"
          />
          <select
            multiple
            value={selectedMembers}
            onChange={(e) => {
              const options = Array.from(e.target.selectedOptions, (option) => option.value);
              setSelectedMembers(options);
            }}
          >
            {authorizedUsers.map((user) => (
              <option key={user.id} value={user.id}>
                {user.username}
              </option>
            ))}
          </select>
          <button onClick={handleCreateGroup}>Create Group</button>
        </div>

        <div className="group-list-section">
          <h2>Your Groups</h2>
          {groups.length === 0 ? (
            <p>No groups available. Create one!</p>
          ) : (
            <ul>
              {groups.map((group) => (
                <li key={group.id} onClick={() => setSelectedGroup(group)}>
                  {group.name} {group.completed ? "(Completed)" : "not"}
                </li>
              ))}
            </ul>
          )}
        </div>

        {selectedGroup && (
          <div className="group-details-section">
            <h2>{selectedGroup.name} - Transactions</h2>

            <div className="add-members-section">
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
                  .filter((user) => !selectedGroup.members.some((member) => member.id === user.id))
                  .map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.username}
                    </option>
                  ))}
              </select>
              <button onClick={handleAddMembers}>Add Members</button>

            </div>
            <div className="show-members-section">
            {selectedMembers.map((member, index) => (
          <div key={index}>{member}</div>
           ))}
         </div>

            <div className="transactions-section">
              <h3>Transactions</h3>
              <ul>
                {transactions.map((tx, index) => (
                  <li key={index}>
                    {tx.description} - ₹{tx.amount} (Paid by {tx.payer})
                  </li>
                ))}
              </ul>
            </div>

            <div className="add-transaction-section">
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
              <select
                value={transactionData.payer}
                onChange={(e) => setTransactionData({ ...transactionData, payer: e.target.value })}
              >
                <option value="">Select Payer</option>
                {selectedGroup.members.map((member) => (
                  <option key={member.id} value={member.id}>
                    {member.username}
                  </option>
                ))}
              </select>
              <select
                multiple
                value={transactionData.participants}
                onChange={(e) => {
                  const options = Array.from(e.target.selectedOptions, (option) => option.value);
                  setTransactionData({ ...transactionData, participants: options });
                }}
              >
                {selectedGroup.members.map((member) => (
                  <option key={member.id} value={member.id}>
                    {member.username}
                  </option>
                ))}
              </select>
              <button onClick={handleAddTransaction}>Add Transaction</button>
            </div>

            <div className="mark-completed-section">
              <button onClick={handleMarkCompleted}>Mark as Completed</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExpenseSplit;
