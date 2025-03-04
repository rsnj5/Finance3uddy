import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Select from "react-select";

import "../styles/expensesplit.css";

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
      setExpenses(response.data.debts);
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

      const transactionsWithPayerDetails = await Promise.all(
        response.data.map(async (tx) => {
          const payerDetails = await fetchUserDetails(tx.payer);
          return {
            ...tx,
            payerUsername: payerDetails.username,
          };
        })
      );

      setTransactions(transactionsWithPayerDetails);
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

  const fetchUserDetails = async (userId) => {
    const token = getAuthToken();
    if (!token) return;

    try {
      const response = await axios.get(`http://localhost:8000/api/users/${userId}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching user details:", error);
      return null;
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
          members: selectedMembers,
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
    if (!token || !selectedGroup || !transactionData.amount || !transactionData.payer) {
      alert("Please fill in all required fields.");
      return;
    }

    const payerId = Number(transactionData.payer);

    const isPayerValid = selectedGroup.members.some((member) => member.id === payerId);
    if (!isPayerValid) {
      alert("Invalid payer. Please select a valid payer from the group members.");
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:8000/api/expensesplit/groups/${selectedGroup.id}/transactions/`,
        {
          amount: parseFloat(transactionData.amount),
          description: transactionData.description,
          payer: payerId,
          participants: transactionData.participants,
          group: selectedGroup.id,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("Transaction added successfully:", response.data);

      fetchTransactions();
      setTransactionData({ amount: "", description: "", payer: "", participants: [] });
    } catch (error) {
      console.error("Error adding transaction:", error.response?.data || error);
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

  const userOptions = authorizedUsers.map((user) => ({
    value: user.id,
    label: user.username,
  }));
  const backgroundImage = {
    backgroundImage: `url(${process.env.PUBLIC_URL}/trans1.png)`,
    backgroundSize: "cover",
    backgroundPosition: "center",
  };
  
  <div className="animated-background" style={backgroundImage}></div>
  
  return (
    <div className="expense-split-container">
    <div className="animated-background" style={backgroundImage}></div>

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
          <Select
            isMulti
            options={userOptions}
            value={selectedMembers.map((id) => userOptions.find((option) => option.value === id))}
            onChange={(selected) => setSelectedMembers(selected.map((option) => option.value))}
            placeholder="Select members"
          />
          <button onClick={handleCreateGroup}>Create Group</button>
        </div>

        <div className="group-list-section">
          <h2>Your Groups</h2>
          {groups.length === 0 ? (
            <p>No groups available. Create one!</p>
          ) : (
            <ul>
              {groups.map((group) => (
                <li
                  key={group.id}
                  onClick={async () => {
                    const membersWithDetails = await Promise.all(
                      group.members.map(async (memberId) => {
                        const userDetails = await fetchUserDetails(memberId);
                        return userDetails;
                      })
                    );

                    setSelectedGroup({
                      ...group,
                      members: membersWithDetails,
                    });
                  }}
                >
                  {group.name} {group.completed ? "(Completed)" : ""}
                </li>
              ))}
            </ul>
          )}
        </div>

        {selectedGroup && (
          <div className="group-details-section">
            <h2>{selectedGroup.name}</h2>

            <div className="group-members-section">
              <h3>Members</h3>
              <ul>
                {selectedGroup.members.map((member) => (
                  <li key={member.id}>{member.username}</li>
                ))}
              </ul>
            </div>

            <div className="add-members-section">
              <h3>Add Members</h3>
              <Select
                isMulti
                options={userOptions.filter(
                  (user) => !selectedGroup.members.some((member) => member.id === user.value)
                )}
                value={selectedMembers.map((id) => userOptions.find((option) => option.value === id))}
                onChange={(selected) => setSelectedMembers(selected.map((option) => option.value))}
                placeholder="Select members"
              />
              <button onClick={handleAddMembers}>Add Members</button>
            </div>

            <div className="transactions-section">
              <h3>Transactions</h3>
              <ul>
                {transactions.map((tx, index) => (
                  <li key={index}>
                    ₹{tx.amount} (Paid by {tx.payerUsername})
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
              <Select
                options={selectedGroup.members.map((member) => ({
                  value: member.id,
                  label: member.username,
                }))}
                value={
                  transactionData.payer
                    ? {
                        value: transactionData.payer,
                        label: selectedGroup.members.find((member) => member.id === transactionData.payer)
                          ?.username,
                      }
                    : null
                }
                onChange={(selected) =>
                  setTransactionData({ ...transactionData, payer: selected ? selected.value : "" })
                }
                placeholder="Select Payer"
              />
              <Select
                isMulti
                options={selectedGroup.members.map((member) => ({
                  value: member.id,
                  label: member.username,
                }))}
                value={transactionData.participants.map((id) => ({
                  value: id,
                  label: selectedGroup.members.find((member) => member.id === id)?.username,
                }))}
                onChange={(selected) =>
                  setTransactionData({
                    ...transactionData,
                    participants: selected.map((option) => option.value),
                  })
                }
                placeholder="Select Participants"
              />
              <button onClick={handleAddTransaction}>Add Transaction</button>
            </div>

            <div className="debts-section">
              <h3>Debts</h3>
              <table>
                <thead>
                  <tr>
                    <th>Debtor</th>
                    <th>Creditor</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {expenses.map((debt, index) => (
                    <tr key={index}>
                      <td>{debt.debtor}</td>
                      <td>{debt.creditor}</td>
                      <td>₹{debt.amount.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
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