import React, { useEffect, useState, useCallback } from "react";
import { Box, Paper, Chip, Tooltip, Stack } from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import { debounce } from "lodash";
import { LinearProgress } from "@mui/material";
import Switch from "@mui/material/Switch";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
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
import { getAdmin, changeAdminStatus } from "../api/auth";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import Button from "@mui/material/Button";
import AddAdminForm from "./AddAdminForm";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const rowsPerPage = 10;

const headCells = [
  {
    id: "Name",
    numeric: false,
    disablePadding: false,
    label: "name",
    disableSort: true,
  },
  {
    id: "Email",
    numeric: false,
    disablePadding: false,
    label: "email",
    disableSort: true,
  },
  {
    id: "locationName",
    numeric: false,
    disablePadding: false,
    label: "locationName",
    disableSort: true,
  },
  {
    id: "Number",
    numeric: false,
    disablePadding: false,
    label: "Number",
    disableSort: true,
  },
  {
    id: "Status",
    numeric: false,
    disablePadding: false,
    label: "Status",
    disableSort: true,
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

export default function AdminDashboard() {
  const [currentPage, setCurrentPage] = useState(0);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("");
  const [totalData, setTotalData] = useState([]);
  const [openFilter, setOpenFilter] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [filters, setFilters] = useState({});
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const [dateRange, setDateRange] = useState([null, null]);
  const [open, setOpen] = useState(false);
  const [startDate, endDate] = dateRange;
  const [data, setData] = useState([]);
  const [displayedFilters, setDisplayedFilters] = useState({});
  const handleAdmin = async ({ filters }) => {
    setLoading(true);
    try {
      const offset = currentPage * rowsPerPage;
      const limit = rowsPerPage;
      const [sortBy, sortField] = [order === "asc" ? 1 : -1, orderBy];
      const response = await getAdmin(
        token,
        offset,
        limit,
        sortBy,
        sortField,
        filters || {}
      );
      setData(response.data);
      setTotalData(response.total);
      setLoading(false);
    } catch (error) {
      toast.error(error?.response?.data?.message?.[0]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleAdmin({ filters });
  }, [filters, currentPage, order, orderBy]); // Add all dependencies

  const handleToggleStatus = async (videoId) => {
    try {
      const res = await changeAdminStatus(videoId, token);
      toast.success(res.message[0]);
      handleAdmin({ filters });
    } catch (error) {
      toast.error(error.response.data.message[0]);
    }
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handeOpenFilter = () => {
    setOpenFilter(!openFilter);
  };

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
      setDisplayedFilters((prev) => ({
        ...prev,
        [key]: value,
      }));
    }, 2000),
    []
  );

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
      setDisplayedFilters((prev) => ({
        ...prev,
        [key]: value,
      }));
    }, 2000),
    []
  );

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

  useEffect(() => {}, [currentPage]);

  useEffect(() => {
    setCurrentPage(0);
  }, [filters, order, orderBy]);
  console.log(displayedFilters);
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
            <Button
              variant="contained"
              color="primary"
              onClick={handleClickOpen}
              className="rounded-4 d-flex gap-1 flex-row"
            >
              <AddCircleOutlineIcon />
              Admin
            </Button>
            <AddAdminForm
              open={open}
              setOpen={setOpen}
              handleClose={handleClose}
              handleAdmin={handleAdmin}
              filters={filters}
              selectedVideos={[]}
            />
          </div>
        </div>
        {(displayedFilters.name ||
          displayedFilters.email ||
          displayedFilters.locationName ||
          displayedFilters.number) && (
          <Stack direction="row" spacing={1} className="p-3">
            {displayedFilters.name && (
              <Chip
                label={`name: ${displayedFilters?.name}`}
                onDelete={() => {
                  handleFilterChange("name", "");
                  setDisplayedFilters((prev) => ({ ...prev, name: "" }));
                  setFilters((prev) => ({ ...prev, name: undefined }));
                }}
              />
            )}
            {displayedFilters.email && (
              <Chip
                label={`email: ${displayedFilters?.email}`}
                onDelete={() => {
                  handleFilterChange("email", "");
                  setDisplayedFilters((prev) => ({ ...prev, email: "" }));
                  setFilters((prev) => ({ ...prev, email: undefined }));
                }}
              />
            )}
            {displayedFilters.locationName && (
              <Chip
                label={`location: ${displayedFilters?.locationName}`}
                onDelete={() => {
                  handleFilterChange("locationName", "");
                  setDisplayedFilters((prev) => ({ ...prev, locationName: "" }));
                  setFilters((prev) => ({ ...prev, locationName: undefined }));
                }}
              />
            )}
            {displayedFilters.number && (
              <Chip
                label={`Number: ${displayedFilters?.number}`}
               onDelete={() => {
                  handleFilterChange("number", "");
                  setDisplayedFilters((prev) => ({ ...prev, number: "" }));
                  setFilters((prev) => ({ ...prev, number: undefined }));
                }}
              />
            )}
          </Stack>
        )}
        <Paper elevation={3} className="mt-3 max-full-height">
          <TableContainer>
            {loading && <LinearProgress />}
            <Table stickyHeader aria-label="sticky table">
              <EnhancedTableHead
                order={order}
                orderBy={orderBy}
                onRequestSort={handleRequestSort}
              />
              <TableBody>
                {openFilter && (
                  <TableRow>
                    {/* Name filter */}
                    <TableCell>
                      <Form.Control
                        id="filter-name"
                        placeholder="Filter Name"
                        value={inputValue?.name || ""}
                        className="rounded-0 custom-input"
                        onChange={(e) =>
                          handleFilterChange("name", e.target.value)
                        }
                      />
                    </TableCell>

                    {/* Email filter */}
                    <TableCell>
                      <Form.Control
                        id="filter-email"
                        placeholder="Filter Email"
                        value={inputValue?.email || ""}
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

                    {/* Address filter */}
                    <TableCell>
                      <Form.Control
                        id="filter-address"
                        placeholder="Filter Address"
                        value={inputValue?.locationName || ""}
                        className="rounded-0 custom-input"
                        onChange={(e) =>
                          handleFilterChange("locationName", e.target.value)
                        }
                      />
                    </TableCell>

                    {/* Number filter */}
                    <TableCell>
                      <Form.Control
                        id="filter-number"
                        placeholder="Filter Number"
                        value={inputValue?.number || ""}
                        className="rounded-0 custom-input"
                        onChange={(e) =>
                          handleFilterChange("number", e.target.value)
                        }
                      />
                    </TableCell>

                    {/* Status filter */}
                    <TableCell></TableCell>

                    {/* Role filter */}
                    <TableCell></TableCell>
                  </TableRow>
                )}
                {data.map((video, index) => (
                  <TableRow key={video._id || index}>
                    {/* <TableCell>{video.name}</TableCell> */}
                    <TableCell
                      style={{ cursor: "pointer", color: "blue" }}
                      onClick={() => {
                        navigate("/videos", {
                          state: { adminName: video.name },
                        });
                      }}
                    >
                      {video?.name}
                    </TableCell>
                    <TableCell>{video?.email}</TableCell>
                    <TableCell>{video?.locationDetails?.name}</TableCell>
                    <TableCell>{video?.mobile}</TableCell>
                    <TableCell>
                      <FormGroup>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={video?.isActive}
                              onChange={() => handleToggleStatus(video._id)}
                            />
                          }
                          label={video?.isActive ? "Active" : "Inactive"}
                        />
                      </FormGroup>
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
}
