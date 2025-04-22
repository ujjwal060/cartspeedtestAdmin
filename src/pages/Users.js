import React, { useEffect, useState, useCallback } from "react";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import {
  Box,
  Paper,
  Button,
  Dialog,
  DialogContent,
  Slide,
  Chip,
  Tooltip,
  Stack,
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import ReactPlayer from "react-player";
import DeleteIcon from "@mui/icons-material/Delete";
import { debounce } from "lodash";
import { LinearProgress } from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import { toast } from "react-toastify";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import Form from "react-bootstrap/Form";
import { getAllUsers } from "../api/users";

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
    id: "Phone",
    numeric: false,
    disablePadding: false,
    label: "phone",
    disableSort: false,
  },
  {
    id: "Address",
    numeric: false,
    disablePadding: false,
    label: "Address",
    disableSort: true,
  },
  {
    id: "uploadDate",
    numeric: false,
    disablePadding: false,
    label: "Date",
  }
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

const VideoDashboard = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [getVideo, setGetVideo] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("");
  const [totalData, setTotalData] = useState([]);
  const [openFilter, setOpenFilter] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [filters, setFilters] = useState({});
  const today = dayjs().startOf("day");
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");

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
      console.error("Error fetching videos:", error);
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
    fetchVideos();
  }, [currentPage]);

  useEffect(() => {
    setCurrentPage(0);
    fetchVideos();
  }, [filters, order, orderBy]);

  return (
    <Box p={4}>
      <Box>
        <div className="d-flex justify-content-between gap-2 align-items-center pad-root">
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer
              components={["DateRangePicker"]}
              className="d-flex flex-row gap-3"
            >
              <DatePicker
                label="Start Date"
                value={startDate}
                sx={{ width: "200px" }}
                size="small"
                onChange={(newValue) => {
                  setStartDate(newValue);
                  if (endDate && newValue && newValue.isAfter(endDate)) {
                    setEndDate(null);
                  }
                }}
                minDate={today}
              />

              <DatePicker
                label="End Date"
                value={endDate}
                sx={{ width: "200px" }}
                size="small"
                onChange={setEndDate}
                minDate={
                  startDate ? startDate.add(1, "day") : today.add(1, "day")
                }
              />
            </DemoContainer>
          </LocalizationProvider>
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
                    <TableCell>
                      <Form.Control
                        id="filter-state"
                        placeholder="Address"
                        value={inputValue.state}
                        className="rounded-0 custom-input"
                        onChange={(e) =>
                          handleFilterChange("state", e.target.value)
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
                    <TableCell>{video.state}</TableCell>
                    <TableCell>
                      {new Date(video.updatedAt).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[rowsPerPage]}
            component="div"
            className="paginated-custom"
            count={totalData}
            rowsPerPage={rowsPerPage}
            page={currentPage}
            onPageChange={handleChangePage}
          />
        </Paper>
      </Box>
    </Box>
  );
};

export default VideoDashboard;
