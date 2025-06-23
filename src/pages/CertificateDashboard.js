import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  InputAdornment,
  MenuItem,
  Paper,
  Stack,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  CircularProgress,
  TablePagination,
  Chip,
  LinearProgress,
  IconButton,
} from "@mui/material";
import DatePicker from "react-datepicker";
import CardActionArea from "@mui/material/CardActionArea";

import { debounce } from "lodash";
import "react-datepicker/dist/react-datepicker.css";
import {
  Search as SearchIcon,
  Visibility as VisibilityIcon,
  Block as BlockIcon,
  Refresh as RefreshIcon,
} from "@mui/icons-material";
import FilterListIcon from "@mui/icons-material/FilterList";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import Form from "react-bootstrap/Form";
import axios from "../api/axios";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import { fetchCertificates } from "../api/certificate";
import TableSortLabel from "@mui/material/TableSortLabel";
import { toast } from "react-toastify";
export default function CertificateDashboard() {
  const rowsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(0);

  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const navigate = useNavigate();
  const userRole = localStorage.getItem("role");
  const [open, setOpen] = React.useState(false);
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [openFilter, setOpenFilter] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("");
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;
  const [filters, setFilters] = useState({});
  const [totalData, setTotalData] = useState([]);
  const [activeFilters, setActiveFilters] = useState({});
  const handleClickOpen = (certificate) => {
    setSelectedCertificate(certificate);
    setOpen(true);
  };

  const HeadCell = [
    {
      id: "Certificate ID",
      numeric: false,
      disablePadding: false,
      label: "Certificate ID",
    },
    {
      id: "Certificate Name",
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
    ...(userRole === "superAdmin"
      ? [
          {
            id: "Location",
            numeric: false,
            disablePadding: false,
            label: " Location",
            disableSort: true,
          },
        ]
      : []),

    {
      id: "Issue Date",
      numeric: false,
      disablePadding: false,
      label: "Issue Date",
    },
    {
      id: "Expiry Date",
      numeric: false,
      disablePadding: false,
      label: "Expiry Date",
    },
    {
      id: "Status",
      numeric: true,
      disablePadding: false,
      label: "Status",
      disableSort: true,
    },
    {
      id: "actions",
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
      <TableHead className="tableHead-custom tableHead-sticky-custom">
        <TableRow>
          {HeadCell.map((headCell) => (
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

  const handleClose = () => {
    setOpen(false);
    setSelectedCertificate(null);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleFilterChange = (filterName, value) => {
    setInputValue((prev) => ({
      ...prev,
      [filterName]: value,
    }));
    debouncedUpdateFilters(filterName, value);
  };

  const handleStatusFilter = (status) => {
    if (filters.status === status) {
      // If clicking the same status again, remove the filter
      handleFilterChange("status", "");
    } else {
      handleFilterChange("status", status);
    }
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

  const handleTotalClick = () => {
    // Remove status filter when Total is clicked
    if (filters.status) {
      handleFilterChange("status", "");
    }
    handleCertificates();
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

  const handleChangePage = (_, newPage) => setCurrentPage(newPage);

  const handleCertificates = async () => {
    try {
      setLoading(true);
      const offset = currentPage * rowsPerPage;
      const limit = rowsPerPage;
      const [sortBy, sortField] = [order === "asc" ? 1 : -1, orderBy];
      const response = await fetchCertificates(
        token,
        filters,
        offset,
        limit,
        sortBy,
        sortField
      );

      setCertificates(response);
      setTotalData(response?.total);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching certificates:", error);
      setLoading(false);
    }
  };
  useEffect(() => {
    // Reset to first page when filters change
    setCurrentPage(0);
    handleCertificates();
  }, [filters, order, orderBy]);

  useEffect(() => {
    handleCertificates();
  }, [currentPage]);

  const handeOpenFilter = () => {
    setOpenFilter(!openFilter);
  };

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

  console.log(inputValue);

  return (
    <>
      <Box>
        {
          <Stack
            direction="row"
            spacing={1}
            sx={{ mb: 2, flexWrap: "wrap", gap: 1 }}
          >
            {inputValue.certificateNumber && (
              <Chip
                label={`Certificate: CERT-${inputValue.certificateNumber}`}
                onDelete={() => handleFilterChange("certificateNumber", "")}
                variant="outlined"
              />
            )}
            {inputValue.certificateName && (
              <Chip
                label={`Name: ${inputValue.certificateName}`}
                onDelete={() => handleFilterChange("certificateName", "")}
                variant="outlined"
              />
            )}
            {inputValue.email && (
              <Chip
                label={`Email: ${inputValue.email}`}
                onDelete={() => handleFilterChange("email", "")}
                variant="outlined"
              />
            )}
            {inputValue.locationName && (
              <Chip
                label={`Location: ${inputValue.locationName}`}
                onDelete={() => handleFilterChange("locationName", "")}
                variant="outlined"
              />
            )}
            {inputValue.status && (
              <Chip
                label={`Status: ${inputValue.status}`}
                onDelete={() => handleFilterChange("status", "")}
                variant="outlined"
              />
            )}
            {(inputValue.startDate || inputValue.endDate) && (
              <Chip
                label={`Date: ${
                  inputValue.startDate
                    ? new Date(inputValue.startDate).toLocaleDateString()
                    : ""
                } - ${
                  inputValue.endDate
                    ? new Date(inputValue.endDate).toLocaleDateString()
                    : ""
                }`}
                onDelete={() => {
                  setDateRange([null, null]);
                  handleFilterChange("startDate", "");
                  handleFilterChange("endDate", "");
                }}
                variant="outlined"
              />
            )}
          </Stack>
        }
        <div className="row gy-3 mb-4 align-items-center">
          <div className="col-md-3">
            <Card
              sx={{ bgcolor: "#e3f2fd" }}
              onClick={handleTotalClick} // Changed to use handleTotalClick
            >
              <CardActionArea>
                <CardContent>
                  <Typography color="text.secondary" gutterBottom>
                    Total
                  </Typography>
                  <Typography variant="h4" color="primary">
                    {certificates?.totalCertificate}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </div>

          <div className="col-md-3">
            <Card
              sx={{ bgcolor: "#e8f5e9" }}
              onClick={() => handleStatusFilter("Active")} // Keep using handleStatusFilter
            >
              <CardActionArea>
                <CardContent>
                  <Typography color="text.secondary" gutterBottom>
                    Active
                  </Typography>
                  <Typography variant="h4" color="success.main">
                    {certificates?.totalActive}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </div>

          <div className="col-md-3">
            <Card
              sx={{ bgcolor: "#ffebee" }}
              onClick={() => handleStatusFilter("Expired")} // Keep using handleStatusFilter
            >
              <CardActionArea>
                <CardContent>
                  <Typography color="text.secondary" gutterBottom>
                    Expired
                  </Typography>
                  <Typography variant="h4" color="error.main">
                    {certificates?.totalExpired}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </div>

          <div className="col-md-3">
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                justifyContent: "end",
                gap: 2,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  width: "100%",
                }}
              >
                <Box className="custom-picker date-picker-custom-design">
                  <CalendarMonthIcon className="svg-custom" />
                  <DatePicker
                    selectsRange
                    startDate={startDate}
                    endDate={endDate}
                    onChange={handleDateChange}
                    isClearable
                    placeholderText="Select date range"
                    className="form-control"
                    maxDate={new Date()}
                  />
                </Box>
                <FilterListIcon
                  onClick={handeOpenFilter}
                  color="primary"
                  style={{ cursor: "pointer" }}
                />
              </Box>
            </Box>
          </div>
        </div>

        {/* Search and Filter */}

        <Paper className="max-full-height-2">
          {/* Table */}
          {loading ? (
            <LinearProgress />
          ) : (
            <TableContainer>
              <Table stickyHeader aria-label="sticky table">
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
                          placeholder="Certificate Number"
                          value={
                            inputValue?.certificateNumber
                              ? `CERT-${inputValue.certificateNumber}`
                              : "CERT-"
                          }
                          className="rounded-0 custom-input"
                          onChange={(e) => {
                            const rawValue = e.target.value
                              .replace(/^CERT-/, "")
                              .replace(/[^0-9]/g, "");
                            handleFilterChange("certificateNumber", rawValue);
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Form.Control
                          placeholder="Certificate Name"
                          value={inputValue?.certificateName || ""}
                          className="rounded-0 custom-input"
                          onChange={(e) =>
                            handleFilterChange(
                              "certificateName",
                              e.target.value
                            )
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <Form.Control
                          placeholder="Email"
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
                      {userRole === "superAdmin" && (
                        <TableCell>
                          <Form.Control
                            placeholder=" Location"
                            value={inputValue?.locationName || ""}
                            className="rounded-0 custom-input"
                            onChange={(e) =>
                              handleFilterChange("locationName", e.target.value)
                            }
                          />
                        </TableCell>
                      )}

                      <TableCell></TableCell>
                      <TableCell></TableCell>
                      <TableCell></TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  )}
                  {certificates?.data?.length > 0 ? (
                    certificates?.data.map((cert) => (
                      <TableRow key={cert?.id} hover>
                        <TableCell>{cert?.certificateNumber}</TableCell>
                        <TableCell>{cert?.certificateName}</TableCell>
                        <TableCell>{cert?.email}</TableCell>
                        {userRole === "superAdmin" && (
                          <TableCell>{cert?.locationName}</TableCell>
                        )}
                        <TableCell>
                          {new Date(cert?.issueDate).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          {new Date(cert?.validUntil).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={
                              cert?.status?.charAt(0).toUpperCase() +
                              cert?.status?.slice(1)
                            }
                            color={
                              cert?.status === "Active" ? "success" : "error"
                            }
                            size="small"
                          />
                        </TableCell>
                        <TableCell align="right">
                          <IconButton
                            onClick={() => handleClickOpen(cert)}
                            color="primary"
                            aria-label="view"
                          >
                            <VisibilityIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} align="center">
                        <Typography
                          variant="body1"
                          color="text.secondary"
                          py={2}
                        >
                          No certificates found matching your criteria
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>
        <TablePagination
          rowsPerPageOptions={[rowsPerPage]}
          className="paginated-custom"
          component="div"
          count={totalData}
          rowsPerPage={rowsPerPage}
          page={currentPage}
          onPageChange={handleChangePage}
        />
      </Box>

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <img
              src={selectedCertificate?.certificateUrl}
              alt="Certificate"
              style={{
                maxWidth: "100%",
                height: "auto",
                border: "1px solid #ddd",
                borderRadius: "4px",
              }}
            />
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleClose}
            autoFocus
            variant="contained"
            color="error"
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
