import React, { useState } from "react";
import { Typography, Paper, Box } from "@mui/material";
import Table from "react-bootstrap/Table";
import Pagination from "react-bootstrap/Pagination";
import { Button } from "@mui/material";
import Offcanvas from "react-bootstrap/Offcanvas";
const mockUsers = [
  {
    id: 1,
    name: "Mark Otto",
    email: "markotto@gmail.com",
    phone: "9999999999",
    location: "New Delhi",
  },
];

const rowsPerPage = 5;

const Users = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const totalPages = Math.ceil(mockUsers.length / rowsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const paginatedUsers = mockUsers.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  return (
    <Paper elevation={3} sx={{ padding: 3 }}>
      <Box>
        <div className="d-flex justify-content-end">
          <Button
            variant="contained"
            color="primary"
            className="mb-3 "
            onClick={handleShow}
          >
            Add User
          </Button>
        </div>
        <Paper className="w-100 table-responsive">
          <Table striped hover>
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone No</th>
                <th>Location</th>
              </tr>
            </thead>
            <tbody>
              {paginatedUsers.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.phone}</td>
                  <td>{user.location}</td>
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
        <Offcanvas show={show} onHide={handleClose} placement={"end"}>
          <Offcanvas.Header closeButton>
            <Offcanvas.Title>Add Your Data</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            Enter your code here
          </Offcanvas.Body>
        </Offcanvas>
      </Box>
    </Paper>
  );
};

export default Users;
