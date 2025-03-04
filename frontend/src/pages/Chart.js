import React, { useContext } from "react";
import { TransactionContext } from "../contexts/TransactionContext";
import WeeklyChart from "../components/Charts/WeeklyChart";
import MonthlyChart from "../components/Charts/MonthlyChart";
import YearlyChart from "../components/Charts/YearlyChart";
import CategoryChart from "../components/Charts/CategoryChart";
import "../styles/Chart.css";

const Chart = () => {
  const { weeklyData, monthlyData, yearlyData, categoryData, allCategories } = useContext(TransactionContext);

  return (
    <div className="chart-container">
      <div className="chart-header">
        <h1>Visualize Your Transactions</h1>
        <p>Analyze how much you spent or earned on a weekly, monthly, yearly, or category-wise basis</p>
      </div>

      <div className="line-charts">
        <div className="chart-card">
          <WeeklyChart weeklyData={weeklyData} />
        </div>
        <div className="chart-card">
          <MonthlyChart monthlyData={monthlyData} />
        </div>
        <div className="chart-card">
          <YearlyChart yearlyData={yearlyData} />
        </div>
      </div>

      <div className="pie-charts">
        <div className="chart-card">
          <CategoryChart categoryData={categoryData} allCategories={allCategories} />
        </div>
      </div>
    </div>
  );
};

export default Chart;