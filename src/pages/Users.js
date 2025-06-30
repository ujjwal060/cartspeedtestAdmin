import React, { useEffect, useState, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { Box, Paper, Chip, Tooltip, Stack } from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import { debounce } from "lodash";
import { LinearProgress } from "@mui/material";
import { toast } from "react-toastify";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import Form from "react-bootstrap/Form";
import { getAllUsers } from "../api/users";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
const rowsPerPage = 10;

const headCells = [
  {
    id: "id",
    numeric: true,
    disablePadding: false,
    label: "S.No",
    disableSort: true,
  },
  {
    id: "Name",
    numeric: false,
    disablePadding: false,
    label: "Name",
    disableSort: true,
  },
  {
    id: "Email",
    numeric: false,
    disablePadding: false,
    label: "Email",
    disableSort: true,
  },
  {
    id: "Phone",
    numeric: false,
    disablePadding: false,
    label: "Phone",
    disableSort: true,
  },
  {
    id: "Address",
    numeric: false,
    disablePadding: false,
    label: "Address",
    disableSort: true,
  },
  {
    id: "updatedAt",
    numeric: false,
    disablePadding: false,
    label: "Date",
    // disableSort: false,
  },
];

function EnhancedTableHead(props) {
  const { order, orderBy, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead className="tableHead-custom tableHead-sticky-custom">
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={"left"}
            padding={headCell.disablePadding ? "none" : "normal"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            {!headCell.disableSort ? (
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : "asc"}
                onClick={createSortHandler(headCell.id)}
              >
                {headCell.label}
                {orderBy === headCell.id ? (
                  <Box component="span" sx={{ display: "none" }}>
                    {order === "desc"
                      ? "sorted descending"
                      : "sorted ascending"}
                  </Box>
                ) : null}
              </TableSortLabel>
            ) : (
              headCell.label
            )}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

const VideoDashboard = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const location = useLocation();
  const { state } = location;
  const [getVideo, setGetVideo] = useState([]);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("");
  const [totalData, setTotalData] = useState([]);
  const [openFilter, setOpenFilter] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [filters, setFilters] = useState({});
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;
  const fetchVideos = async () => {
    const offset = currentPage * rowsPerPage;
    const limit = rowsPerPage;
    const [sortBy, sortField] = [order === "asc" ? 1 : -1, orderBy];
    try {
      setLoading(true);
      const response = await getAllUsers(
        token,
        offset,
        limit,
        sortBy,
        sortField,
        filters
      );

      if (response.status === 200) {
        setGetVideo(response?.data);
        setTotalData(response?.total);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message?.[0]);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handeOpenFilter = () => {
    setOpenFilter(!openFilter);
  };

  const debouncedEmalilFilters = useCallback(
    debounce((key, value) => {
      if (key === "email") {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value) && value !== "") {
          toast.warning("Please enter a valid email address");
          return;
        }
      }
      setFilters((prev) => ({ ...prev, [key]: value }));
    }, 2000),
    []
  );

  const handleChangePage = (_, newPage) => setCurrentPage(newPage);

  const handleFilterChange = (filterName, value) => {
    setInputValue((prev) => ({
      ...prev,
      [filterName]: value,
    }));
    debouncedUpdateFilters(filterName, value);
  };

  const debouncedUpdateFilters = useCallback(
    debounce((key, value) => {
      setFilters((prevFilters) => ({
        ...prevFilters,
        [key]: value,
      }));
    }, 2000),
    []
  );

  useEffect(() => {
    if (state?.startDate && state?.endDate) {
      setDateRange([new Date(state.startDate), new Date(state.endDate)]);
      setFilters((prev) => ({
        ...prev,
        startDate: new Date(state.startDate),
        endDate: new Date(state.endDate),
      }));
    }
  }, [state]); // Run only when `state` changes

  const handleDateChange = (update) => {
    setDateRange(update);

    // Only update filters if BOTH dates are selected
    if (update[0] && update[1]) {
      setFilters((prev) => ({
        ...prev,
        startDate: update[0],
        endDate: update[1],
      }));
    }
    // If either date is missing, remove them from filters
    else if (filters.startDate || filters.endDate) {
      setFilters((prev) => {
        const newFilters = { ...prev };
        delete newFilters.startDate;
        delete newFilters.endDate;
        return newFilters;
      });
    }
  };
  useEffect(() => {
    fetchVideos();
  }, [currentPage]);

  useEffect(() => {
    setCurrentPage(0);
    fetchVideos();
  }, [filters, order, orderBy]);

  console.log(state);

  return (
    <Box>
      <Box>
        <div className="d-flex justify-content-end gap-2 align-items-center pad-root ">
          <div className="custom-picker date-picker-custom-design">
            <CalendarMonthIcon className="svg-custom" />
            <DatePicker
              selectsRange={true}
              startDate={startDate}
              endDate={endDate}
              onChange={handleDateChange}
              isClearable={true}
              placeholderText="Select date range"
              className="form-control"
              maxDate={new Date()}
            />
          </div>

          <div className="d-flex justify-content-end gap-3 align-items-center">
            <Tooltip title="filter">
              <FilterListIcon
                onClick={handeOpenFilter}
                className="text-primary"
                style={{ cursor: "pointer" }}
              />
            </Tooltip>
          </div>
        </div>
        {(inputValue.name ||
          inputValue.email ||
          inputValue.mobile ||
          inputValue.address) && (
          <Stack direction="row" spacing={1}>
            {inputValue.name && (
              <Chip
                label={`name: ${inputValue.name}`}
                onDelete={() => handleFilterChange("name", "")}
              />
            )}
            {inputValue.email && (
              <Chip
                label={`email: ${inputValue.email}`}
                onDelete={() => handleFilterChange("email", "")}
              />
            )}
            {inputValue.mobile && (
              <Chip
                label={`phone: ${inputValue.mobile}`}
                onDelete={() => handleFilterChange("mobile", "")}
              />
            )}
            {inputValue.address && (
              <Chip
                label={`Address: ${inputValue.address}`}
                onDelete={() => handleFilterChange("address", "")}
              />
            )}
          </Stack>
        )}
        <Paper elevation={3} className="mt-3 max-full-height">
          <TableContainer>
            {loading && <LinearProgress />}
            <Table>
              <EnhancedTableHead
                order={order}
                orderBy={orderBy}
                onRequestSort={handleRequestSort}
              />
              <TableBody>
                {openFilter && (
                  <TableRow>
                    <TableCell></TableCell>
                    <TableCell>
                      <Form.Control
                        id="filter-name"
                        placeholder="Name"
                        value={inputValue.name}
                        className="rounded-0 custom-input"
                        onChange={(e) =>
                          handleFilterChange("name", e.target.value)
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <Form.Control
                        id="filter-email"
                        placeholder="Email"
                        value={inputValue.email}
                        className="rounded-0 custom-input"
                          onChange={(e) => {
                            setInputValue((prev) => ({
                              ...prev,
                              email: e.target.value,
                            }));
                            debouncedEmalilFilters("email", e.target.value);
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Form.Control
                        id="filter-mobile"
                        placeholder="Phone"
                        value={inputValue.mobile}
                        className="rounded-0 custom-input"
                        onChange={(e) =>
                          handleFilterChange("mobile", e.target.value)
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <Form.Control
                        id="filter-state"
                        placeholder="Address"
                        value={inputValue.address}
                        className="rounded-0 custom-input"
                        onChange={(e) =>
                          handleFilterChange("address", e.target.value)
                        }
                      />
                    </TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                )}
                {getVideo.map((video, index) => (
                  <TableRow key={video._id || index}>
                    <TableCell>
                      {currentPage * rowsPerPage + index + 1}
                    </TableCell>
                    <TableCell>{video.name}</TableCell>
                    <TableCell>{video.email}</TableCell>
                    <TableCell>{video.mobile}</TableCell>
                    <TableCell>{video.address}</TableCell>
                    <TableCell>
                      {new Date(video.updatedAt).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
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
    </Box>
  );
};

export default VideoDashboard;
