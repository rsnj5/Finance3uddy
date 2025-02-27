import React, { useState, useContext } from "react";
import "../styles/TransactionManagement.css";
import { TransactionContext } from "../contexts/TransactionContext";

const TransactionManagement = () => {
  const { transactions } = useContext(TransactionContext);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterCategory, setFilterCategory] = useState("");
  const [sortType, setSortType] = useState("date");

  const incomeCategories = [
    "Salary", "Business Profit", "Freelancing", "Investments", "Rental Income", "Interest Earned", "Bonuses & Commissions", "Gifts & Inheritance", "Government Benefits", "Side Hustles"
  ];
  
  const expenseCategories = [
    "Food & Groceries", "Rent & Housing", "Utilities", "Transportation", "Health & Medical", "Entertainment & Leisure", "Shopping & Clothing", "Debt Repayments & Loans", "Education & Learning", "Travel & Vacation", "Insurance", "Subscriptions & Memberships", "Gifts & Donations", "Miscellaneous"
  ];

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleFilterType = (event) => {
    setFilterType(event.target.value);
    setFilterCategory("");
  };

  const handleFilterCategory = (event) => {
    setFilterCategory(event.target.value);
  };

  const handleSort = (event) => {
    setSortType(event.target.value);
  };

  const filteredTransactions = transactions.filter(transaction => {
    return (
      (filterType === "all" || transaction.type === filterType) &&
      (filterCategory === "" || transaction.category === filterCategory) &&
      (transaction.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.desc.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    if (sortType === "amount") {
      return b.amount - a.amount;
    } else if (sortType === "category") {
      return a.category.localeCompare(b.category);
    }
    return new Date(b.date) - new Date(a.date);
  });

  return (
    <div className="transaction-management-container">
      <h2>Transaction Management</h2>
      
      <div className="controls">
        <input 
          type="text" 
          placeholder="Search transactions..." 
          value={searchTerm} 
          onChange={handleSearch} 
        />
        
        <select value={filterType} onChange={handleFilterType}>
          <option value="all">All</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        
        {filterType !== "all" && (
          <select value={filterCategory} onChange={handleFilterCategory}>
            <option value="">Select Category</option>
            {(filterType === "income" ? incomeCategories : expenseCategories).map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        )}
        
        <select value={sortType} onChange={handleSort}>
          <option value="date">Sort by Date</option>
          <option value="amount">Sort by Amount</option>
          <option value="category">Sort by Category</option>
        </select>
      </div>
      
      <div className="transactions-list">
        {sortedTransactions.length > 0 ? (
          sortedTransactions.map(transaction => (
            <div key={transaction.id} className={`transaction-card ${transaction.type}`}>
              <h3>{transaction.category} - ₹{transaction.amount}</h3>
              <p>{transaction.desc}</p>
              <span className={`tag ${transaction.type}`}>{transaction.type.toUpperCase()}</span>
            </div>
          ))
        ) : (
          <p>No transactions found</p>
        )}
      </div>
    </div>
  );
};

export default TransactionManagement;
