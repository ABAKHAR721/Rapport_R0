import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const MetricsChart = ({ metricsPerDay }) => {
  // Ensure metricsPerDay is defaulted to an empty array if not provided
  const data = metricsPerDay || [];

  return (
    <div className="container mt-5">
      <h2 className="text-white">Metrics Per Day</h2>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={data}
          margin={{
            top: 20, right: 30, left: 20, bottom: 5,
          }}
          barCategoryGap="10%" // Adjust gap between categories
          barGap="2%" // Adjust gap between bars within a category
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date_operation" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="TD" fill="#8884d8" name="TD" />
          <Bar dataKey="TU" fill="#82ca9d" name="TU" />
          <Bar dataKey="OEE" fill="#ffc658" name="OEE" />
          <Bar dataKey="RD" fill="#ff8042" name="RD" />
          <Bar dataKey="RF" fill="#8dd1e1" name="RF" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
export default MetricsChart;
