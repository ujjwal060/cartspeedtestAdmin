import React, { useState, useEffect } from "react";
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
import { getAll } from "../api/dashboard";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const Dashboard = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({
    totalUsers: 0,
    thisMonthUsers: 0,
    activeUsers: 10,
    topStates: [],
    newUsersThisMonth: 0,
    totalTests: 10,
    passedTests: 10,
    certificatesIssued: 10,
  });

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await getAll(token);
      setData(res);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  });
  const sortedStates = [...data.topStates].sort((a, b) =>
    a.state.localeCompare(b.state)
  );
  const chartData = {
    labels: sortedStates.map((state) => state.state),
    datasets: [
      {
        label: "Users",
        data: sortedStates.map((state) => state.count),
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
          <Grid size={{ xs: 12, sm: 3 }}>
            <Card
              sx={{ backgroundColor: "#f0f4ff" }}
              onClick={() => navigate("/users")}
            >
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
          <Grid size={{ xs: 12, sm: 3 }}>
            <Card sx={{ backgroundColor: "#e3fce3" }}>
              <CardActionArea>
                <CardContent>
                  <Typography variant="subtitle2" color="textSecondary">
                    New This Month
                  </Typography>
                  <Typography variant="h5" style={{ marginTop: "30px" }}>
                    {data.newUsersThisMonth || 0}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, sm: 3 }}>
            <Card sx={{ backgroundColor: "#fff4e5" }}>
              <CardActionArea>
                <CardContent>
                  <Typography variant="subtitle2" color="textSecondary">
                    Active Users
                  </Typography>
                  <Typography variant="h5" style={{ marginTop: "30px" }}>
                    {data.activeUsers || 0}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, sm: 3 }}>
            <Card sx={{ backgroundColor: "#fff4e5" }}>
              <CardActionArea>
                <CardContent>
                  <Typography variant="subtitle2" color="textSecondary">
       Certificates Issued                  </Typography>
                  <Typography variant="h5" style={{ marginTop: "30px" }}>
                    {data.certificatesIssued || 0}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        </Grid>

        <div className="row gy-4">
          <div className="col-lg-8">
            <Grid style={{ height: "100%" }} size={{ xs: 8 }}>
              <Card style={{ height: "100%" }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Location-wise Activity
                  </Typography>
                  <Bar data={chartData} options={{ responsive: true }} style={{ height: "100%" }}  />
                </CardContent>
              </Card>
            </Grid>
          </div>
          <div className="col-lg-4">
            <Grid size={{ xs: 12 }} className="mb-2">
              <Card>
                <CardActionArea>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Tests Overview
                    </Typography>
                    <Typography variant="body1">
                      Total Tests: {data.totalTests || 0}
                    </Typography>
                    <Typography variant="body1">
                      Passed: {data.passedTests || 0}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>

            {/* Manage Videos */}
            <Grid size={{ xs: 12 }}  className="mb-2">
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

            {/* Manage LSV */}

            <Grid size={{ xs: 12 }}  className="mb-2">
              <Card>
                <CardContent>
                  <Typography variant="h6">ADD LSV</Typography>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => navigate("/add-lsvrules")}
                    className="mt-2 w-100"
                  >
                    View LSV
                  </Button>
                </CardContent>
              </Card>
            </Grid>

            {/* Manage Low speed vehicle */}
            <Grid size={{ xs: 12 }}>
              <Card>
                <CardContent>
                  <Typography variant="h6">ADD Low Speed Vehicle</Typography>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => navigate("/addlsv-laws")}
                    className="mt-2 w-100"
                  >
                    View Low Speed Vehicle
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
