import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { GoogleOAuthProvider } from "@react-oauth/google";
import LandingPage from "./pages/home";
import Login from "./pages/login";
import Signup from "./pages/signup";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transaction";
import GoalTracking from "./pages/goalsetting";
import ExpenseSplit from "./pages/expensesplit";
import { TransactionProvider } from "./contexts/TransactionContext";
import TransactionManagement from "./pages/TransactionManagement";
import Chart from "./pages/Chart";
import Dues from "./pages/Dues";
import Budgeting from "./pages/Budgeting";
import CustomReports from "./pages/CustomReport";

const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;

const ProtectedRoute = ({ element }) => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  return isAuthenticated ? element : <Navigate to="/login" />;
};

const App = () => {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <TransactionProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<ProtectedRoute element={<Dashboard />} />} />
          <Route path="/goals" element={<ProtectedRoute element={<GoalTracking />} />} />
          <Route path="/expensesplit" element={<ProtectedRoute element={<ExpenseSplit />} />} />
          <Route path="/transactions" element={<ProtectedRoute element={<Transactions />} />} />
          <Route path="/viewtransaction" element={<ProtectedRoute element={<TransactionManagement />} />} />
          <Route path="/charts" element={<ProtectedRoute element={<Chart />} />} />
          <Route path="/dues" element={<ProtectedRoute element={<Dues />} />} />
          <Route path="/budgeting" element={<ProtectedRoute element={<Budgeting />} />} />
          <Route path="/customreport" element={<ProtectedRoute element={<CustomReports />} />} />
        </Routes>
      </TransactionProvider>
    </GoogleOAuthProvider>
  );
};

export default App;
