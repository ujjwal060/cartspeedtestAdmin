import React, { useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  IconButton,
  Grid,
} from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import ReactPlayer from "react-player";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import DataTable from "../components/datatable";

const dummyVideos = [
  {
    title: "Video 1",
    url: "https://www.w3schools.com/html/mov_bbb.mp4",
    views: 0.1,
    date: "2025-03-15",
  },
  {
    title: "Video 2",
    url: "https://www.w3schools.com/html/movie.mp4",
    views: 1.0,
    date: "2025-03-27",
  },
  {
    title: "Video 3",
    url: "https://www.w3schools.com/html/mov_bbb.mp4",
    views: 0.2,
    date: "2025-03-30",
  },
];

const VideoDashboard = () => {
  const [selectedVideo, setSelectedVideo] = useState(dummyVideos[0]);

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>
        Video Dashboard
      </Typography>

      {/* Player + Chart */}

      <Box borderRadius={2} className="w-100">
        <ReactPlayer
          url={selectedVideo.url}
          controls
          className="object-fit-cover"
          width="100%"
          height="300px"
        />
      </Box>

      {/* Table */}
      <Box mt={4}>
        <Paper elevation={3}>
          <DataTable />
        </Paper>
      </Box>
    </Box>
  );
};

export default VideoDashboard;
