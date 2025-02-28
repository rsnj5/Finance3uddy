import React from 'react';
import { Pie } from 'react-chartjs-2';

const CategoryChart = ({ categoryData, thememode }) => {
  // Filtering data for Income and Expense separately
  const incomeData = categoryData.filter((data) => data.total_income !== null);
  const expenseData = categoryData.filter((data) => data.total_expense !== null);

  // Define light and dark theme colors
  const lightTheme = {
    colorText: 'black',
    income: 'rgba(75,192,192,0.5)',
    incomeBorder: 'rgba(75,192,192,1)',
    expenses: 'rgba(255,99,132,0.5)',
    expensesBorder: 'rgba(255,99,132,1)',
  };

  const darkTheme = {
    colorText: 'white',
    income: 'rgba(34,139,34,0.5)',
    incomeBorder: 'rgba(34,139,34,1)',
    expenses: 'rgba(165,42,42,0.5)',
    expensesBorder: 'rgba(165,42,42,1)',
  };

  // Select theme based on mode
  const theme = thememode === 'dark' ? darkTheme : lightTheme;

  // Generate colors dynamically
  const incomeColors = generateColors(incomeData.length, thememode);
  const expenseColors = generateColors(expenseData.length, thememode);

  // Prepare income chart data
  const incomeChartData = {
    labels: incomeData.map((data) => data.category),
    datasets: [
      {
        label: 'Income',
        backgroundColor: incomeColors.backgroundColors,
        borderColor: incomeColors.borderColors,
        borderWidth: 1,
        data: incomeData.map((data) => data.total_income),
      },
    ],
  };

  // Prepare expense chart data
  const expenseChartData = {
    labels: expenseData.map((data) => data.category),
    datasets: [
      {
        label: 'Expenses',
        backgroundColor: expenseColors.backgroundColors,
        borderColor: expenseColors.borderColors,
        borderWidth: 1,
        data: expenseData.map((data) => data.total_expense),
      },
    ],
  };

  // Chart options
  const options = {
    maintainAspectRatio: true,
    responsive: true,
    aspectRatio: 2, // Adjust for smaller size
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: theme.colorText,
          font: { size: 10 },
        },
      },
    },
  };

  return (
    <div className="flex flex-wrap justify-center gap-6">
      {/* Income Pie Chart */}
      <div
        className="w-[250px] h-[250px] p-4 shadow-md rounded-lg dark:text-white"
        style={{ backgroundColor: thememode === 'dark' ? '#2c3034' : 'white' }}
      >
        <p className="w-full text-center text-sm font-bold">Income Distribution</p>
        <Pie data={incomeChartData} options={options} />
      </div>

      {/* Expense Pie Chart */}
      <div
        className="w-[250px] h-[250px] p-4 shadow-md rounded-lg dark:text-white"
        style={{ backgroundColor: thememode === 'dark' ? '#2c3034' : 'white' }}
      >
        <p className="w-full text-center text-sm font-bold">Expense Distribution</p>
        <Pie data={expenseChartData} options={options} />
      </div>
    </div>
  );
};

export default CategoryChart;

// Function to generate dynamic colors
const generateColors = (count, thememode) => {
  const backgroundColors = [];
  const borderColors = [];

  const generateColor = (index) => {
    const hue = (index * (360 / count)) % 360;
    const lightness = thememode === 'dark' ? 25 : 75;
    return `hsl(${hue}, 100%, ${lightness}%)`;
  };

  for (let i = 0; i < count; i++) {
    backgroundColors.push(generateColor(i));
    borderColors.push(generateColor(i));
  }

  return {
    backgroundColors,
    borderColors,
  };
};

