import React from 'react';
import { PieChart, Pie, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

const DFDistributionChart = ({ data }) => {
    // Check if data is empty
    if (data.length === 0) {
        return <p className="text-center text-white">No data available for chart</p>;
    }

    // Create an array to hold unique type_arret values
    const uniqueTypes = [...new Set(data.map(item => item.type_arret))];

    // Function to map data by type_arret and calculate total df
    const chartData = uniqueTypes.map(type => ({
        name: type,
        value: data.filter(item => item.type_arret === type).reduce((acc, curr) => acc + curr.df, 0)
    }));

    // Define colors for each section
    const colors = [
        '#8884d8', '#82ca9d', '#ffc658', '#ff7f50', '#7ec8e3', '#ff9999', '#d1d1e0',
        '#ffcc99', '#99ccff', '#66cccc', '#ffd700', '#c0c0c0', '#ff6666', '#ff99cc',
        '#b3b3cc', '#99ffcc', '#ffb3e6', '#66cdaa', '#ff9966', '#ccccff', '#ff6666'
    ];

    return (
        <div className="card mt-4 bg-dark text-white">
            <div className="card-header d-flex justify-content-between align-items-center bg-dark text-white">
                <h5>DF Distribution by Type Arret (Pie Chart)</h5>
            </div>
            <div style={{ backgroundColor: 'black', color: 'white' }} className="card-body">
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Pie 
                        
                            dataKey="value"
                            isAnimationActive={true}
                            data={chartData}
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            label={({ name }) => name}
                            fill="#8884d8"
                        >
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                            ))}
                        </Pie>
                        <Tooltip contentStyle={{ backgroundColor: '#333', border: 'none' }} />
                        <Legend wrapperStyle={{color: '#ffffff' }} />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default DFDistributionChart;
