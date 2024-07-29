import React from 'react';
import { PieChart, Pie, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

const HourPie = ({ phc, dhc, thc }) => {
    // Create data for the pie chart
    const data = [
        { name: '1st Hour Counter', value: phc },
        { name: '2nd Hour Counter', value: dhc },
        { name: '3rd Hour Counter', value: thc },
    ];

    // Define colors for each section
    const colors = ['#8884d8', '#82ca9d', '#ffc658'];

    return (
        <div className="card mt-4 bg-dark text-white">
            <div className="card-header d-flex justify-content-between align-items-center bg-dark text-white">
                <h5>Hour Counter Distribution (Pie Chart)</h5>
            </div>
            <div style={{ backgroundColor: 'black', color: 'white' }} className="card-body">
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Pie
                            dataKey="value"
                            isAnimationActive={true}
                            data={data}
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            label={({ name }) => name}
                            fill="#8884d8"
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                            ))}
                        </Pie>
                        <Tooltip contentStyle={{ backgroundColor: '#333', border: 'none' }} />
                        <Legend wrapperStyle={{ color: '#ffffff' }} />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default HourPie;
