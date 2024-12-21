import React from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";

// Register necessary components for Chart.js
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const ChartComponent = ({ transactions }) => {
  // Prepare data for the chart
  const chartData = {
    labels: transactions.map((transaction) => transaction.date), // Dates on the X-axis
    datasets: [
      {
        label: "Income",
        data: transactions
          .filter((transaction) => transaction.type === "income")
          .map((transaction) => transaction.amount), // Filter and map income amounts
        borderColor: "rgba(75, 192, 192, 1)", // Line color for income
        backgroundColor: "rgba(75, 192, 192, 0.2)", // Background color for income line
        fill: true,
      },
      {
        label: "Expense",
        data: transactions
          .filter((transaction) => transaction.type === "expense")
          .map((transaction) => transaction.amount), // Filter and map expense amounts
        borderColor: "rgba(255, 99, 132, 1)", // Line color for expenses
        backgroundColor: "rgba(255, 99, 132, 0.2)", // Background color for expense line
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "Transactions Analytics",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div>
      <Line data={chartData} options={options} />
    </div>
  );
};

export default ChartComponent;
