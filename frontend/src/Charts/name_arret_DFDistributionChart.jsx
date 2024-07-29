import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

const DFDistributionChart = ({ data }) => {
    // Preprocess the data to accumulate `df` values for duplicate `nom_arret`
    const processedData = data.reduce((acc, curr) => {
        const existing = acc.find(item => item.nom_arret === curr.nom_arret);
        if (existing) {
            existing.df += curr.df;
        } else {
            acc.push({ ...curr });
        }
        return acc;
    }, []);

    // Define colors for each bar
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
            <div className="card-header d-flex justify-content-between align-items-center bg-dark text-white">
                <h5>DF Distribution</h5>
            </div>
            <div style={{ backgroundColor: 'black', color: 'white' }} className="card-body">
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={processedData}>
                        <XAxis dataKey="nom_arret" stroke="#ffffff" />
                        <YAxis stroke="#ffffff" />
                        <Tooltip contentStyle={{ backgroundColor: '#333', border: 'none' }} itemStyle={{ color: '#fff' }} />
                        <Legend wrapperStyle={{ color: '#ffffff' }} />
                        <Bar dataKey="df" isAnimationActive={true}>
                            {processedData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default DFDistributionChart;
