import React, { useState, useEffect } from 'react';
import Loader from '../components/Loader';

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    fetch('/api/dashboard-data')
      .then((response) => response.json())
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });
  }, []);

  return (
    <div>
      {loading ? (
        <Loader />
      ) : (
        <div>
          <h1>Dashboard Data</h1>
          <p>{JSON.stringify(data)}</p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
