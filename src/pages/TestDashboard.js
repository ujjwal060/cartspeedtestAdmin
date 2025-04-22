import React, { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import { Button } from "@mui/material";
import Chip from "@mui/material/Chip";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Accordion from "react-bootstrap/Accordion";
import { getQA } from "../api/test"
import AddTestFormFile from "./AddTestForm"

const TestDashboard = () => {
  const rowsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(0);
  const [filters, setFilters] = useState({});
  const [show, setShow] = useState(false);
  const [filterLevel, setFilterLevel] = React.useState(null);
  const [getData, setGetData] = useState([]);
  const [totalData, setTotalData] = useState([]);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const token = localStorage.getItem("token");

  const fetchQA = async () => {
    const offset = currentPage * rowsPerPage;
    const limit = rowsPerPage;
    try {
      const response = await getQA(
        token,
        offset,
        limit,
        filters
      );
      setGetData(response?.data);
      setTotalData(response?.total);
    } catch (error) {
      console.error("Error fetching videos:", error);
    } finally {
    }
  };

  useEffect(() => {
    fetchQA();
  }, [currentPage]);

  return (
    <Box p={4}>
      <Box>
        <div className="d-flex justify-content-end gap-2">
          <FormControl sx={{ width: "200px" }} size="small">
            <InputLabel id="demo-simple-select-label">
              Filter By Level
            </InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={filterLevel}
              label="Filter By Level"
              onChange={(e) => setFilterLevel(e.target.value)}
              sx={{ height: "40px" }}
            >
              <MenuItem value={1}>easy</MenuItem>
              <MenuItem value={2}>medium</MenuItem>
              <MenuItem value={3}>hard</MenuItem>
            </Select>
          </FormControl>
          <Button
            variant="contained"
            color="primary"
            className="mb-3 "
            onClick={handleShow}
          >
            Add Test
          </Button>
        </div>

        <Accordion
          className="d-flex flex-column gap-3"
          defaultActiveKey="0"
          flush
        >
          {getData?.map((item, index) => (
            <Accordion.Item eventKey={index.toString()} key={item._id}>
              <Accordion.Header>
                Q{index + 1}. {item.question}
              </Accordion.Header>
              <Accordion.Body>
                <div className="row align-items-start">
                  <div className="col-lg-3">
                    <Typography className="text-start" variant="h6">
                      Level: {item.level}
                    </Typography>
                  </div>
                  <div className="col-lg-9">
                    <Typography className="text-end" variant="h6">
                      Location: {item.state}
                    </Typography>
                  </div>

                  <div className="col-lg-6">
                    <div className="row gy-3 align-items-center ps-1 pt-3">
                      {item.options.map((option, optIndex) => (
                        <div className="col-lg-6" key={option._id}>
                          <Typography>
                            {String.fromCharCode(65 + optIndex)}. {option.text}
                          </Typography>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div className="mt-5 d-flex justify-content-end">
                      {item.options.map((option, optIndex) =>
                        option.isCorrect ? (
                          <Chip
                            key={option._id}
                            label={`${String.fromCharCode(65 + optIndex)}. ${option.text}`}
                            color="success"
                          />
                        ) : null
                      )}
                    </div>
                  </div>
                </div>
              </Accordion.Body>
            </Accordion.Item>
          ))}
        </Accordion>
      </Box>
      <AddTestFormFile handleClose={handleClose} show={show} />
    </Box>
  );
};

export default TestDashboard;
