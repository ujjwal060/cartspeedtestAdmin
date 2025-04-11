import React, { useState, useEffect } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Box
} from '@mui/material';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js';
import Loader from '../components/Loader';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setData({
        totalUsers: 1024,
        newUsersThisMonth: 123,
        activeUsers: 240,
        totalTests: 87,
        passedTests: 66,
        certificatesIssued: 54
      });
      setLoading(false);
    }, 1000);
  }, []);

  const chartData = {
    labels: ['Delhi', 'Mumbai', 'Bangalore', 'Chennai', 'Kolkata'],
    datasets: [
      {
        label: 'Active Users',
        data: [40, 60, 30, 20, 50],
        backgroundColor: 'rgba(63, 81, 181, 0.6)',
        borderColor: 'rgba(63, 81, 181, 1)',
        borderWidth: 1,
      },
    ],
  };

  return (
    <Box sx={{ padding: '24px' }}>
      {loading ? (
        <Loader />
      ) : (
        <>
          <Typography variant="h4" gutterBottom>
            Admin Dashboard
          </Typography>

          {/* Top Summary Cards */}
          <Grid container spacing={3} sx={{ marginBottom: 2 }}>
            <Grid item xs={12} sm={4}>
              <Card sx={{ backgroundColor: '#f0f4ff' }}>
                <CardContent>
                  <Typography variant="subtitle2" color="textSecondary">Total Users</Typography>
                  <Typography variant="h5">{data.totalUsers}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Card sx={{ backgroundColor: '#e3fce3' }}>
                <CardContent>
                  <Typography variant="subtitle2" color="textSecondary">New This Month</Typography>
                  <Typography variant="h5">{data.newUsersThisMonth}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Card sx={{ backgroundColor: '#fff4e5' }}>
                <CardContent>
                  <Typography variant="subtitle2" color="textSecondary">Active Users</Typography>
                  <Typography variant="h5">{data.activeUsers}</Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Grid container spacing={3}>
            {/* Location-Based Activity */}
            <Grid item xs={12} md={8}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Location-wise Activity
                  </Typography>
                  <Bar data={chartData} />
                </CardContent>
              </Card>
            </Grid>

            {/* Tests Overview */}
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>Tests Overview</Typography>
                  <Typography variant="body1">Total Tests: {data.totalTests}</Typography>
                  <Typography variant="body1">Passed: {data.passedTests}</Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* Certificates Issued */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6">Certificates Issued</Typography>
                  <Typography variant="body1">Total Certificates: {data.certificatesIssued}</Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    href="/issue-certificate"
                    sx={{ mt: 2 }}
                  >
                    Issue Certificate
                  </Button>
                </CardContent>
              </Card>
            </Grid>

            {/* Manage Videos */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6">Manage Training Videos</Typography>
                  <Button
                    variant="contained"
                    color="secondary"
                    href="/videos"
                    sx={{ mt: 2 }}
                  >
                    View Videos
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </>
      )}
    </Box>
  );
};

export default Dashboard;
