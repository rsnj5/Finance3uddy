import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import '../styles/goal.css';

const GoalTracking = () => {
  const [goals, setGoals] = useState([]);
  const [goalData, setGoalData] = useState({ title: "", current_amount: "", target_amount: "", target_date: "" });
  const [showEdit, setShowEdit] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);

  const navigate = useNavigate();
  const getAuthToken = () => localStorage.getItem("access");

  useEffect(() => {
    const fetchGoals = async () => {
      const token = getAuthToken();
      if (!token) return;

      try {
        const response = await axios.get("http://localhost:8000/api/goals/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setGoals(response.data);
      } catch (error) {
        console.error("Error fetching goals:", error);
      }
    };

    fetchGoals();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setGoalData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddGoal = async () => {
    const token = getAuthToken();
    if (!token) {
      alert("User not authenticated. Redirecting to login...");
      navigate("/login");
      return;
    }

    if (!goalData.title || !goalData.target_amount || !goalData.target_date || !goalData.current_amount) {
      alert("Please fill in all fields");
      return;
    }

    try {
      await axios.post("http://localhost:8000/api/goals/", goalData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      refreshGoals();
      setGoalData({ title: "", current_amount: "", target_amount: "", target_date: "" });
    } catch (error) {
      console.error("Add Goal failed:", error.response?.data || error);
    }
  };

  const handleUpdate = async () => {
    const token = getAuthToken();
    if (!token) {
      alert("User not authenticated. Redirecting to login...");
      navigate("/login");
      return;
    }
    
    if (!editingGoal) return;
    
    try {
      await axios.put(`http://localhost:8000/api/goals/${editingGoal.id}/`, editingGoal, {
        headers: { Authorization: `Bearer ${token}` },
      });
      refreshGoals();

      setShowEdit(false);
      setEditingGoal(null);
     
    } catch (error) {
      console.error("Update failed:", error);
    }
  };
  
  const handleDelete = async (id) => {
    const token = getAuthToken();
    if (!token) {
      alert("User not authenticated. Redirecting to login...");
      navigate("/login");
      return;
    }

    try {
      await axios.delete(`http://localhost:8000/api/goals/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      refreshGoals();
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  const refreshGoals = async () => {
    const token = getAuthToken();
    if (!token) return;

    try {
      const response = await axios.get("http://localhost:8000/api/goals/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setGoals(response.data);
    } catch (error) {
      console.error("Error refreshing goals:", error);
    }
  };
  const backgroundImage = {
    backgroundImage: `url(${process.env.PUBLIC_URL}/cn1.png)`,
    backgroundSize: "cover",
    backgroundPosition: "center",
  };

  return (
    <div className="goal-tracking-container">
      <div className="animated-background" style={backgroundImage}></div>

      <h2>Goal Tracking</h2>

      <div className="add-goal">
        <h3>Add Goal</h3>
        <input type="text" name="title" placeholder="Title" value={goalData.title} onChange={handleChange} />
        <input type="number" name="current_amount" placeholder="Current Amount" value={goalData.current_amount} onChange={handleChange} />
        <input type="number" name="target_amount" placeholder="Target Amount" value={goalData.target_amount} onChange={handleChange} />
        <input type="date" name="target_date" value={goalData.target_date} onChange={handleChange} />
        <button onClick={handleAddGoal}>Add Goal</button>
      </div>

      <div className="goals-list">
        {goals.map((goal) => (
          <div key={goal.id} className="goal-card">
            <h3>{goal.title} - ₹{goal.current_amount} / ₹{goal.target_amount}</h3>
            <p>Target Date: {goal.target_date}</p>
            <p>Status: {goal.current_amount>=goal.target_amount ? "Completed" : "In Progress"}</p>
            <div className="progress-bar">
              <div 
                className="progress" 
                style={{ width: `${(goal.current_amount / goal.target_amount) * 100}%` }}
              ></div>
            </div>

            <button onClick={() => { setShowEdit(true); setEditingGoal({ ...goal }); }}>Edit</button>
            <button
            className="delete-button" 
             onClick={() => {
              const confirmDelete = window.confirm(`Are you sure you want to delete the goal: "${goal.title}"?`);
              if (confirmDelete) {
                handleDelete(goal.id);
              }
            }}>Delete</button>
            
          </div>
        ))}
      </div>

      {showEdit && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Edit Goal</h3>
            <input type="text" name="title" value={editingGoal?.title} onChange={(e) => setEditingGoal({ ...editingGoal, title: e.target.value })} />
            <input type="number" name="current_amount" value={editingGoal?.current_amount} onChange={(e) => setEditingGoal({ ...editingGoal, current_amount: e.target.value })} />
            <input type="number" name="target_amount" value={editingGoal?.target_amount} onChange={(e) => setEditingGoal({ ...editingGoal, target_amount: e.target.value })} />
            <input type="date" name="target_date" value={editingGoal?.target_date} onChange={(e) => setEditingGoal({ ...editingGoal, target_date: e.target.value })} />
            <button onClick={handleUpdate}>Save</button>
            <button onClick={() => setShowEdit(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GoalTracking;