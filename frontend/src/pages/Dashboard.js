import { useSelector} from "react-redux";
import { Link } from "react-router-dom";
import "../styles/dashboard.css"; 
import {motion} from "framer-motion";
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  return (
    <div className="dashboard">
      <div className="animated-background"></div>

     
      <div className="dashboard-content">
        <h1 className="dashboard-title">Finance Management Dashboard</h1>

        <div className="cards-container">
          <div className="card animated-card">
            <h2>Total Balance</h2>
            <p>$12,345.67</p>
            <button onClick={() => navigate('/transactions')} className ="card-button">Manage Transactions</button>
          </div>
          <div className="card animated-card">
            <h2>Monthly Income</h2>
            <p>$4,000.00</p>
            <button onClick={() => navigate('/goals')} className="card-button">Manage Goals</button>
          </div>
          <div className="card animated-card">
            <h2>Monthly Expenses</h2>
            <p>$2,500.00</p>
            <button onClick={() => navigate('/viewtransaction')} className="card-button">View Transactions</button>
          </div>
        </div>

        <div className="charts-container">
          <div className="chart-card">
            <h2>Spending Overview</h2>
            <div className="chart-placeholder"></div>
          </div>
          <div className="chart-card">
            <h2>Investment Growth</h2>
            <div className="chart-placeholder"></div>
          </div>
        </div>

        <div className="transactions-container">
          <h2>Recent Transactions</h2>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Description</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>2023-10-01</td>
                <td>Groceries</td>
                <td>$150.00</td>
                <td className="status-completed">Completed</td>
              </tr>
              <tr>
                <td>2023-10-02</td>
                <td>Rent</td>
                <td>$1,200.00</td>
                <td className="status-completed">Completed</td>
              </tr>
              <tr>
                <td>2023-10-03</td>
                <td>Netflix Subscription</td>
                <td>$15.00</td>
                <td className="status-pending">Pending</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="progress-container">
          <h2>Budget Progress</h2>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: '70%' }}></div>
            <span>70%</span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: '40%' }}></div>
            <span>40%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;