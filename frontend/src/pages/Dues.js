import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/dues.css"; 

const Dues = ({ user }) => {
  const [dues, setDues] = useState([]);
  const [dueData, setDueData] = useState({
    title: "",
    due_date: "",
    amount: "",
    to_whom: "",
    recurring: "daily",
    next_reminder_date: "",
  });
  const [showEdit, setShowEdit] = useState(false);
  const [editingDue, setEditingDue] = useState(null);

  const navigate = useNavigate();
  const getAuthToken = () => localStorage.getItem("access");

  useEffect(() => {
    const fetchDues = async () => {
      const token = getAuthToken();
      if (!token) return;

      try {
        const response = await axios.get("http://localhost:8000/api/dues/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDues(response.data);
      } catch (error) {
        console.error("Error fetching dues:", error);
      }
    };

    fetchDues();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDueData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddDue = async () => {
    const token = getAuthToken();
    if (!token) {
      alert("User not authenticated. Redirecting to login...");
      navigate("/login");
      return;
    }

    if (!dueData.title || !dueData.due_date || !dueData.amount || !dueData.to_whom) {
      alert("Please fill in all fields");
      return;
    }

    try {
      await axios.post("http://localhost:8000/api/dues/", dueData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      refreshDues();
      setDueData({
        title: "",
        due_date: "",
        amount: "",
        to_whom: "",
        recurring: "daily",
        next_reminder_date: "",
      });
    } catch (error) {
      console.error("Add Due failed:", error.response?.data || error);
    }
  };

  const handleUpdate = async () => {
    const token = getAuthToken();
    if (!token || !editingDue) return;

    try {
      await axios.put(`http://localhost:8000/api/dues/${editingDue.id}/`, editingDue, {
        headers: { Authorization: `Bearer ${token}` },
      });
      refreshDues();
      setShowEdit(false);
      setEditingDue(null);
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  const handleDelete = async (id) => {
    const token = getAuthToken();
    if (!token) return;

    try {
      await axios.delete(`http://localhost:8000/api/dues/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      refreshDues();
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  const refreshDues = async () => {
    const token = getAuthToken();
    if (!token) return;

    try {
      const response = await axios.get("http://localhost:8000/api/dues/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDues(response.data);
    } catch (error) {
      console.error("Error refreshing dues:", error);
    }
  };
  const backgroundImage = {
    backgroundImage: `url(${process.env.PUBLIC_URL}/trans1.png)`,
    backgroundSize: "cover",
    backgroundPosition: "center",
  };

  return (
    <div className="dues-container">
    <div className="animated-background" style={backgroundImage}></div>

      <h2>Dues Management</h2>

      <div className="add-due">
        <h3>Add Due</h3>
        <input type="text" name="title" placeholder="Title" value={dueData.title} onChange={handleChange} />
        <input type="date" name="due_date" value={dueData.due_date} onChange={handleChange} />
        <input type="number" name="amount" placeholder="Amount" value={dueData.amount} onChange={handleChange} />
        <input type="text" name="to_whom" placeholder="To Whom" value={dueData.to_whom} onChange={handleChange} />
        <select name="recurring" value={dueData.recurring} onChange={handleChange}>
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </select>
        <button onClick={handleAddDue}>Add Due</button>
      </div>

      <div className="dues-list">
        {dues.map((due) => (
          <div key={due.id} className="due-card">
            <h3>{due.title} - {due.amount}</h3>
            <p>Due Date: {due.due_date}</p>
            <p>Next Reminder: {due.next_reminder_date}</p>
            <p>To Whom: {due.to_whom}</p>
            <p>Recurring: {due.recurring}</p>
            <button onClick={() => { setShowEdit(true); setEditingDue({ ...due }); }}>Edit</button>
            <button onClick={() => handleDelete(due.id)}>Delete</button>
          </div>
        ))}
      </div>

      {showEdit && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Edit Due</h3>
            <input type="text" name="title" value={editingDue?.title} onChange={(e) => setEditingDue({ ...editingDue, title: e.target.value })} />
            <input type="date" name="due_date" value={editingDue?.due_date} onChange={(e) => setEditingDue({ ...editingDue, due_date: e.target.value })} />
            <input type="number" name="amount" value={editingDue?.amount} onChange={(e) => setEditingDue({ ...editingDue, amount: e.target.value })} />
            <input type="text" name="to_whom" value={editingDue?.to_whom} onChange={(e) => setEditingDue({ ...editingDue, to_whom: e.target.value })} />
            <select name="recurring" value={editingDue?.recurring} onChange={(e) => setEditingDue({ ...editingDue, recurring: e.target.value })}>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
            <button onClick={handleUpdate}>Save</button>
            <button onClick={() => setShowEdit(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dues;