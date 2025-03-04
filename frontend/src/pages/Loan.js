import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import '../styles/loan.css';

const LoanPlatform = () => {
  const [loans, setLoans] = useState([]);
  const [applications, setApplications] = useState([]);
  const [filters, setFilters] = useState({
    min_interest_rate: "",
    max_interest_rate: "",
    min_loan_amount: "",
    max_loan_amount: "",
    min_tenure: "",
    max_tenure: "",
    category: "",
  });
  const [amount, setAmount] = useState("");
  const [selectedLoanId, setSelectedLoanId] = useState(null);
  const [showEdit, setShowEdit] = useState(false);
  const [editingApplication, setEditingApplication] = useState(null);

  const navigate = useNavigate();
  const getAuthToken = () => localStorage.getItem("access");

  useEffect(() => {
    const fetchLoans = async () => {
      const token = getAuthToken();
      if (!token) return;

      try {
        const response = await axios.get("http://localhost:8000/api/loans/loans/", {
          headers: { Authorization: `Bearer ${token}` },
          params: filters,
        });
        setLoans(response.data);
      } catch (error) {
        console.error("Error fetching loans:", error);
      }
    };

    fetchLoans();
  }, [filters]);

  useEffect(() => {
    const fetchApplications = async () => {
      const token = getAuthToken();
      if (!token) return;

      try {
        const response = await axios.get("http://localhost:8000/api/loans/applications/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setApplications(response.data);
      } catch (error) {
        console.error("Error fetching applications:", error);
      }
    };

    fetchApplications();
  }, []);

  const handleApply = async (loanId) => {
    const token = getAuthToken();
    if (!token) {
      alert("User not authenticated. Redirecting to login...");
      navigate("/login");
      return;
    }

    if (!loanId || !amount) {
      alert("Please select a loan and enter an amount.");
      return;
    }

    try {
      await axios.post(
        "http://localhost:8000/api/loans/apply/",
        { loan: loanId, amount },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Loan application submitted successfully!");
      setAmount("");
      setSelectedLoanId(null);
      const response = await axios.get("http://localhost:8000/api/loans/applications/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setApplications(response.data);
    } catch (error) {
      console.error("Error submitting application:", error);
    }
  };

  const handleUpdate = async () => {
    const token = getAuthToken();
    if (!token) {
      alert("User not authenticated. Redirecting to login...");
      navigate("/login");
      return;
    }

    if (!editingApplication) return;

    try {
      await axios.put(
        `http://localhost:8000/api/loans/applications/${editingApplication.id}/`,
        editingApplication,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const response = await axios.get("http://localhost:8000/api/loans/applications/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setApplications(response.data);
      setShowEdit(false);
      setEditingApplication(null);
    } catch (error) {
      console.error("Error updating application:", error);
    }
  };

  const handleDelete = async (id) => {
    const token = getAuthToken();
    if (!token) {
      alert("User not authenticated. Redirecting to login...");
      navigate("/login");
      return;
    }

    const confirmDelete = window.confirm("Are you sure you want to delete this application?");
    if (confirmDelete) {
      try {
        await axios.delete(`http://localhost:8000/api/loans/applications/${id}/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const response = await axios.get("http://localhost:8000/api/loans/applications/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setApplications(response.data);
      } catch (error) {
        console.error("Error deleting application:", error);
      }
    }
  };

  const clearFilters = () => {
    setFilters({
      min_interest_rate: "",
      max_interest_rate: "",
      min_loan_amount: "",
      max_loan_amount: "",
      min_tenure: "",
      max_tenure: "", 
      category: "",
    });
  };
  const backgroundImage = {
    backgroundImage: `url(${process.env.PUBLIC_URL}/loans.jpg)`,
    backgroundSize: "cover",
    backgroundPosition: "center",
  };
  
  return (
    <div className="loan-platform-container" >
      <div className="animated-background" style={backgroundImage}></div>

      <h1>Loan Comparison and Application Platform</h1>

      <div className="loan-listing">
        <h2>Available Loans</h2>
        <div className="filters">
          <input
            type="number"
            placeholder="Min Interest Rate"
            value={filters.min_interest_rate}
            onChange={(e) => setFilters({ ...filters, min_interest_rate: e.target.value })}
          />
          <input
            type="number"
            placeholder="Max Interest Rate"
            value={filters.max_interest_rate}
            onChange={(e) => setFilters({ ...filters, max_interest_rate: e.target.value })}
          />
          <input
            type="number"
            placeholder="Min Loan Amount"
            value={filters.min_loan_amount}
            onChange={(e) => setFilters({ ...filters, min_loan_amount: e.target.value })}
          />
          <input
            type="number"
            placeholder="Max Loan Amount"
            value={filters.max_loan_amount}
            onChange={(e) => setFilters({ ...filters, max_loan_amount: e.target.value })}
          />
          <input
            type="number"
            placeholder="Min Tenure (months)"
            value={filters.min_tenure}
            onChange={(e) => setFilters({ ...filters, min_tenure: e.target.value })}
          />
          <input
            type="number"
            placeholder="Max Tenure (months)"
            value={filters.max_tenure}
            onChange={(e) => setFilters({ ...filters, max_tenure: e.target.value })}
          />
          <select
            value={filters.category}
            onChange={(e) => setFilters({ ...filters, category: e.target.value })}
          >
            <option value="">All Categories</option>
            <option value="GOLD">Gold Loan</option>
            <option value="BUSINESS">Business Loan</option>
            <option value="EDUCATION">Education Loan</option>
            <option value="CAR">Car Loan</option>
            <option value="PERSONAL">Personal Loan</option>
            <option value="HOME">Home Loan</option>
          </select>
          <button onClick={clearFilters}>Clear Filters</button>
        </div>

        {loans.map((loan) => (
          <div key={loan.id} className="loan-card">
            <h3>{loan.name}</h3>
            <p>Interest Rate: {loan.interest_rate}%</p>
            <p>Max Loan Amount: ₹{loan.max_loan_amount}</p>
            <p>Tenure: {loan.tenure} months</p>
            <p>Description: {loan.description}</p>
            <button onClick={() => setSelectedLoanId(loan.id)}>Apply for this Loan</button>
            {selectedLoanId === loan.id && (
              <div className="loan-application-form">
                <form onSubmit={(e) => { e.preventDefault(); handleApply(loan.id); }}>
                  <input
                    type="number"
                    placeholder="Loan Amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                  <button type="submit">Submit Application</button>
                </form>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="loan-applications">
        <h2>Your Loan Applications</h2>
        {applications.length > 0 ? (
          applications.map((app) => (
            <div key={app.id} className="application-card">
              <h3>{app.loan.name}</h3>
              <p>Amount: ₹{app.amount}</p>
              <p>Status: {app.status}</p>
              <p>Applied At: {new Date(app.applied_at).toLocaleString()}</p>
              <button onClick={() => { setShowEdit(true); setEditingApplication({ ...app }); }}>Edit</button>
              <button onClick={() => handleDelete(app.id)}>Delete</button>
            </div>
          ))
        ) : (
          <p>No applications found.</p>
        )}
      </div>

      {showEdit && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Edit Application</h3>
            <input
              type="number"
              placeholder="Loan Amount"
              value={editingApplication?.amount}
              onChange={(e) => setEditingApplication({ ...editingApplication, amount: e.target.value })}
            />
            <button onClick={handleUpdate}>Save</button>
            <button onClick={() => setShowEdit(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoanPlatform;