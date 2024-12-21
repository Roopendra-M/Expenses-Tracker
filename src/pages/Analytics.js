import React from "react";
import ChartComponent from "../components/Charts"; // Assuming the path to your chart component

const Analytics = ({ transactions }) => {
  return (
    <div>
      <h1>Analytics</h1>
      {transactions && transactions.length ? (
        <ChartComponent transactions={transactions} />
      ) : (
        <p>No transactions available to analyze.</p>
      )}
    </div>
  );
};

export default Analytics;
