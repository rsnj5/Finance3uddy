import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Transaction.css";
import { TransactionContext } from "../contexts/TransactionContext";
import Papa from "papaparse";

const Transactions = () => {
  const { transactions, fetchTransactions, addTransaction, updateTransaction, deleteTransaction } = useContext(TransactionContext);
  const [incomeData, setIncomeData] = useState({ category: "", amount: "", desc: "" });
  const [expenseData, setExpenseData] = useState({ category: "", amount: "", desc: "" });
  const [showEdit, setShowEdit] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [csvFile, setCsvFile] = useState(null);

  const navigate = useNavigate();
  const getAuthToken = () => localStorage.getItem("access");

  useEffect(() => {
    fetchTransactions();
  }, []);
  const handleCSVUpload = (event) => {
    setCsvFile(event.target.files[0]);
  };

  const handleCSVImport = async () => {
    if (!csvFile) {
      alert("Please upload a CSV file.");
      return;
    }
  
    Papa.parse(csvFile, {
      complete: async (result) => {
        const parsedData = result.data.slice(1); // Remove headers
        const transactionsToAdd = parsedData
          .map((row) => {
            const [date, type, category, amount, desc] = row;
  
            // Check if the date is valid
            const parsedDate = new Date(date);
            if (isNaN(parsedDate.getTime())) {
              console.error(`Invalid date format: ${date}`);
              return null; // Skip this row if the date is invalid
            }
  
            return {
              date: parsedDate.toISOString(),
              type: type.toLowerCase(),
              category,
              amount: parseFloat(amount),
              desc,
            };
          })
          .filter((transaction) => transaction && transaction.category && transaction.amount && transaction.desc);
  
        for (const transaction of transactionsToAdd) {
          await addTransaction(transaction);
        }
  
        fetchTransactions();
        alert("Transactions imported successfully!");
      },
      header: false,
    });
  };



  const handleChange = (e, type) => {
    const { name, value } = e.target;
    if (type === "income") {
      setIncomeData((prev) => ({ ...prev, [name]: value }));
    } else {
      setExpenseData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleAddTransaction = async (type) => {
    const token = getAuthToken();
    if (!token) {
      alert("User not authenticated. Redirecting to login...");
      navigate("/login");
      return;
    }

    const data = type === "income" ? { ...incomeData, type } : { ...expenseData, type };

    if (!data.category || !data.amount || !data.desc) {
      alert("Please fill in all fields");
      return;
    }

    await addTransaction(data);
    fetchTransactions();
    setIncomeData({ category: "", amount: "", desc: "" });
    setExpenseData({ category: "", amount: "", desc: "" });
  };

  const handleUpdate = async () => {
    const token = getAuthToken();
    if (!token) {
      alert("User not authenticated. Redirecting to login...");
      navigate("/login");
      return;
    }

    if (!editingTransaction || !editingTransaction.category || !editingTransaction.amount || !editingTransaction.desc) {
      alert("Please fill in all fields before saving.");
      return;
    }

    await updateTransaction(editingTransaction.id, editingTransaction);
    fetchTransactions();
    setShowEdit(false);
    setEditingTransaction(null);
  };

  const handleDelete = async (id) => {
    const token = getAuthToken();
    if (!token) {
      alert("User not authenticated. Redirecting to login...");
      navigate("/login");
      return;
    }
    const confirmDelete = window.confirm("Are you sure you want to delete this transaction?");
    if (confirmDelete) {
      await deleteTransaction(id);
      fetchTransactions();
    }
  };

  const token = getAuthToken();

  return (
    <div className="transactions-container">
      <h2>Transactions</h2>

      {!token ? (
        <p className="auth-warning">
          You need to <a href="/login">log in</a> to add transactions.
        </p>
      ) : (
        <>

     <div className="csv-upload">
        <input type="file" accept=".csv" onChange={handleCSVUpload} />
        <button className="btn upload" onClick={handleCSVImport}>Import CSV</button>
      </div>
          <div className="add-transaction income">
            <h3>Add Income</h3>
            <select name="category" value={incomeData.category} onChange={(e) => handleChange(e, "income")}>
              <option value="">Select Category</option>
              <option value="Salary">Salary</option>
              <option value="Business Profit">Business Profit</option>
              <option value="Freelancing">Freelancing</option>
              <option value="Investments">Investments</option>
              <option value="Rental Income">Rental Income</option>
              <option value="Interest Earned">Interest Earned</option>
              <option value="Bonuses & Commissions">Bonuses & Commissions</option>
              <option value="Gifts & Inheritance">Gifts & Inheritance</option>
              <option value="Government Benefits">Government Benefits</option>
              <option value="Side Hustles">Side Hustles</option>
            </select>
            <input type="number" name="amount" placeholder="Amount" value={incomeData.amount} onChange={(e) => handleChange(e, "income")} />
            <input type="text" name="desc" placeholder="Description" value={incomeData.desc} onChange={(e) => handleChange(e, "income")} />
            <button className="btn add income" onClick={() => handleAddTransaction("income")}>
              Add Income
            </button>
          </div>

          <div className="add-transaction expense">
            <h3>Add Expense</h3>
            <select name="category" value={expenseData.category} onChange={(e) => handleChange(e, "expense")}>
              <option value="">Select Category</option>
              <option value="Food & Groceries">Food & Groceries</option>
              <option value="Rent & Housing">Rent & Housing</option>
              <option value="Utilities">Utilities</option>
              <option value="Transportation">Transportation</option>
              <option value="Health & Medical">Health & Medical</option>
              <option value="Entertainment & Leisure">Entertainment & Leisure</option>
              <option value="Shopping & Clothing">Shopping & Clothing</option>
              <option value="Debt Repayments & Loans">Debt Repayments & Loans</option>
              <option value="Education & Learning">Education & Learning</option>
              <option value="Travel & Vacation">Travel & Vacation</option>
              <option value="Insurance">Insurance</option>
              <option value="Subscriptions & Memberships">Subscriptions & Memberships</option>
              <option value="Gifts & Donations">Gifts & Donations</option>
              <option value="Miscellaneous">Miscellaneous</option>
            </select>
            <input type="number" name="amount" placeholder="Amount" value={expenseData.amount} onChange={(e) => handleChange(e, "expense")} />
            <input type="text" name="desc" placeholder="Description" value={expenseData.desc} onChange={(e) => handleChange(e, "expense")} />
            <button className="btn add expense" onClick={() => handleAddTransaction("expense")}>
              Add Expense
            </button>
          </div>
        </>
      )}

      {transactions.length > 0 ? (
        transactions.map((transaction) => (
          <div key={transaction.id} className={`transaction-card ${transaction.type}`}>
            <div className="card-header">
              <h3>{transaction.category} - ₹{transaction.amount}</h3>
              <p>{transaction.desc}</p>
              <span className={`tag ${transaction.type}`}>{transaction.type.toUpperCase()}</span>
            </div>
            <div className="card-actions">
              <button
                className="btn edit"
                onClick={() => {
                  setShowEdit(true);
                  setEditingTransaction({ ...transaction });
                }}
              >
                Edit
              </button>
              <button
                className="btn delete"
                onClick={() => {
                  const confirmDelete = window.confirm(`Are you sure you want to delete the transaction: "${transaction.category}"?`);
                  if (confirmDelete) {
                    handleDelete(transaction.id);
                  }
                }}
              >
                Delete
              </button>
            </div>
          </div>
        ))
      ) : (
        <p>No transactions available</p>
      )}

      {showEdit && (
        <div className="modal">
          <h3>Edit Transaction</h3>
          <input type="text" name="category" placeholder="Category" value={editingTransaction?.category} onChange={(e) => setEditingTransaction({ ...editingTransaction, category: e.target.value })} />
          <input type="number" name="amount" placeholder="Amount" value={editingTransaction?.amount} onChange={(e) => setEditingTransaction({ ...editingTransaction, amount: e.target.value })} />
          <input type="text" name="desc" placeholder="Description" value={editingTransaction?.desc} onChange={(e) => setEditingTransaction({ ...editingTransaction, desc: e.target.value })} />
          <button className="btn save" onClick={handleUpdate}>
            Save
          </button>
          <button className="btn cancel" onClick={() => setShowEdit(false)}>
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};

export default Transactions;
