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
  }, []);
  const sortedStates = [...data.topStates].sort((a, b) =>
    a.state.localeCompare(b.state)
  );

  const formatStateLabel = (stateName) => {
    const parts = stateName.split(', ');
    if (parts.length > 1) {
      const lastPart = parts.pop();
      const firstPart = parts.join(', ');
      return [firstPart, lastPart];
    }
    return stateName;
  };

  const chartData = {
    labels: sortedStates.map((state) => formatStateLabel(state.state)),
    datasets: [
      {
        label: "Users",
        data: sortedStates.map((state) => state.count),
        backgroundColor: [
          "rgba(255, 99, 132, 0.6)",
          "rgba(54, 162, 235, 0.6)",
          "rgba(255, 206, 86, 0.6)",
          "rgb(75, 116, 192)",
          "rgba(153, 102, 255, 0.6)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgb(75, 116, 192)",
          "rgba(153, 102, 255, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const handleUserFilter = () => {
    const now = new Date();
    const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    navigate("/users", {
      state: {
        startDate: startDate,
        endDate: endDate,
      },
    });
  };

  return (
    <Box>
      <Grid container spacing={3} sx={{ marginBottom: 2 }}>
        <Grid size={{ xs: 12, sm: 2.4 }}>
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
        <Grid size={{ xs: 12, sm: 2.4 }}>
          <Card
            sx={{ backgroundColor: "#e3fce3" }}
            onClick={() => handleUserFilter()}
          >
            <CardActionArea>
              <CardContent>
                <Typography variant="subtitle2" color="textSecondary">
                  New This Month
                </Typography>
                <Typography variant="h5" style={{ marginTop: "30px" }}>
                  {data?.thisMonthUsers || 0}
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
        {/* <Grid size={{ xs: 12, sm: 2.4 }}>
          <Card
            sx={{ backgroundColor: "#ecf3f0", height: "100%" }}
            onClick={() => navigate("/test")}
          >
            <CardActionArea style={{ height: "100%" }}>
              <CardContent
                className="d-flex flex-column justify-content-between"
                style={{ height: "100%" }}
              >
                <Typography variant="subtitle2" color="textSecondary">
                  Overall Test
                </Typography>
                <div className="d-flex flex-row justify-content-between align-items-center">
                  <Typography variant="h6">
                    Total: {data.totalUsers || 0}
                  </Typography>
                </div>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid> */}
        {/* <Grid size={{ xs: 12, sm: 2.4 }}>
          <Card
            sx={{ backgroundColor: "#f3efef", height: "100%" }}
            onClick={() => navigate("/test")}
          >
            <CardActionArea style={{ height: "100%" }}>
              <CardContent
                className="d-flex flex-column justify-content-between"
                style={{ height: "100%" }}
              >
                <Typography variant="subtitle2" color="textSecondary">
                  Passed Test
                </Typography>
                <div className="d-flex flex-row justify-content-between align-items-center">
                  <Typography variant="h6">
                    Passed: {data.passedTests || 0}
                  </Typography>
                </div>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid> */}
        <Grid size={{ xs: 12, sm: 2.4 }}>
          <Card
            sx={{ backgroundColor: "#fff4e5" }}
            onClick={() => navigate("/certificate")}
          >
            <CardActionArea>
              <CardContent>
                <Typography variant="subtitle2" color="textSecondary">
                  Certificates Issued{" "}
                </Typography>
                <Typography variant="h5" style={{ marginTop: "30px" }}>
                  {data.totalCertificatesIssued || 0}
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
                <Bar
                  data={chartData}
                  options={{
                    responsive: true,
                    scales: {
                      x: {
                        ticks: {
                          color: '#000',
                          maxRotation: 45,
                          minRotation: 45,
                          autoSkip: false,
                        },
                      },
                    },
                    plugins: {
                      tooltip: {
                        callbacks: {
                          title: function(context) {
                            return sortedStates[context[0].dataIndex].state;
                          },
                          label: function(context) {
                            return `Users: ${context.raw}`;
                          },
                        }
                      }
                    }
                  }}
                  style={{ height: "100%" }}
                />
              </CardContent>
            </Card>
          </Grid>
        </div>
        <div className="col-lg-4">
          <div className="d-flex flex-column h-100">
            <Grid size={{ xs: 12 }} className="mb-2 h-100">
              <Card className="h-100">
                <CardContent className="d-flex flex-column justify-content-between h-100 text-center">
                  <Typography variant="h6">Manage Training Videos</Typography>
                  <Button
                    variant="contained"
                    //  color="secondary"
                    onClick={() => navigate("/videos")}
                    className="mt-2 w-100  py-2 rounded-4"
                  >
                    View Videos
                  </Button>
                </CardContent>
              </Card>
            </Grid>

            {/* Manage LSV */}

            <Grid size={{ xs: 12 }} className="mb-2 h-100">
              <Card className="h-100">
                <CardContent className="d-flex flex-column justify-content-between h-100 text-center">
                  <Typography variant="h6">
                    Rules and Regulations for LSV
                  </Typography>
                  <Button
                    variant="contained"
                    //  color="secondary"
                    onClick={() => navigate("/add-lsvrules")}
                    className="mt-2 w-100  py-2 rounded-4"
                  >
                    View LSV
                  </Button>
                </CardContent>
              </Card>
            </Grid>

            {/* Manage Low speed vehicle */}
            <Grid size={{ xs: 12 }} className="h-100">
              <Card className="h-100">
                <CardContent className="d-flex flex-column justify-content-between h-100 text-center">
                  <Typography variant="h6">ADD Low Speed Vehicle</Typography>
                  <Button
                    variant="contained"
                    //  color="secondary"
                    onClick={() => navigate("/addlsv-laws")}
                    className="mt-2 w-100 py-2 rounded-4"
                  >
                    View Low Speed Vehicle
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          </div>
        </div>
      </div>
    </Box>
  );
};

export default Dashboard;
