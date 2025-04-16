import React, { useState, useMemo } from "react";
import { Paper, Box } from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import PropTypes from "prop-types";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";

// Constants
const ROWS_PER_PAGE = 10;
const ROWS_PER_PAGE_OPTIONS = [10, 25, 50];

// Sample data - in a real app, this would come from an API
const DUMMY_DATA = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    phone: "1234567890",
    address: "New York, USA",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    phone: "0987654321",
    address: "London, UK",
  },
  // Add more dummy data for testing pagination and sorting
  ...Array.from({ length: 15 }, (_, i) => ({
    id: i + 3,
    name: `User ${i + 3}`,
    email: `user${i + 3}@example.com`,
    phone: `555${String(i + 3).padStart(7, "0")}`,
    address: `City ${i + 3}, Country`,
  })),
];

// Sorting functions
function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  {
    id: "id",
    numeric: true,
    disablePadding: false,
    label: "ID",
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
  },
  {
    id: "phone",
    numeric: false,
    disablePadding: false,
    label: "Phone No",
  },
  {
    id: "address",
    numeric: false,
    disablePadding: false,
    label: "Address",
  },
];

function EnhancedTableHead(props) {
  const { order, orderBy, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={"left"}
            padding={headCell.disablePadding ? "none" : "normal"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={{ display: "none" }}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
};

const Users = () => {
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("id");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(ROWS_PER_PAGE);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const DateRangePicker = ({ value, onChange }) => {
    const [startDate, endDate] = value || [null, null];

    return (
      <Box display="flex" gap={2}>
        <DatePicker
          label="Start Date"
          value={startDate}
          sx={{ width: "200px" }}
          size="small"
          onChange={(newStartDate) => {
            if (newStartDate && endDate && newStartDate.isAfter(endDate)) {
              onChange([newStartDate, null]);
            } else {
              onChange([newStartDate, endDate]);
            }
          }}
        />
        <DatePicker
          label="End Date"
          value={endDate}
          sx={{ width: "200px" }}
          size="small"
          onChange={(newEndDate) => {
            onChange([startDate, newEndDate]);
          }}
          minDate={startDate ? startDate.add(1, "day") : dayjs().add(1, "day")}
          disabled={!startDate}
        />
      </Box>
    );
  };
  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const today = dayjs().startOf("day");

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - DUMMY_DATA.length) : 0;

  const visibleRows = useMemo(
    () =>
      stableSort(DUMMY_DATA, getComparator(order, orderBy)).slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
      ),
    [order, orderBy, page, rowsPerPage]
  );

  return (
    <>
      <Box p={4}>
        <div className="d-flex justify-content-end gap-2 align-items-center mb-3 pad-root">
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
                    setEndDate(null); // Reset end date if it's before new start
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
        </div>
        <Paper>
          <TableContainer>
            <Table>
              <EnhancedTableHead
                order={order}
                orderBy={orderBy}
                onRequestSort={handleRequestSort}
              />
              <TableBody>
                {visibleRows.map((row) => (
                  <TableRow hover key={row.id}>
                    <TableCell>{row.id}</TableCell>
                    <TableCell>{row.name}</TableCell>
                    <TableCell>{row.email}</TableCell>
                    <TableCell>{row.phone}</TableCell>
                    <TableCell>{row.address}</TableCell>
                  </TableRow>
                ))}
                {emptyRows > 0 && (
                  <TableRow style={{ height: 53 * emptyRows }}>
                    <TableCell colSpan={headCells.length} />
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={ROWS_PER_PAGE_OPTIONS}
            component="div"
            count={DUMMY_DATA.length}
            rowsPerPage={rowsPerPage}
            page={page}
            className="paginated-custom"
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      </Box>
    </>
  );
};

export default Users;
