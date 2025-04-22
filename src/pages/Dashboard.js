import React from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Box,
} from "@mui/material";
import CardActionArea from "@mui/material/CardActionArea";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { useNavigate } from "react-router-dom";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const Dashboard = () => {
  const navigate = useNavigate();
  const data = {
    totalUsers: 1024,
    newUsersThisMonth: 123,
    activeUsers: 240,
    totalTests: 87,
    passedTests: 66,
    certificatesIssued: 54,
  };

  const chartData = {
    labels: ["Delhi", "Mumbai", "Bangalore", "Chennai", "Kolkata"],
    datasets: [
      {
        label: "Users",
        data: [40, 60, 30, 20, 50],
        backgroundColor: [
          "rgba(255, 99, 132, 0.6)", 
          "rgba(54, 162, 235, 0.6)",
          "rgba(255, 206, 86, 0.6)",
          "rgba(75, 192, 192, 0.6)",
          "rgba(153, 102, 255, 0.6)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };
  

  return (
    <div className="container-fluid">
      <Box sx={{ padding: "24px" }}>
        <Typography variant="h4" gutterBottom>
          Admin Dashboard
        </Typography>

        {/* Top Summary Cards */}
        <Grid container spacing={3} sx={{ marginBottom: 2 }}>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Card sx={{ backgroundColor: "#f0f4ff" }}>
              <CardActionArea>
                <CardContent>
                  <Typography variant="subtitle2" color="textSecondary">
                    Total Users
                  </Typography>
                  <Typography variant="h5" style={{ marginTop: "30px" }}>
                    {data.totalUsers}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Card sx={{ backgroundColor: "#e3fce3" }}>
              <CardActionArea>
                <CardContent>
                  <Typography variant="subtitle2" color="textSecondary">
                    New This Month
                  </Typography>
                  <Typography variant="h5" style={{ marginTop: "30px" }}>
                    {data.newUsersThisMonth}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Card sx={{ backgroundColor: "#fff4e5" }}>
              <CardActionArea>
                <CardContent>
                  <Typography variant="subtitle2" color="textSecondary">
                    Active Users
                  </Typography>
                  <Typography variant="h5" style={{ marginTop: "30px" }}>
                    {data.activeUsers}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        </Grid>

        <div className="row gy-4">
          <div className="col-lg-8">
            <Grid size={{ xs: 8 }}>
              <Card style={{ height: "100%" }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Location-wise Activity
                  </Typography>
                  <Bar data={chartData} />
                </CardContent>
              </Card>
            </Grid>
          </div>
          <div className="col-lg-4">
            <Grid size={{ xs: 12 }} className="mb-2">
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Tests Overview
                  </Typography>
                  <Typography variant="body1">
                    Total Tests: {data.totalTests}
                  </Typography>
                  <Typography variant="body1">
                    Passed: {data.passedTests}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* Certificates Issued */}
            <Grid size={{ xs: 12 }} className="mb-2">
              <Card>
                <CardContent>
                  <Typography variant="h6">Certificates Issued</Typography>
                  <Typography variant="body1">
                    Total Certificates: {data.certificatesIssued}
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    href="/issue-certificate"
                    className="mt-2 w-100"
                  >
                    Issue Certificate
                  </Button>
                </CardContent>
              </Card>
            </Grid>

            {/* Manage Videos */}
            <Grid size={{ xs: 12 }}>
              <Card>
                <CardContent>
                  <Typography variant="h6">Manage Training Videos</Typography>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => navigate("/videos")}
                    className="mt-2 w-100"
                  >
                    View Videos
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          </div>
        </div>
      </Box>
    </div>
  );
};

export default Dashboard;
