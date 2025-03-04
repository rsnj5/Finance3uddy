import React, { useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { TransactionContext } from "../contexts/TransactionContext";
import "../styles/dashboard.css";

const Dashboard = () => {
  const navigate = useNavigate();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const { transactions } = useContext(TransactionContext);

  const [recentTransactions, setRecentTransactions] = useState([]);

  useEffect(() => {
    if (transactions.length > 0) {
      const sortedTransactions = [...transactions].sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      );
      setRecentTransactions(sortedTransactions.slice(0, 4));
    }
  }, [transactions]);

  if (!isAuthenticated) {
    navigate("/login");
    return null;
  }

  const backgroundImage = {
    backgroundImage: `url(${process.env.PUBLIC_URL}/dash.jpg)`,
    backgroundSize: "cover",
    backgroundPosition: "center",
  };

  return (
    <div className="dashboard">

      <div className="hero" style={backgroundImage}>
        <h1>Finance3uddy</h1>
        <h2>Welcome now to your ultimate financial companion</h2>
        <p>
          Finance3uddy is a comprehensive financial management platform designed
          to empower you with a suite of tools to manage your transactions,
          set and achieve financial goals, split expenses with friends, gain
          insights through interactive charts, plan budgets, generate custom
          reports, and keep track of your dues. Enjoy a professional, intuitive,
          and efficient experience as you take control of your financial future.
        </p>
      </div>

      <div className="dashboard-content">
        <h2 className="dashboard-title">Finance Management Dashboard</h2>

        <div className="cards-container">
          <div className="cards-row">
            <div
              className="card animated-card"
              onClick={() => navigate("/transactions")}
            >
              <h2>Transactions</h2>
              <p>
                Monitor and manage all your financial transactions with ease.
              </p>
              <button
                onClick={() => navigate("/transactions")}
                className="card-button"
              >
                Go to Transactions
              </button>
            </div>
             
            <div
              className="card animated-card"
              onClick={() => navigate("/goals")}
            >
              <h2>Financial Goals</h2>
              <p>
                Set your savings and investment targets and track progress
                seamlessly.
              </p>
              <button
                onClick={() => navigate("/goals")}
                className="card-button"
              >
                Manage Goals
              </button>
            </div>

            <div
              className="card animated-card"
              onClick={() => navigate("/expensesplit")}
            >
              <h2>Expense Split</h2>
              <p>
                Effortlessly split bills and shared expenses with your peers.
              </p>
              <button
                onClick={() => navigate("/expensesplit")}
                className="card-button"
              >
                Go to Expense Split
              </button>
            </div>
          </div>

          <div className="cards-row">
            <div
              className="card animated-card"
              onClick={() => navigate("/charts")}
            >
              <h2>Insights & Charts</h2>
              <p>
                Visualize your spending habits and financial trends with
                interactive charts.
              </p>
              <button
                onClick={() => navigate("/charts")}
                className="card-button"
              >
                Go to Charts
              </button>
            </div>

            <div
              className="card animated-card"
              onClick={() => navigate("/budgeting")}
            >
              <h2>Budget Planning</h2>
              <p>
                Create and manage your monthly budgets to optimize your spending.
              </p>
              <button
                onClick={() => navigate("/budgeting")}
                className="card-button"
              >
                Manage Budget
              </button>
            </div>

            <div
              className="card animated-card"
              onClick={() => navigate("/customreport")}
            >
              <h2>Custom Reports</h2>
              <p>
                Generate detailed reports to get a clear picture of your financial
                health.
              </p>
              <button
                onClick={() => navigate("/customreport")}
                className="card-button"
              >
                Generate Report
              </button>
            </div>
          </div>

          <div className="cards-row">
            <div
              className="card animated-card"
              onClick={() => navigate("/viewtransaction")}
            >
              <h2>View Transactions</h2>
              <p>
                Access a comprehensive history of all your transactions at a
                glance.
              </p>
              <button
                onClick={() => navigate("/viewtransaction")}
                className="card-button"
              >
                View Transactions
              </button>
            </div>

            <div
              className="card animated-card"
              onClick={() => navigate("/dues")}
            >
              <h2>Dues</h2>
              <p>
                Keep track of all your outstanding dues and payments seamlessly.
              </p>
              <button
                onClick={() => navigate("/dues")}
                className="card-button"
              >
                Go to Dues
              </button>
            </div>

            <div
              className="card animated-card"
              onClick={() => navigate("/loans")}
            >
              <h2>Loans</h2>
              <p>
                Monitor and manage all your financial Loans with ease.
              </p>
              <button
                onClick={() => navigate("/loans")}
                className="card-button"
              >
                Go to Loans
              </button>
            </div>
          </div>
        </div>
         
          
        <div className="transactions-container">
          <h2>Recent Transactions</h2>
          <table>
            <thead>
              <tr>
                <th>Type</th>
                <th>Date</th>
                <th>Category</th>
                <th>Amount</th>
              </tr>
            </thead>

            <tbody>
              {recentTransactions.map((tx) => (
                <tr key={tx.id}>
                  <td>{tx.type}</td>
                  <td>{tx.date}</td>
                  <td>{tx.category}</td>
                  <td>{tx.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;