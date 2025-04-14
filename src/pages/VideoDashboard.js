import React, { useState } from 'react';
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
  Grid
} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import ReactPlayer from 'react-player';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer
} from 'recharts';

const dummyVideos = [
  { title: 'Video 1', url: 'https://www.w3schools.com/html/mov_bbb.mp4', views: 0.1, date: '2025-03-15' },
  { title: 'Video 2', url: 'https://www.w3schools.com/html/movie.mp4', views: 1.0, date: '2025-03-27' },
  { title: 'Video 3', url: 'https://www.w3schools.com/html/mov_bbb.mp4', views: 0.2, date: '2025-03-30' }
];

const VideoDashboard = () => {
  const [selectedVideo, setSelectedVideo] = useState(dummyVideos[0]);

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>
        Video Dashboard
      </Typography>

      {/* Player + Chart */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Views Chart
            </Typography>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={dummyVideos}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="views"
                  stroke="#f57c00"
                  strokeWidth={2}
                  dot={{ stroke: '#f57c00', strokeWidth: 2, fill: '#fff' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Box borderRadius={2} overflow="hidden">
            <ReactPlayer url={selectedVideo.url} controls width="100%" height="300px" />
          </Box>
        </Grid>
      </Grid>

      {/* Table */}
      <Box mt={4}>
        <Paper elevation={3}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>URL</TableCell>
                <TableCell>Views</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {dummyVideos.map((video, index) => (
                <TableRow key={index}>
                  <TableCell>{video.title}</TableCell>
                  <TableCell>{video.url}</TableCell>
                  <TableCell>{video.views}</TableCell>
                  <TableCell>
                    <IconButton
                      color="primary"
                      onClick={() => setSelectedVideo(video)}
                    >
                      <PlayArrowIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      </Box>
    </Box>
  );
};

export default VideoDashboard;
