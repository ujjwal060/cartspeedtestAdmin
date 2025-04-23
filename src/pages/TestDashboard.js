import React, { useState, useEffect } from "react";
import { Box, Tooltip, Typography } from "@mui/material";
import { Button } from "@mui/material";
import Chip from "@mui/material/Chip";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Accordion from "react-bootstrap/Accordion";
import { getQA } from "../api/test";
import AddTestFormFile from "./AddTestForm";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import TablePagination from "@mui/material/TablePagination";
import "../components/css/accordion-level-styles.css";
import FilterListIcon from "@mui/icons-material/FilterList";
import LocationPinIcon from "@mui/icons-material/LocationPin";
import "../index.css";
import Loader from "../components/Loader";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
const TestDashboard = () => {
  const rowsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(0);
  const [filters, setFilters] = useState({});
  const [show, setShow] = useState(false);
  const [getData, setGetData] = useState([]);
  const [totalData, setTotalData] = useState([]);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [loading, setLoading] = useState(false);
  const [openFilter, setOpenFilter] = useState(false);
  const token = localStorage.getItem("token");
  const [level, setLevel] = useState("");
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;

  const fetchQA = async () => {
    const offset = currentPage * rowsPerPage;
    const limit = rowsPerPage;
    setLoading(true);
    try {
      const response = await getQA(token, offset, limit, filters);
      setGetData(response?.data);
      setTotalData(response?.total);
    } catch (error) {
      console.error("Error fetching videos:", error);
    } finally {
      setLoading(false);
    }
  };
  const handleChangePage = (_, newPage) => setCurrentPage(newPage);

  const handeOpenFilter = () => {
    setOpenFilter(!openFilter);
    if (openFilter) {
      setFilters({});
    }
  };

  const handleLevelChange = (event) => {
    const selectedLevel = event.target.value;
    setLevel(selectedLevel);
    setFilters((prev) => ({ ...prev, level: selectedLevel }));
  };

  const handleDateChange = (update) => {
    setDateRange(update);
    setFilters((prev) => ({
      ...prev,
      startDate: update[0],
      endDate: update[1]
    }));
  };
  
  useEffect(() => {
    fetchQA();
  }, [currentPage, filters]);

  return (
    <Box p={4}>
      <Box>
        <div className="position-sticky top-0 d-flex justify-content-end gap-2 mb-4 align-items-center">
          {openFilter && (
            <>
              {/* <FormControl sx={{ width: "200px" }} size="small">
                <InputLabel id="demo-simple-select-label">
                  Filter By Location
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={level}
                  label=" Filter By Location"
                  // onChange={(e) => setFilterLevel(e.target.value)}
                  sx={{ height: "40px" }}
                >
                  <MenuItem value={1}>Delhi</MenuItem>
                </Select>
              </FormControl> */}
              <FormControl sx={{ width: "200px" }} size="small">
                <InputLabel id="demo-simple-select-label">
                  Filter By Level
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={level}
                  label="Filter By Level"
                  onChange={handleLevelChange}
                  sx={{ height: "40px" }}
                >
                  <MenuItem value={"Easy"}>Easy</MenuItem>
                  <MenuItem value={"Medium"}>Medium</MenuItem>
                  <MenuItem value={"Hard"}>Hard</MenuItem>
                </Select>
              </FormControl>
            </>
          )}
          <Tooltip title="filter">
            <FilterListIcon
              onClick={handeOpenFilter}
              className="text-primary"
              style={{ cursor: "pointer" }}
            />
          </Tooltip>
          <Button
            variant="contained"
            color="primary"
            className="rounded-4 d-flex gap-1 flex-row "
            onClick={handleShow}
          >
            <AddCircleOutlineIcon />
            Assessment
          </Button>
        </div>

        <Accordion className="d-flex flex-column gap-3 custom-accordion" flush>
          {loading === true ? (
            <div className="update-loader">
              <Loader />
            </div>
          ) : (
            getData?.map((item, index) => (
              <Accordion.Item eventKey={index.toString()} key={item._id}>
                <Accordion.Header
                  className={`accordion-button p-0 ${item.level?.toLowerCase()}`}
                >
                  Q{currentPage * rowsPerPage + index + 1}. {item.question}
                </Accordion.Header>
                <Accordion.Body>
                  <div className="row align-items-start">
                    <div className="col-lg-3">
                      <div className="d-flex justify-content-start gap-1 align-items-center">
                        <Typography className="text-end" variant="h6">
                          Lv:
                        </Typography>
                        <span className="fs-6">{item.level}</span>
                      </div>
                    </div>
                    <div className="col-lg-9">
                      <div className="d-flex justify-content-end gap-1 align-items-center">
                        <Typography className="text-end" variant="h6">
                          <LocationPinIcon />
                        </Typography>
                        <span className="fs-6">{item.state}</span>
                      </div>
                    </div>

                    <div className="col-lg-6">
                      <div className="row gy-3 align-items-center ps-1 pt-3">
                        {item.options.map((option, optIndex) => (
                          <div className="col-lg-6" key={option._id}>
                            <Typography>
                              {String.fromCharCode(65 + optIndex)}.{" "}
                              {option.text}
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
                              label={`${String.fromCharCode(65 + optIndex)}. ${
                                option.text
                              }`}
                              color="success"
                            />
                          ) : null
                        )}
                      </div>
                    </div>
                  </div>
                </Accordion.Body>
              </Accordion.Item>
            ))
          )}
        </Accordion>
        <TablePagination
          rowsPerPageOptions={[rowsPerPage]}
          component="div"
          className="paginated-custom"
          count={totalData}
          rowsPerPage={rowsPerPage}
          page={currentPage}
          onPageChange={handleChangePage}
        />
      </Box>
      <AddTestFormFile handleClose={handleClose} show={show} />
    </Box>
  );
};

export default TestDashboard;
