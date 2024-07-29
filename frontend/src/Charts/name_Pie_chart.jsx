import React from 'react';
import { PieChart, Pie, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

const DFDistributionPieChart = ({ data }) => {
    // Preprocess the data to accumulate `df` values for each unique `nom_arret`
    const processedData = data.reduce((acc, curr) => {
        const existingIndex = acc.findIndex(item => item.name === curr.nom_arret);
        if (existingIndex !== -1) {
            acc[existingIndex].value += curr.df;
        } else {
            acc.push({ name: curr.nom_arret, value: curr.df });
        }
        return acc;
    }, []);

    // Define colors for each section
    const colors = [
        '#8884d8', '#82ca9d', '#ffc658', '#ff7f50', '#7ec8e3', '#ff9999', '#d1d1e0',
        '#ffcc99', '#99ccff', '#66cccc', '#ffd700', '#c0c0c0', '#ff6666', '#ff99cc',
        '#b3b3cc', '#99ffcc', '#ffb3e6', '#66cdaa', '#ff9966', '#ccccff', '#ff6666'
    ];

    // Conditionally render the chart only if there is data to display
    if (processedData.length === 0) {
        return null;
    }

    return (
        <div className="card mt-4 bg-dark text-white">
            <div className="card-header d-flex justify-content-between align-items-center bg-dark text-white">                <h5>DF Distribution by Nom Arret (Pie Chart)</h5>
            </div>
            <div style={{ backgroundColor: 'black', color: 'white' }} className="card-body">
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Pie
                            dataKey="value"
                            isAnimationActive={true}
                            data={processedData}
                            cx="50%"
                            cy="50%"
                            outerRadius={60}
                            label
                        >
                            {processedData.map((entry, index) => (
                                <Cell key={`cell-${entry.name}`} fill={colors[index % colors.length]} />
                            ))}
                        </Pie>
                        <Tooltip contentStyle={{ backgroundColor: '#333', border: 'none' }} itemStyle={{ color: '#fff' }} />
                        <Legend wrapperStyle={{ color: '#ffffff' }} />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default DFDistributionPieChart;
