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
      id: "Name",
      numeric: false,
      disablePadding: false,
      label: "Name",
      disableSort: true,
    },
    {
      id: "Recipient",
      numeric: false,
      disablePadding: false,
      label: "Recipient",
      disableSort: true,
    },
    ...(userRole === "superAdmin"
      ? [
          {
            id: "Recipient Location",
            numeric: false,
            disablePadding: false,
            label: "Recipient Location",
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
      <TableHead className="tableHead-custom">
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

      setCertificates(response?.data);
      setTotalData(response?.data?.length);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching certificates:", error);
      setLoading(false);
    }
  };
  console.log(totalData);
  useEffect(() => {
    handleCertificates({ filters });
  }, [filters]);

  const handeOpenFilter = () => {
    setOpenFilter(!openFilter);
  };

  const handleDateChange = (update) => {
    setDateRange(update);
    setFilters((prev) => ({
      ...prev,
      startDate: update[0],
      endDate: update[1],
    }));
  };

  return (
    <>
      <Box>
        <div className="row gy-3 mb-4">
          <div className="col-md-4">
            <Card sx={{ bgcolor: "#e3f2fd" }}>
              <CardActionArea>
                <CardContent>
                  <Typography color="text.secondary" gutterBottom>
                    Total Certificates
                  </Typography>
                  <Typography variant="h4" color="primary">
                    {certificates?.length}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </div>

          <div className="col-md-4">
            <Card sx={{ bgcolor: "#e8f5e9" }}>
              <CardActionArea>
                <CardContent>
                  <Typography color="text.secondary" gutterBottom>
                    Active Certificates
                  </Typography>
                  <Typography variant="h4" color="success.main">
                    {certificates?.filter((c) => c.status === "active")?.length}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </div>

          <div className="col-md-4">
            <Card sx={{ bgcolor: "#ffebee" }}>
              <CardActionArea>
                <CardContent>
                  <Typography color="text.secondary" gutterBottom>
                    Expired Certificates
                  </Typography>
                  <Typography variant="h4" color="error.main">
                    {
                      certificates?.filter((c) => c.status === "expired")
                        ?.length
                    }
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </div>
        </div>

        {/* Search and Filter */}

        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            justifyContent: "end",
            gap: 2,
            mb: 3,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",

              gap: 2,
              minWidth: 200,
            }}
          >
            {/* <Select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                size="small"
                fullWidth
              >
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="expired">Expired</MenuItem>
              </Select> */}
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
        <Paper className="max-full-height-2">
          {/* Table */}
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
              <LinearProgress />
            </Box>
          ) : (
            <TableContainer>
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
                          placeholder="Certificate Number"
                          value={inputValue?.certificateNumber || ""}
                          className="rounded-0 custom-input"
                          onChange={(e) =>
                            handleFilterChange(
                              "certificateNumber",
                              e.target.value
                            )
                          }
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
                          onChange={(e) =>
                            handleFilterChange("email", e.target.value)
                          }
                        />
                      </TableCell>
                      {userRole === "superAdmin" && (
                        <TableCell>
                          <Form.Control
                            placeholder="Reciepient Location"
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
                  {certificates?.length > 0 ? (
                    certificates.map((cert) => (
                      <TableRow key={cert.id} hover>
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
                              cert.status.charAt(0).toUpperCase() +
                              cert.status.slice(1)
                            }
                            color={
                              cert.status === "Active" ? "success" : "error"
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
