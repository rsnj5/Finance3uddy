import React, { useContext } from "react";
import { TransactionContext } from "../contexts/TransactionContext";
import WeeklyChart from "../components/Charts/WeeklyChart";
import MonthlyChart from "../components/Charts/MonthlyChart";
import YearlyChart from "../components/Charts/YearlyChart";
import CategoryChart from "../components/Charts/CategoryChart";

const Chart = () => {
  const { weeklyData, monthlyData, yearlyData, categoryData, allCategories } = useContext(TransactionContext);

  return (
    <div className="min-h-screen overflow-x-hidden bg-gray-100">
      <div className="h-screen">
        <div className="font-extrabold text-2xl mx-4 mt-4 text-gray-800">Visualize Your Transactions</div>
        <div className="mx-4 mb-4 text-gray-600">
          Analyze how much you spent or earned on a weekly, monthly, yearly, or category-wise basis
        </div>
        <div className="flex justify-around p-4">
          <div className="grid grid-rows-2 grid-cols-2 gap-4">
            <WeeklyChart weeklyData={weeklyData} />
            <MonthlyChart monthlyData={monthlyData} />
            <YearlyChart yearlyData={yearlyData} />
          </div>
          <CategoryChart categoryData={categoryData} allCategories={allCategories} />
        </div>
      </div>
    </div>
  );
};

export default Chart;

