import React, { useState, useCallback } from "react";
import {
  Box,
  Paper,
  Chip,
  Tooltip,
  Stack,
  Modal,
  Typography,
  Button,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TableSortLabel,
  TextField,
  InputAdornment,
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import { debounce } from "lodash";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import Form from "react-bootstrap/Form";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import VisibilityIcon from "@mui/icons-material/Visibility";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";

const rowsPerPage = 10;

const headCells = [
  {
    id: "username",
    numeric: false,
    disablePadding: false,
    label: "Username",
  },
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
    id: "attemptedQuestions",
    numeric: true,
    disablePadding: false,
    label: "Attempted Qs",
  },
  {
    id: "totalQuestions",
    numeric: true,
    disablePadding: false,
    label: "Total Qs",
  },
  {
    id: "status",
    numeric: false,
    disablePadding: false,
    label: "Status",
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
    label: "Actions",
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

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "80%",
  maxWidth: 800,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 3,
  borderRadius: 2,
  display: "flex",
  flexDirection: "column",
  maxHeight: "90vh",
};
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
  const [openModal, setOpenModal] = useState(false);
  const [selectedTest, setSelectedTest] = useState(null);

  const [data, setData] = useState([
    {
      id: 1,
      username: "daksh123",
      name: "Daksh Sharma",
      email: "daksh@example.com",
      attemptedQuestions: 3,
      totalQuestions: 4,
      status: "Completed",
      result: "Pass",
      questions: [
        {
          id: 1,
          question: "testing here",
          level: "Medium",
          optionA: "tes",
          optionB: "divya",
          optionC: "nsadvs",
          optionD: "sadsf",
          correctAnswer: "B",
          userAnswer: "B",
          isCorrect: true,
        },
        {
          id: 2,
          question: "What is the capital of India?",
          optionA: "Mumbai",
          optionB: "Delhi",
          optionC: "Kolkata",
          optionD: "Chennai",
          correctAnswer: "B",
          userAnswer: "B",
          isCorrect: true,
        },
        {
          id: 3,
          question: "What is the largest planet in our solar system?",
          optionA: "Earth",
          optionB: "Mars",
          optionC: "Jupiter",
          optionD: "Saturn",
          correctAnswer: "C",
          userAnswer: "C",
          isCorrect: true,
        },
        {
          id: 4,
          question: "for testing purpose",
          optionA: "hightgh",
          optionB: "sadsf",
          optionC: "nsadvs",
          optionD: "divya",
          correctAnswer: "A",
          userAnswer: "A",
          isCorrect: true,
        },
      ],
    },
    {
      id: 2,
      username: "testuser456",
      name: "Test User",
      email: "test@example.com",
      attemptedQuestions: 2,
      totalQuestions: 4,
      status: "In Progress",
      result: "Fail",
      questions: [
        {
          id: 1,
          question: "testing here",
          level: "Medium",
          optionA: "tes",
          optionB: "divya",
          optionC: "nsadvs",
          optionD: "sadsf",
          correctAnswer: "B",
          userAnswer: "A",
          isCorrect: false,
        },
        {
          id: 2,
          question: "What is the capital of India?",
          optionA: "Mumbai",
          optionB: "Delhi",
          optionC: "Kolkata",
          optionD: "Chennai",
          correctAnswer: "B",
          userAnswer: "",
          isCorrect: false,
        },
      ],
    },
  ]);

  // Filter and sort data
  const filteredData = data.filter((item) => {
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        item.name.toLowerCase().includes(searchLower) ||
        item.email.toLowerCase().includes(searchLower) ||
        item.username.toLowerCase().includes(searchLower) ||
        item.result.toLowerCase().includes(searchLower) ||
        item.status.toLowerCase().includes(searchLower)
      );
    }

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
    if (
      filters.status &&
      !item.status.toLowerCase().includes(filters.status.toLowerCase())
    ) {
      return false;
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
      setCurrentPage(0);
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

  const handleOpenModal = (test) => {
    setSelectedTest(test);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedTest(null);
  };

  return (
    <Box>
      <Box>
        <div className="d-flex justify-content-end align-items-center mb-2">
          <div className="d-flex justify-content-end gap-2 align-items-center">
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

            <Tooltip title="Filter">
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
          inputValue.result ||
          inputValue.status) && (
          <>
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
              {inputValue.status && (
                <Chip
                  label={`Status: ${inputValue.status}`}
                  onDelete={() => handleFilterChange("status", "")}
                />
              )}
            </Stack>
          </>
        )}

        <Paper elevation={3} className="mt-3 ">
          <TableContainer className="max-full-height">
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
                        placeholder=" Name"
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
                        placeholder=" Email"
                        value={inputValue.email || ""}
                        className="rounded-0 custom-input"
                        onChange={(e) =>
                          handleFilterChange("email", e.target.value)
                        }
                      />
                    </TableCell>

                    <TableCell></TableCell>

                    <TableCell></TableCell>

                    <TableCell>
                      <Form.Control
                        id="filter-status"
                        placeholder=" Status"
                        value={inputValue.status || ""}
                        className="rounded-0 custom-input"
                        onChange={(e) =>
                          handleFilterChange("status", e.target.value)
                        }
                      />
                    </TableCell>

                    <TableCell>
                      <Form.Control
                        id="filter-result"
                        placeholder=" Result"
                        value={inputValue.result || ""}
                        className="rounded-0 custom-input"
                        onChange={(e) =>
                          handleFilterChange("result", e.target.value)
                        }
                      />
                    </TableCell>

                    <TableCell></TableCell>
                  </TableRow>
                )}

                {paginatedData.length > 0 ? (
                  paginatedData.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.username}</TableCell>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.email}</TableCell>
                      <TableCell>{item.attemptedQuestions}</TableCell>
                      <TableCell>{item.totalQuestions}</TableCell>
                      <TableCell>
                        <Chip
                          label={item.status}
                          color={
                            item.status === "Completed" ? "success" : "warning"
                          }
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={item.result}
                          color={item.result === "Pass" ? "success" : "error"}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Tooltip title="View details">
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={() => handleOpenModal(item)}
                            startIcon={<VisibilityIcon fontSize="small" />}
                            sx={{
                              borderRadius: "20px",
                              textTransform: "none",
                              padding: "4px 10px",
                              fontSize: "0.75rem",
                              minWidth: 0,
                              lineHeight: 1.5,

                              backgroundColor: "#2e7d32",
                              color: "#fff",
                            }}
                          >
                            View
                          </Button>
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

      {/* Modal for viewing test details */}
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="test-details-modal"
        aria-describedby="test-questions-and-answers"
      >
        <Box sx={modalStyle}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={3}
          >
            <Typography variant="h5" component="h2" fontWeight="bold">
              Test Review - {selectedTest?.name}
            </Typography>
            <Button onClick={handleCloseModal} color="inherit">
              <CloseIcon />
            </Button>
          </Box>

          {selectedTest && (
            <>
              <Box
                mb={4}
                p={2}
                sx={{ backgroundColor: "#f5f5f5", borderRadius: 2 }}
              >
                <Stack direction="row" spacing={3} flexWrap="wrap">
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Score
                    </Typography>
                    <Typography fontWeight="bold">
                      {selectedTest.attemptedQuestions}/
                      {selectedTest.totalQuestions}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Status
                    </Typography>
                    <Chip
                      label={selectedTest.status}
                      color={
                        selectedTest.status === "Completed"
                          ? "success"
                          : "warning"
                      }
                      size="small"
                    />
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Result
                    </Typography>
                    <Chip
                      label={selectedTest.result}
                      color={
                        selectedTest.result === "Pass" ? "success" : "error"
                      }
                      size="small"
                    />
                  </Box>
                </Stack>
              </Box>

              <Box sx={{ maxHeight: "60vh", overflowY: "auto", pr: 1 }}>
                {selectedTest.questions.map((q, index) => (
                  <Box
                    key={q.id}
                    mb={4}
                    sx={{
                      border: "1px solid #e0e0e0",
                      borderRadius: 2,
                      p: 2,
                      backgroundColor: "#fff",
                    }}
                  >
                    <Typography variant="h6" fontWeight="bold" mb={1}>
                      Q{index + 1}. {q.question}
                    </Typography>

                    {q.level && (
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        mb={2}
                        display="block"
                      >
                        Level: {q.level}
                      </Typography>
                    )}

                    {/* Options */}
                    <Box mb={2}>
                      {["A", "B", "C", "D"].map(
                        (option) =>
                          q[`option${option}`] && (
                            <Box
                              key={option}
                              display="flex"
                              alignItems="center"
                              mb={1}
                            >
                              <Box
                                sx={{
                                  width: 24,
                                  height: 24,
                                  borderRadius: "50%",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  mr: 1,
                                  backgroundColor:
                                    q.correctAnswer === option
                                      ? "#4caf50"
                                      : q.userAnswer === option && !q.isCorrect
                                      ? "#f44336"
                                      : "#e0e0e0",
                                  color:
                                    q.correctAnswer === option ||
                                    (q.userAnswer === option && !q.isCorrect)
                                      ? "#fff"
                                      : "#000",
                                }}
                              >
                                {option}
                              </Box>
                              <Typography>{q[`option${option}`]}</Typography>
                            </Box>
                          )
                      )}
                    </Box>

                    {/* User's answer and correct answer */}
                    <Box mt={2} pt={2} borderTop="1px dashed #e0e0e0">
                      <Box mb={1}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Your Answer:
                        </Typography>
                        <Typography
                          sx={{
                            p: 1,
                            backgroundColor: q.isCorrect
                              ? "#e8f5e9"
                              : "#ffebee",
                            borderRadius: 1,
                            borderLeft: `3px solid ${
                              q.isCorrect ? "#4caf50" : "#f44336"
                            }`,
                          }}
                        >
                          {q.userAnswer || "Not answered"}
                        </Typography>
                      </Box>

                      {!q.isCorrect && (
                        <Box>
                          <Typography
                            variant="subtitle2"
                            color="text.secondary"
                          >
                            Correct Answer:
                          </Typography>
                          <Typography
                            sx={{
                              p: 1,
                              backgroundColor: "#e8f5e9",
                              borderRadius: 1,
                              borderLeft: "3px solid #4caf50",
                            }}
                          >
                            {q.correctAnswer}
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  </Box>
                ))}
              </Box>

              <Box
                mt={3}
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography variant="body2" color="text.secondary">
                  Showing {selectedTest.questions.length} of{" "}
                  {selectedTest.questions.length} questions
                </Typography>
              </Box>
            </>
          )}
        </Box>
      </Modal>
    </Box>
  );
};

export default TestDashboard;
