import React, { useState } from "react";
import { Box, Typography, Paper } from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import ReactPlayer from "react-player";
import Offcanvas from "react-bootstrap/Offcanvas";
import Table from "react-bootstrap/Table";
import Pagination from "react-bootstrap/Pagination";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import { Button } from "@mui/material";

const rowsPerPage = 5;
const dummyVideos = [
  {
    id: 1,
    title: "Video 1",
    url: "https://www.w3schools.com/html/mov_bbb.mp4",
    views: 0.1,
  },
  {
    id: 2,
    title: "Video 2",
    url: "https://www.w3schools.com/html/movie.mp4",
    views: 1.0,
  },
  {
    id: 3,
    title: "Video 3",
    url: "https://www.w3schools.com/html/mov_bbb.mp4",
    views: 0.2,
  },
];

const VideoDashboard = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedVideo, setSelectedVideo] = useState(dummyVideos[0]);
  const [show, setShow] = useState(false);
  const totalPages = Math.ceil(dummyVideos.length / rowsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const paginatedUsers = dummyVideos.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <Box p={4}>
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
        <div className="d-flex justify-content-end">
          <Button
            variant="contained"
            color="primary"
            className="mb-3 "
            onClick={handleShow}
          >
            Add Video
          </Button>
        </div>
        <Paper elevation={3}>
          <Table striped hover>
            <thead>
              <tr>
                <th>#</th>
                <th>Title</th>
                <th>Url</th>
                <th>Views</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedUsers.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.title}</td>
                  <td>{user.url}</td>
                  <td>{user.views}</td>
                  <td>
                    <tr>
                      <td>
                        <VisibilityIcon className="text-success" />
                      </td>
                      <td>
                        <DeleteIcon className="text-danger" />
                      </td>
                    </tr>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan="5">
                  <Pagination className="mb-0 justify-content-center">
                    {[...Array(totalPages)].map((_, idx) => (
                      <Pagination.Item
                        key={idx + 1}
                        active={idx + 1 === currentPage}
                        onClick={() => handlePageChange(idx + 1)}
                      >
                        {idx + 1}
                      </Pagination.Item>
                    ))}
                  </Pagination>
                </td>
              </tr>
            </tfoot>
          </Table>
        </Paper>
      </Box>
      <Offcanvas show={show} onHide={handleClose} placement={"end"}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Add Your Video</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>Enter your code here</Offcanvas.Body>
      </Offcanvas>
    </Box>
  );
};

export default VideoDashboard;
