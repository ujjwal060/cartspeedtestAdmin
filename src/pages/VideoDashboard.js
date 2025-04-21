import React, { useEffect, useState } from "react";
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
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
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
import { getVideos } from "../api/video";
import AddVideoOffcanvas from "./AddVideosForm";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const rowsPerPage = 10;

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

const headCells = [
  {
    id: "id",
    numeric: true,
    disablePadding: false,
    label: "S.No",
    disableSort: true,
  },
  {
    id: "title",
    numeric: false,
    disablePadding: false,
    label: "Title",
    disableSort: true,
  },
  {
    id: "description",
    numeric: false,
    disablePadding: false,
    label: "Description",
    disableSort: true,
  },
  {
    id: "location",
    numeric: false,
    disablePadding: false,
    label: "Location",
    disableSort: true,
  },
  {
    id: "uploadedBy",
    numeric: false,
    disablePadding: false,
    label: "Uploaded By",
    disableSort: true,
  },
  {
    id: "uploadedDate",
    numeric: false,
    disablePadding: false,
    label: "Date",
  },
  {
    id: "views",
    numeric: true,
    disablePadding: false,
    label: "Views",
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
  const [open, setOpen] = useState(false);
  const [playOpen, setPlayOpen] = useState(false);
  const [videoFiles, setVideoFiles] = useState([]);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("id");
  const [totalData, setTotalData] = useState([]);
  const [selected, setSelected] = useState([]);
  const [openFilter, setOpenFilter] = useState(false);
  const [filters, setFilters] = useState({
    title: "",
    description: "",
    location: "",
    uploadedBy: "",
    uploadedDate: "",
    views: "",
  });

  const today = dayjs().startOf("day");
  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const offset = currentPage * rowsPerPage + 1;
    const limit = currentPage * rowsPerPage + rowsPerPage;
    const fetchVideos = async () => {
      try {
        const response = await getVideos(token, offset, limit);
        if (response.status === 200) {
          setGetVideo(response?.data);
          setTotalData(response?.total);
        }
      } catch (error) {
        console.error("Error fetching videos:", error);
      }
    };
    fetchVideos();
  }, [currentPage, filters]);
  const handlePlayOpen = (url) => {
    setSelected(url);
    setPlayOpen(true);
  };
  const handlePlayClose = () => setPlayOpen(false);

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
    setFilters((prev) => ({
      ...prev,
      [filterName]: value,
    }));
  };

  const filterVideos = (videos) => {
    return videos?.filter((video) => {
      return (
        (video?.title || "")
          .toLowerCase()
          .includes(filters?.title?.toLowerCase() || "") &&
        (video?.description || "")
          .toLowerCase()
          .includes(filters?.description?.toLowerCase() || "") &&
        (video?.locationState || "")
          .toLowerCase()
          .includes(filters?.locationState?.toLowerCase() || "") &&
        (video?.uploadedBy?.name || "")
          .toLowerCase()
          .includes(filters?.uploadedBy?.toLowerCase() || "") &&
        (filters?.uploadedDate === "" ||
          (video?.uploadDate || "").includes(filters?.uploadedDate || "")) &&
        (filters?.views === "" ||
          (video?.views?.toString() || "").includes(filters?.views || ""))
      );
    });
  };

  const sortedAndFilteredVideos = filterVideos(
    [...getVideo].sort(getComparator(order, orderBy))
  );

  console.log(orderBy, order);
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
              Add Video
            </Button>
            <AddVideoOffcanvas
              open={open}
              handleClose={handleClose}
              selectedVideos={[]}
              videoFiles={videoFiles}
              setVideoFiles={setVideoFiles}
            />
          </div>
        </div>
        <Paper elevation={3} className="mt-3">
          <TableContainer>
            {
              <Stack direction="row" spacing={1} className="p-3">
                {filters.title && (
                  <Chip
                    label={filters.title}
                    onDelete={() => handleFilterChange("title", "")}
                  />
                )}
                {filters.description && (
                  <Chip
                    label={filters.description}
                    onDelete={() => handleFilterChange("description", "")}
                  />
                )}
                {filters.location && (
                  <Chip
                    label={filters.location}
                    onDelete={() => handleFilterChange("location", "")}
                  />
                )}
                {filters.uploadedBy && (
                  <Chip
                    label={filters.uploadedBy}
                    onDelete={() => handleFilterChange("uploadedBy", "")}
                  />
                )}
                {filters.uploadedDate && (
                  <Chip
                    label={filters.uploadedDate}
                    onDelete={() => handleFilterChange("uploadedDate", "")}
                  />
                )}
                {filters.views && (
                  <Chip
                    label={filters.views}
                    onDelete={() => handleFilterChange("views", "")}
                  />
                )}
              </Stack>
            }
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
                        id="filter-title"
                        placeholder="Title"
                        // variant="outlined"
                        value={filters.title}
                        className="rounded-0 custom-input"
                        onChange={(e) =>
                          handleFilterChange("title", e.target.value)
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <Form.Control
                        id="filter-description"
                        placeholder="Description"
                        // variant="outlined"
                        value={filters.description}
                        className="rounded-0 custom-input"
                        onChange={(e) =>
                          handleFilterChange("description", e.target.value)
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <Form.Control
                        id="filter-location"
                        placeholder="Location"
                        // variant="outlined"
                        value={filters.location}
                        className="rounded-0 custom-input"
                        onChange={(e) =>
                          handleFilterChange("location", e.target.value)
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <Form.Control
                        id="filter-uploadedBy"
                        placeholder="Uploaded By"
                        // variant="outlined"
                        value={filters.uploadedBy}
                        className="rounded-0 custom-input"
                        onChange={(e) =>
                          handleFilterChange("uploadedBy", e.target.value)
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <Form.Control
                        id="filter-uploadedDate"
                        placeholder="Uploaded Date"
                        // variant="outlined"
                        value={filters.uploadedDate}
                        className="rounded-0 custom-input"
                        onChange={(e) =>
                          handleFilterChange("uploadedDate", e.target.value)
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <Form.Control
                        id="filter-views"
                        placeholder="Views"
                        className="rounded-0 custom-input"
                        // variant="outlined"
                        value={filters.views}
                        onChange={(e) =>
                          handleFilterChange("views", e.target.value)
                        }
                        type="number"
                      />
                    </TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                )}
                {sortedAndFilteredVideos.map((user, index) => (
                  <TableRow key={user._id || index}>
                    <TableCell>{currentPage * rowsPerPage +index + 1}</TableCell>
                    <TableCell>{user.title}</TableCell>
                    <TableCell>{user.description}</TableCell>
                    <TableCell>{user.locationState}</TableCell>
                    <TableCell>{user.uploadedBy?.name}</TableCell>{" "}
                    {/* Access the name property */}
                    <TableCell>
                      {new Date(user.uploadDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{user.views}</TableCell>
                    <TableCell>
                      <PlayArrowIcon
                        color="success"
                        onClick={() => handlePlayOpen(user.url)}
                        style={{ cursor: "pointer" }}
                      />
                      <DeleteIcon color="error" style={{ cursor: "pointer" }} />
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

        <Dialog
          open={playOpen}
          TransitionComponent={Transition}
          keepMounted
          onClose={(event, reason) => {
            // Prevent closing on backdrop click or Escape key
            if (reason === "backdropClick" || reason === "escapeKeyDown") {
              return;
            }
            handlePlayClose(); // Only close when explicitly called
          }}
          maxWidth="sm"
          fullWidth
        >
          <DialogContent className="text-center">
            <ReactPlayer
              url={selected}
              controls
              className="object-fit-cover"
              width="100%"
            />
            <button
              onClick={handlePlayClose}
              className="btn btn-danger mt-4 px-5"
            >
              Close
            </button>
          </DialogContent>
        </Dialog>
      </Box>
    </Box>
  );
};

export default VideoDashboard;
