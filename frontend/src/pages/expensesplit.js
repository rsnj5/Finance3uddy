import React, { useState } from "react";
import Groups from "../components/groupmanage.js";
import Transactions from "../components/transaction.js";
import Expenses from "../components/expense.js";
import "../styles/expensesplit.css"; 

const ExpenseSplit = () => {
    const [activeTab, setActiveTab] = useState("transactions");

    return (
        <div className="expense-container">
            <div className="expense-box">
                <h1 className="title"> Expense Splitter</h1>

                
                <div className="tab-buttons">
                    {["transactions", "expenses", "groups"].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`tab-button ${activeTab === tab ? "active" : ""}`}
                        >
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </button>
                    ))}
                </div>

                
                <div className="tab-content">
                    {activeTab === "transactions" && <Transactions />}
                    {activeTab === "expenses" && <Expenses />}
                    {activeTab === "groups" && <Groups />}
                </div>
            </div>
        </div>
    );
};

export default ExpenseSplit;
