import React, { useEffect, useState, useCallback } from "react";
import { Box, Paper, Chip, Tooltip, Stack } from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import { debounce } from "lodash";
import { LinearProgress } from "@mui/material";
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
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import VisibilityIcon from "@mui/icons-material/Visibility";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from "react-router-dom";

const rowsPerPage = 10;

const headCells = [
  {
    id: "name",
    numeric: false,
    disablePadding: false,
    label: "Name",
  },
  {
    id: "email",
    numeric: false,
    disablePadding: false,
    label: "Email",
    disableSort: false,
  },
  {
    id: "address",
    numeric: false,
    disablePadding: false,
    label: "Address",
    disableSort: true,
  },
  {
    id: "duration",
    numeric: false,
    disablePadding: false,
    label: "Duration",
  },
  {
    id: "section",
    numeric: true,
    disablePadding: false,
    label: "Section",
  },
  {
    id: "testTaken",
    numeric: true,
    disablePadding: false,
    label: "Test Taken",
  },
  {
    id: "result",
    numeric: false,
    disablePadding: false,
    label: "Result",
  },
  {
    id: "view",
    numeric: false,
    disablePadding: false,
    label: "View Detail",
    disableSort: true,
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

const TestDashboard = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("");
  const [openFilter, setOpenFilter] = useState(false);
  const [inputValue, setInputValue] = useState({});
  const [filters, setFilters] = useState({});
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const [data, setData] = useState([
    {
      id: 1,
      name: "Daksh",
      email: "daksh@example.com",
      address: "Lucknow",
      duration: "05:00",
      section: 2,
      testTaken: "3/5",
      result: "Pass",
    },
    {
      id: 2,
      name: "Hello",
      email: "hello@example.com",
      address: "Delhi",
      duration: "09:00",
      section: 1,
      testTaken: "2/5",
      result: "Failed",
    },
    {
      id: 3,
      name: "Test User",
      email: "test@example.com",
      address: "Mumbai",
      duration: "07:30",
      section: 3,
      testTaken: "4/5",
      result: "Pass",
    },
  ]);

  // Filter and sort data
  const filteredData = data.filter((item) => {
    // Search term filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        item.name.toLowerCase().includes(searchLower) ||
        item.email.toLowerCase().includes(searchLower) ||
        item.address.toLowerCase().includes(searchLower) ||
        item.result.toLowerCase().includes(searchLower)
      );
    }

    // Other filters
    if (
      filters.name &&
      !item.name.toLowerCase().includes(filters.name.toLowerCase())
    ) {
      return false;
    }
    if (
      filters.email &&
      !item.email.toLowerCase().includes(filters.email.toLowerCase())
    ) {
      return false;
    }
    if (
      filters.result &&
      !item.result.toLowerCase().includes(filters.result.toLowerCase())
    ) {
      return false;
    }

    // Date range filter
    if (filters.startDate || filters.endDate) {
    }

    return true;
  });

  // Sort data
  const sortedData = React.useMemo(() => {
    return [...filteredData].sort((a, b) => {
      if (orderBy) {
        const aValue = a[orderBy];
        const bValue = b[orderBy];

        if (typeof aValue === "string" && typeof bValue === "string") {
          return order === "asc"
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        } else {
          return order === "asc" ? aValue - bValue : bValue - aValue;
        }
      }
      return 0;
    });
  }, [filteredData, order, orderBy]);

  // Pagination
  const paginatedData = sortedData.slice(
    currentPage * rowsPerPage,
    currentPage * rowsPerPage + rowsPerPage
  );

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
      setCurrentPage(0); // Reset to first page when filters change
    }, 500),
    []
  );

  const handleDateChange = (update) => {
    setDateRange(update);
    setFilters((prev) => ({
      ...prev,
      startDate: update[0],
      endDate: update[1],
    }));
    setCurrentPage(0);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(0);
  };

  return (
    <Box p={4}>
      <Box>
        <div className="d-flex justify-content-end align-items-center mb-3">
          <div className="d-flex justify-content-end gap-2 align-items-center">
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

            <Tooltip title="Filter">
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
            <Stack direction="row" spacing={1} className="p-3">
              {inputValue.name && (
                <Chip
                  label={`Name: ${inputValue.name}`}
                  onDelete={() => handleFilterChange("name", "")}
                />
              )}
              {inputValue.email && (
                <Chip
                  label={`Email: ${inputValue.email}`}
                  onDelete={() => handleFilterChange("email", "")}
                />
              )}
              {inputValue.result && (
                <Chip
                  label={`Result: ${inputValue.result}`}
                  onDelete={() => handleFilterChange("result", "")}
                />
              )}
            </Stack>

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
                    <TableCell>
                      <Form.Control
                        id="filter-name"
                        placeholder="Name"
                        value={inputValue.name || ""}
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
                        value={inputValue.email || ""}
                        className="rounded-0 custom-input"
                        onChange={(e) =>
                          handleFilterChange("email", e.target.value)
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <Form.Control
                        id="filter-result"
                        placeholder="Result"
                        value={inputValue.result || ""}
                        className="rounded-0 custom-input"
                        onChange={(e) =>
                          handleFilterChange("result", e.target.value)
                        }
                      />
                    </TableCell>
                    <TableCell colSpan={5}></TableCell>
                  </TableRow>
                )}

                {paginatedData.length > 0 ? (
                  paginatedData.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.email}</TableCell>
                      <TableCell>{item.address}</TableCell>
                      <TableCell>{item.duration}</TableCell>
                      <TableCell>{item.section}</TableCell>
                      <TableCell>{item.testTaken}</TableCell>
                      <TableCell>{item.result}</TableCell>
                      <TableCell>
                        <Tooltip title="View details">
                          <VisibilityIcon
                            onClick={() => navigate(`/test-detail/${item.id}`)}
                            className="text-success"
                            style={{ cursor: "pointer" }}
                          />
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} align="center">
                      No records found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
        <TablePagination
          rowsPerPageOptions={[rowsPerPage]}
          component="div"
          className="paginated-custom"
          count={filteredData.length}
          rowsPerPage={rowsPerPage}
          page={currentPage}
          onPageChange={handleChangePage}
        />
      </Box>
    </Box>
  );
};

export default TestDashboard;
