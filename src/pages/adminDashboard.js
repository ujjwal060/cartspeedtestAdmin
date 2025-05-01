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
import { getAdmin } from "../api/auth";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import Button from "@mui/material/Button";
import AddAdminForm from "./AddAdminForm";
import { toast } from "react-toastify";
const rowsPerPage = 10;

const headCells = [
  {
    id: "Name",
    numeric: false,
    disablePadding: false,
    label: "name",
  },
  {
    id: "Email",
    numeric: false,
    disablePadding: false,
    label: "email",
    disableSort: false,
  },
  {
    id: "Address",
    numeric: false,
    disablePadding: false,
    label: "Address",
    disableSort: false,
  },
  {
    id: "Number",
    numeric: false,
    disablePadding: false,
    label: "Number",
  },
  {
    id: "Status",
    numeric: false,
    disablePadding: false,
    label: "Status",
  },
  {
    id: "Role",
    numeric: false,
    disablePadding: false,
    label: "Role",
  },
];

function EnhancedTableHead(props) {
  const { order, orderBy, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead className="tableHead-custom">
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
  const [open, setOpen] = useState(false);
  const [startDate, endDate] = dateRange;
  const [data, setData] = useState([]);

  const handleAdmin = async () => {
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
        filters
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
    handleAdmin();
  }, []);

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
    }, 2000),
    []
  );

  const handleDateChange = (update) => {
    setDateRange(update);
    setFilters((prev) => ({
      ...prev,
      startDate: update[0],
      endDate: update[1],
    }));
  };

  useEffect(() => {
    // fetchVideos();
  }, [currentPage]);

  useEffect(() => {
    setCurrentPage(0);
    // fetchVideos();
  }, [filters, order, orderBy]);
  return (
    <Box p={4}>
      <Box>
        <div className="d-flex justify-content-end gap-2 align-items-center pad-root ">
          <div className="custom-picker">
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
              selectedVideos={[]}
              //   videoFiles={videoFiles}
              //   setVideoFiles={setVideoFiles}
              //   deleteUploadedVideo={deleteUploadedVideo}
              //   onVideoUploaded={fetchVideos}
            />
          </div>
        </div>
        <Paper elevation={3} className="mt-3">
          <TableContainer>
            {
              <Stack direction="row" spacing={1} className="p-3">
                {inputValue.title && (
                  <Chip
                    label={`name: ${inputValue.name}`}
                    onDelete={() => handleFilterChange("name", "")}
                  />
                )}
                {inputValue.email && (
                  <Chip
                    label={`Desc: ${inputValue.email}`}
                    onDelete={() => handleFilterChange("email", "")}
                  />
                )}
                {inputValue.mobile && (
                  <Chip
                    label={`phone: ${inputValue.locationState}`}
                    onDelete={() => handleFilterChange("mobile", "")}
                  />
                )}
                {inputValue.state && (
                  <Chip
                    label={`Uploaded By: ${inputValue.state}`}
                    onDelete={() => handleFilterChange("state", "")}
                  />
                )}
              </Stack>
            }
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
                        onChange={(e) =>
                          handleFilterChange("email", e.target.value)
                        }
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
                  </TableRow>
                )}
                {data.map((video, index) => (
                  <TableRow key={video._id || index}>
                    <TableCell>{video.name}</TableCell>
                    <TableCell>{video.email}</TableCell>
                    <TableCell>{video.locationDetails.name}</TableCell>
                    <TableCell>{video.mobile}</TableCell>
                    <TableCell>
                      <FormGroup>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={video.isActive}
                              onChange={() => {
                                // Add your status change handler here
                              }}
                            />
                          }
                          label={video.isActive ? "Active" : "Inactive"}
                        />
                      </FormGroup>
                    </TableCell>
                    <TableCell>{video.role}</TableCell>
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
