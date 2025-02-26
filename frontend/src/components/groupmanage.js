import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Groups = () => {
    const [groups, setGroups] = useState([]);
    const [groupData, setGroupData] = useState({ title: "", members: "" });
    const [showEdit, setShowEdit] = useState(false);
    const [editingGroup, setEditingGroup] = useState(null);

    const navigate = useNavigate();
    const getAuthToken = () => localStorage.getItem("access");

    useEffect(() => {
        fetchGroups();
    }, []);

    const fetchGroups = async () => {
        const token = getAuthToken();
        if (!token) return;

        try {
            const response = await axios.get("http://localhost:8000/api/expensesplit/", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setGroups(response.data);
        } catch (error) {
            console.error("Error fetching groups:", error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "members") {
            setGroupData((prev) => ({ ...prev, members: value.split(",") })); 
        } else {
            setGroupData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleAddGroup = async () => {
        const token = getAuthToken();
        if (!token) {
            alert("User not authenticated. Redirecting to login...");
            navigate("/login");
            return;
        }

        if (!groupData.title || groupData.members.length === 0) {
            alert("Please fill in all fields");
            return;
        }

        try {
            await axios.post("http://localhost:8000/api/expensesplit/", groupData, {
                headers: { Authorization: `Bearer ${token}` },
            });
            fetchGroups();
            setGroupData({ title: "", members: "" });
        } catch (error) {
            console.error("Add group failed:", error.response?.data || error);
        }
    };

    const handleUpdate = async () => {
        const token = getAuthToken();
        if (!token || !editingGroup) return;

        try {
            await axios.put(`http://localhost:8000/api/expensesplit/${editingGroup.id}/`, editingGroup, {
                headers: { Authorization: `Bearer ${token}` },
            });
            fetchGroups();
            setShowEdit(false);
            setEditingGroup(null);
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

        if (window.confirm("Are you sure you want to delete this group?")) {
            try {
                await axios.delete(`http://localhost:8000/api/expensesplit/${id}/`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                fetchGroups();
            } catch (error) {
                console.error("Delete failed:", error);
            }
        }
    };

    return (
        <div className="group-container">
            <h2>Groups</h2>

            <div className="add-group">
                <h3>Add Group</h3>
                <input
                    type="text"
                    name="title"
                    placeholder="Title"
                    value={groupData.title}
                    onChange={handleChange}
                />
                <input
                    type="text"
                    name="members"
                    placeholder="Members (comma-separated emails)"
                    value={groupData.members}
                    onChange={handleChange}
                />
                <button onClick={handleAddGroup}>Add Group</button>
            </div>

            {groups.map((group) => (
                <div key={group.id} className="group-card">
                    <h3>{group.title}</h3>
                    <p>Members: {group.members.join(", ")}</p>

                    <button onClick={() => { setShowEdit(true); setEditingGroup({ ...group }); }}>
                        Edit
                    </button>
                    <button onClick={() => handleDelete(group.id)}>Delete</button>
                </div>
            ))}

            {showEdit && editingGroup && (
                <div className="modal">
                    <h3>Edit Group</h3>

                    <input
                        type="text"
                        name="title"
                        value={editingGroup.title}
                        onChange={(e) => setEditingGroup({ ...editingGroup, title: e.target.value })}
                    />
                    <input
                        type="text"
                        name="members"
                        value={editingGroup.members.join(", ")}
                        onChange={(e) => setEditingGroup({ ...editingGroup, members: e.target.value.split(",") })}
                    />

                    <button onClick={handleUpdate}>Save</button>
                    <button onClick={() => setShowEdit(false)}>Cancel</button>
                </div>
            )}
        </div>
    );
};

export default Groups;
