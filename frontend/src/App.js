import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import LandingPage from "./pages/home";
import Login from "./pages/login";
import Signup from "./pages/signup";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transaction";
import GoalTracking from "./pages/goalsetting";
import ExpenseSplit from "./pages/expensesplit";


const ProtectedRoute = ({ element }) => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  return isAuthenticated ? element : <Navigate to="/login" />;
};

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/dashboard" element={<ProtectedRoute element={<Dashboard />} />} />
      <Route path="/transactions" element={<ProtectedRoute element={<Transactions />} />} />
      <Route path="/goals" element={<ProtectedRoute element={<GoalTracking />} />} />
      <Route path="/expensesplit" element={<ProtectedRoute element={<ExpenseSplit />} />} />

    </Routes>
  );
};

export default App;

