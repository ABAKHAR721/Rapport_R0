import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import MetricsChart from '../Charts/BAR_Metrics'; // Ensure this path is correct

const MetricsTable = ({ filters,htp,hc,td,tu,oee,phc,dhc,thc,onTableDataReady }) => {
  const [metricsPerDay, setMetricsPerDay] = useState([]);
  const [filterParams, setFilterParams] = useState({ ...filters });


  // Function to fetch metrics based on filters
  const getMetrics = async (filters = {}) => {
    const { dateDebut, dateFin,dateOperation} = filters;
    const queryParams = new URLSearchParams();
    
    if (dateOperation) queryParams.append('date_operation', dateOperation);
    if (dateDebut) queryParams.append('date_debut', dateDebut);
    if (dateFin) queryParams.append('date_fin', dateFin);

    console.log('Fetching metrics with filters:', filters);
    console.log('Query Params:', queryParams.toString());

    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/metrics?${queryParams.toString()}`);
      console.log('API Response:', response.data);
      setMetricsPerDay(response.data.metrics);
    } catch (error) {
      console.error("Error fetching metrics", error);
    }
  };

  useEffect(() => {
    if (filters) {
      setFilterParams(filters);
      getMetrics(filters);
    }  
  }, [filters]);

  useEffect(() => {
    if (onTableDataReady) {
      onTableDataReady(metricsPerDay); // Notify parent about the data
    }
  }, [metricsPerDay, onTableDataReady]);

  return (
    <div className="container mt-5">
      <h2 className="text-white">Metrics Per Day</h2>
      <table className="table table-dark table-striped">
        <thead>
          <tr>
            <th>Date Operation</th>
            <th>HTP</th>
            <th>HC</th>
            <th>TD</th>
            <th>TU</th>
            <th>OEE</th>
            <th>Duree 1er Post</th>
            <th>Duree 2eme Post</th>
            <th>Duree 3eme Post</th>
          </tr>
        </thead>
        <tbody>
          {metricsPerDay.map((metric, index) => (
            <tr key={index}>
              <td>{metric.date_operation}</td>
              <td>{metric.htp}</td>
              <td>{metric.hc}</td>
              <td>{metric.TD}%</td>
              <td>{metric.TU}%</td>
              <td>{metric.OEE}%</td>
              <td>{metric.heur_conteur_1er}</td>
              <td>{metric.heur_conteur_2eme}</td>
              <td>{metric.heur_conteur_3eme}</td>
            </tr>
          ))}
          {/* <tr>
            <td>Total</td>
            <td>{htp}</td>
            <td>{hc}</td>
            <td>{td}</td>
            <td>{tu}</td>
            <td>{oee}</td>
            <td>{phc}</td>
            <td>{dhc}</td>
            <td>{thc}</td>
          </tr> */}
        </tbody>
      </table>
      <MetricsChart metricsPerDay={metricsPerDay} />
    </div>
  );
};

export default MetricsTable;
