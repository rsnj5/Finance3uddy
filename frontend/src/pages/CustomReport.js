import React, { useState, useContext } from "react";
import "../styles/CustomReports.css"; 
import { TransactionContext } from "../contexts/TransactionContext";

const CustomReports = () => {
  const { transactions } = useContext(TransactionContext);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reportType, setReportType] = useState("summary");
  const [filterType, setFilterType] = useState("all");
  const [filterCategory, setFilterCategory] = useState("");
  const [generatedReport, setGeneratedReport] = useState(null);

  const incomeCategories = [
    "Salary", "Business Profit", "Freelancing", "Investments", "Rental Income", "Interest Earned", "Bonuses & Commissions", "Gifts & Inheritance", "Government Benefits", "Side Hustles"
  ];

  const expenseCategories = [
    "Food & Groceries", "Rent & Housing", "Utilities", "Transportation", "Health & Medical", "Entertainment & Leisure", "Shopping & Clothing", "Debt Repayments & Loans", "Education & Learning", "Travel & Vacation", "Insurance", "Subscriptions & Memberships", "Gifts & Donations", "Miscellaneous"
  ];

  const handleGenerateReport = () => {
    const filteredTransactions = transactions.filter(transaction => {
      const transactionDate = new Date(transaction.date);
      const isWithinDateRange = (
        (!startDate || transactionDate >= new Date(startDate)) &&
        (!endDate || transactionDate <= new Date(endDate))
      );
      return (
        isWithinDateRange &&
        (filterType === "all" || transaction.type === filterType) &&
        (filterCategory === "" || transaction.category === filterCategory)
      );
    });

    let reportData;
    if (reportType === "summary") {
      const totalIncome = filteredTransactions
        .filter(t => t.type === "income")
        .reduce((sum, t) => sum + t.amount, 0);

      const totalExpense = filteredTransactions
        .filter(t => t.type === "expense")
        .reduce((sum, t) => sum + t.amount, 0);

      reportData = {
        totalIncome,
        totalExpense,
        netSavings: totalIncome - totalExpense,
        transactions: filteredTransactions,
      };
    } else if (reportType === "detailed") {
      reportData = filteredTransactions;
    }

    setGeneratedReport(reportData);
  };

  const exportToCSV = () => {
    if (!generatedReport) return;

    const csvRows = [];
    const headers = ["Date", "Type", "Category", "Amount", "Description"];
    csvRows.push(headers.join(","));

    generatedReport.transactions.forEach(transaction => {
      const row = [
        new Date(transaction.date).toLocaleDateString(),
        transaction.type,
        transaction.category,
        transaction.amount,
        "${transaction.desc}",
      ];
      csvRows.push(row.join(","));
    });

    const csvString = csvRows.join("\n");
    const blob = new Blob([csvString], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "custom_report.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

 const backgroundImage = {
    backgroundImage: `url(${process.env.PUBLIC_URL}/transco.jpg)`,
    backgroundSize: "cover",
    backgroundPosition: "center",
  }; 
  const bgImage = {
    backgroundImage: `url(${process.env.PUBLIC_URL}/trans1.png)`,
    backgroundSize: "cover",
    backgroundPosition: "center",
  };
  return (
    <div className="custom-reports-container" style={backgroundImage}>
      <div className="animated-background" style={bgImage}></div>

      <h2 className="page-title">Custom Reports</h2>

      <div className="controls">
        <div className="date-range">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="date-input"
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="date-input"
          />
        </div>

        <select
          value={reportType}
          onChange={(e) => setReportType(e.target.value)}
          className="select-input"
        >
          <option value="summary">Summary Report</option>
          <option value="detailed">Detailed Report</option>
        </select>

        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="select-input"
        >
          <option value="all">All</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>

        {filterType !== "all" && (
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="select-input"
          >
            <option value="">Select Category</option>
            {(filterType === "income" ? incomeCategories : expenseCategories).map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        )}

        <button className="generate-button" onClick={handleGenerateReport}>
          Generate Report
        </button>
      </div>

      {generatedReport && (
        <div className="report-results animated-fade-in">
          <h3 className="report-title">Report Results</h3>
          {reportType === "summary" ? (
            <div className="summary-report">
              <p>Total Income: ₹{generatedReport.totalIncome}</p>
              <p>Total Expense: ₹{generatedReport.totalExpense}</p>
              <p>Net Savings: ₹{generatedReport.netSavings}</p>
            </div>
          ) : (
            <div className="detailed-report">
             {(reportType === "detailed" ? generatedReport : generatedReport.transactions)?.map(transaction => (

                <div key={transaction.id} className="transaction-card animated-slide-in">
                  <h3>{transaction.category} - ₹{transaction.amount}</h3>
                  <p>{transaction.desc}</p>
                  <span className="tag ${transaction.type}">{transaction.type.toUpperCase()}</span>
                </div>
              ))}
            </div>
          )}

          <button className="export-button" onClick={exportToCSV}>
            Export to CSV
          </button>
        </div>
      )}
    </div>
  );
};

export default CustomReports;