import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

const HourBar = ({ phc, dhc, thc }) => {
    // Create data for the bar chart
    const data = [
        { name: '1st Hour Counter', value: phc },
        { name: '2nd Hour Counter', value: dhc },
        { name: '3rd Hour Counter', value: thc },
    ];
    

    // Define colors for each bar
    const colors = ['#8884d8', '#82ca9d', '#ffc658'];

    return (
        <div className="card mt-4 bg-dark text-white">
            <div className="card-header d-flex justify-content-between align-items-center bg-dark text-white">
                <h5>Hour Counter Distribution (Bar Chart)</h5>
            </div>
            <div style={{ backgroundColor: 'black', color: 'white' }} className="card-body">
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={data}>
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip contentStyle={{ backgroundColor: '#333', border: 'none' }} />
                        <Legend wrapperStyle={{ color: '#ffffff' }} />
                        <Bar dataKey="value" isAnimationActive={true}>
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default HourBar;
