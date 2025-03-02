import React, { useContext } from "react";
import { TransactionContext } from "../contexts/TransactionContext";
import { PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from "recharts";
import "../styles/Budgeting.css"; // Import the CSS file

const Budgeting = () => {
  const { transactions } = useContext(TransactionContext);

  // Debugging: Log transactions to inspect the data
  console.log("Transactions:", transactions);

  // Calculate total income and expenses
  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => {
      const amount = parseFloat(t.amount);
      return sum + (isNaN(amount) ? 0 : amount); // Handle invalid amounts
    }, 0);

  const totalExpenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => {
      const amount = parseFloat(t.amount);
      return sum + (isNaN(amount) ? 0 : amount); // Handle invalid amounts
    }, 0);

  const netSavings = totalIncome - totalExpenses;

  // Debugging: Log calculated values
  console.log("Total Income:", totalIncome);
  console.log("Total Expenses:", totalExpenses);
  console.log("Net Savings:", netSavings);

  // Calculate spending by category
  const spendingByCategory = transactions
    .filter((t) => t.type === "expense")
    .reduce((acc, t) => {
      const amount = parseFloat(t.amount);
      if (!isNaN(amount)) {
        acc[t.category] = (acc[t.category] || 0) + amount;
      }
      return acc;
    }, {});

  // Convert spending data to array for visualization
  const spendingData = Object.keys(spendingByCategory).map((category) => ({
    name: category,
    value: spendingByCategory[category],
  }));

  // Generate budgeting suggestions based on spending patterns
  const generateSuggestions = () => {
    const suggestions = [];
    const categories = Object.keys(spendingByCategory);
    const averageSpending = totalExpenses / (categories.length || 1);

    categories.forEach((category) => {
      if (spendingByCategory[category] > averageSpending) {
        suggestions.push(
          `You're spending more than average on ${category}. Consider cutting back.`
        );
      }
    });

    if (netSavings < 0) {
      suggestions.push("You're spending more than you earn. Try to reduce non-essential expenses.");
    } else if (netSavings < totalIncome * 0.2) {
      suggestions.push(
        `You're saving ₹${netSavings.toFixed(2)}, but consider saving at least 20% of your income.`
      );
    } else {
      suggestions.push(`You're saving ₹${netSavings.toFixed(2)} this month. Keep it up!`);
    }

    return suggestions;
  };

  const suggestions = generateSuggestions();

  // New colors for pie chart
  const COLORS = ["#FF6B6B", "#4ECDC4", "#FFE66D", "#6B5B95", "#FFA07A", "#45B7D3", "#D4A5A5", "#88D8B0"];

  return (
    <div className="budgeting-container">
      <h2>Smart Budgeting</h2>

      {/* Budget Overview */}
      <div className="budget-overview">
        <h3>Budget Overview</h3>
        <div className="stats">
          <p>Total Income: ₹{totalIncome.toFixed(2)}</p>
          <p>Total Expenses: ₹{totalExpenses.toFixed(2)}</p>
          <p>Net Savings: ₹{netSavings.toFixed(2)}</p>
        </div>
      </div>

      {/* Spending by Category - Pie Chart */}
      <div className="spending-chart">
        <h3>Spending by Category</h3>
        <PieChart width={500} height={400}>
          <Pie
            data={spendingData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={200}
            fill="#8884d8"
          >
            {spendingData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </div>

      {/* Monthly Spending Trends - Bar Chart */}
      <div className="monthly-trends">
        <h3>Monthly Spending Trends</h3>
        <BarChart
          width={1200}
          height={500}
          data={spendingData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="value" fill="#4ECDC4" />
        </BarChart>
      </div>

      {/* Budgeting Suggestions */}
      <div className="suggestions">
        <h3>Budgeting Suggestions</h3>
        {suggestions.length > 0 ? (
          suggestions.map((suggestion, index) => (
            <p key={index}>• {suggestion}</p>
          ))
        ) : (
          <p>No suggestions available.</p>
        )}
      </div>
    </div>
  );
};

export default Budgeting;