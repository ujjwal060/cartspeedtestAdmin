import React, { useState, useId } from "react";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import {
  Box,
  Paper,
  Button,
  Dialog,
  DialogContent,
  Slide,
  TextField,
  Chip,
  Tooltip,
  Stack,
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import Offcanvas from "react-bootstrap/Offcanvas";
import ReactPlayer from "react-player";
import Autocomplete from "@mui/material/Autocomplete";
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

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const rowsPerPage = 10;
const dummyVideos = [
  {
    id: 1,
    title: "Video 1",
    description: "Lorem Ipsum",
    location: "Los Angeles",
    uploadedBy: "SuperAdmin",
    uploadedDate: "24 June 2025",
    views: 0.1,
    url: "https://www.w3schools.com/html/movie.mp4",
  },
  {
    id: 2,
    title: "Video 2",
    description: "Lorem Ipsum",
    location: "New York",
    uploadedBy: "SuperAdmin",
    uploadedDate: "25 June 2025",
    views: 1.0,
    url: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
  },
  {
    id: 3,
    title: "Video 3",
    description: "Lorem Ipsum",
    location: "california",
    uploadedBy: "SuperAdmin",
    uploadedDate: "26 June 2025",
    views: 0.2,
    url: "https://www.w3schools.com/html/movie.mp4",
  },
  {
    id: 4,
    title: "Video 3",
    description: "Lorem Ipsum",
    location: "california",
    uploadedBy: "SuperAdmin",
    uploadedDate: "26 June 2025",
    views: 0.2,
    url: "https://www.w3schools.com/html/movie.mp4",
  },
  {
    id: 5,
    title: "Video 3",
    description: "Lorem Ipsum",
    location: "california",
    uploadedBy: "SuperAdmin",
    uploadedDate: "26 June 2025",
    views: 0.9,
    url: "https://www.w3schools.com/html/movie.mp4",
  },
  {
    id: 6,
    title: "Video 3",
    description: "Lorem Ipsum",
    location: "california",
    uploadedBy: "SuperAdmin",
    uploadedDate: "26 June 2025",
    views: 0.2,
    url: "https://www.w3schools.com/html/movie.mp4",
  },
  {
    id: 7,
    title: "Video 3",
    description: "Lorem Ipsum",
    location: "california",
    uploadedBy: "SuperAdmin",
    uploadedDate: "26 June 2025",
    views: 0.2,
    url: "https://www.w3schools.com/html/movie.mp4",
  },
  {
    id: 8,
    title: "Video 3",
    description: "Lorem Ipsum",
    location: "california",
    uploadedBy: "SuperAdmin",
    uploadedDate: "26 June 2025",
    views: 0.2,
    url: "https://www.w3schools.com/html/movie.mp4",
  },
  {
    id: 9,
    title: "Video 3",
    description: "Lorem Ipsum",
    location: "california",
    uploadedBy: "SuperAdmin",
    uploadedDate: "26 June 2025",
    views: 0.2,
    url: "https://www.w3schools.com/html/movie.mp4",
  },
  {
    id: 10,
    title: "Video 3",
    description: "Lorem Ipsum",
    location: "california",
    uploadedBy: "SuperAdmin",
    uploadedDate: "26 June 2025",
    views: 0.2,
    url: "https://www.w3schools.com/html/movie.mp4",
  },
  {
    id: 11,
    title: "Video 3",
    description: "Lorem Ipsum",
    location: "california",
    uploadedBy: "SuperAdmin",
    uploadedDate: "26 June 2025",
    views: 0.2,
    url: "https://www.w3schools.com/html/movie.mp4",
  },
  {
    id: 12,
    title: "Video 3",
    description: "Lorem Ipsum",
    location: "california",
    uploadedBy: "SuperAdmin",
    uploadedDate: "26 June 2025",
    views: 0.2,
    url: "https://www.w3schools.com/html/movie.mp4",
  },
  {
    id: 13,
    title: "Video 3",
    description: "Lorem Ipsum",
    location: "california",
    uploadedBy: "SuperAdmin",
    uploadedDate: "26 June 2025",
    views: 0.2,
    url: "https://www.w3schools.com/html/movie.mp4",
  },
  {
    id: 14,
    title: "Video 3",
    description: "Lorem Ipsum",
    location: "california",
    uploadedBy: "SuperAdmin",
    uploadedDate: "26 June 2025",
    views: 0.2,
    url: "https://www.w3schools.com/html/movie.mp4",
  },
  {
    id: 15,
    title: "Video 3",
    description: "Lorem Ipsum",
    location: "california",
    uploadedBy: "SuperAdmin",
    uploadedDate: "26 June 2025",
    views: 0.2,
    url: "https://www.w3schools.com/html/movie.mp4",
  },
  {
    id: 16,
    title: "Video 3",
    description: "Lorem Ipsum",
    location: "california",
    uploadedBy: "SuperAdmin",
    uploadedDate: "26 June 2025",
    views: 0.2,
    url: "https://www.w3schools.com/html/movie.mp4",
  },
];

const filesizes = (bytes, decimals = 2) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
};

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

const headCells = [
  {
    id: "id",
    numeric: true,
    disablePadding: false,
    label: "S.No",
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
  const [value, setValue] = React.useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [open, setOpen] = useState(false);
  const [playOpen, setPlayOpen] = useState(false);
  const [videoFiles, setVideoFiles] = useState([]);
  const [selectedVideos, setSelectedVideos] = useState([]);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("id");
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

  const uniqueId = useId();
  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

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

  const handleVideoInput = (e) => {
    const newVideos = [];
    for (let i = 0; i < e.target.files.length; i++) {
      const file = e.target.files[i];
      const url = URL.createObjectURL(file);
      newVideos.push({
        id: `${uniqueId}-${Date.now()}-${i}`,
        filename: file.name,
        filetype: file.type,
        filesize: filesizes(file.size),
        datetime: file.lastModifiedDate?.toLocaleString("en-IN"),
        fileurl: url,
      });
    }
    setSelectedVideos((prev) => [...prev, ...newVideos]);
  };
  const handeOpenFilter = () => {
    setOpenFilter(!openFilter);
  };

  const handleVideoUpload = (e) => {
    e.preventDefault();
    setVideoFiles((prev) => [...prev, ...selectedVideos]);
    setSelectedVideos([]);
    e.target.reset();
    setOpen(false);
  };

  const handleChangePage = (_, newPage) => setCurrentPage(newPage);

  const deleteUploadedVideo = (id) => {
    if (window.confirm("Delete this video?")) {
      setSelectedVideos((prev) => prev.filter((v) => v.id !== id));
    }
  };
  const handleFilterChange = (filterName, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterName]: value,
    }));
  };

  // Sort videos
  const filterVideos = (videos) => {
    return videos.filter((video) => {
      return (
        video.title.toLowerCase().includes(filters.title.toLowerCase()) &&
        video.description
          .toLowerCase()
          .includes(filters.description.toLowerCase()) &&
        video.location.toLowerCase().includes(filters.location.toLowerCase()) &&
        video.uploadedBy
          .toLowerCase()
          .includes(filters.uploadedBy.toLowerCase()) &&
        (filters.uploadedDate === "" ||
          video.uploadedDate.includes(filters.uploadedDate)) &&
        (filters.views === "" || video.views.toString().includes(filters.views))
      );
    });
  };

  // Modify your sortedVideos to include filtering
  const sortedAndFilteredVideos = filterVideos(
    [...dummyVideos].sort(getComparator(order, orderBy))
  );

  // Update paginatedUsers to use the filtered videos
  const paginatedUsers = sortedAndFilteredVideos.slice(
    currentPage * rowsPerPage,
    currentPage * rowsPerPage + rowsPerPage
  );

  console.log(filters);

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
              <FilterListIcon onClick={handeOpenFilter} />
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
                        onChange={(e) =>
                          handleFilterChange("uploadedDate", e.target.value)
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <Form.Control
                        id="filter-views"
                        placeholder="Views"
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
                {paginatedUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.id}</TableCell>
                    <TableCell>{user.title}</TableCell>
                    <TableCell>{user.description}</TableCell>
                    <TableCell>{user.location}</TableCell>
                    <TableCell>{user.uploadedBy}</TableCell>
                    <TableCell>{user.uploadedDate}</TableCell>
                    <TableCell>{user.views}</TableCell>
                    <TableCell>
                      <PlayArrowIcon
                        color="success"
                        onClick={() => handlePlayOpen(user.url)}
                      />
                      <DeleteIcon color="error" />
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
            count={dummyVideos.length}
            rowsPerPage={rowsPerPage}
            page={currentPage}
            onPageChange={handleChangePage}
          />
        </Paper>

        <Box mt={4}>
          {videoFiles.length > 0 &&
            videoFiles.map((vid) => (
              <Box
                key={vid.id}
                mb={2}
                p={2}
                border={"1px solid #ccc"}
                borderRadius={2}
              >
                <video
                  width="100%"
                  height="240"
                  controls
                  src={vid.fileurl}
                ></video>
                <p>
                  <strong>{vid.filename}</strong> ({vid.filesize}) -{" "}
                  {vid.datetime}
                </p>
                <Button
                  onClick={() => deleteUploadedVideo(vid.id)}
                  color="error"
                >
                  Delete
                </Button>
                <a
                  href={vid.fileurl}
                  download={vid.filename}
                  style={{ marginLeft: 10 }}
                >
                  <Button color="success">Download</Button>
                </a>
              </Box>
            ))}
        </Box>

        <Offcanvas show={open} onHide={handleClose} placement={"end"}>
          <Offcanvas.Header closeButton>
            <Offcanvas.Title>Add Video</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <form onSubmit={handleVideoUpload}>
              <div className="fileupload-view">
                <div className="kb-data-box">
                  <form onSubmit={handleVideoUpload}>
                    <div className="kb-file-upload">
                      <div className="file-upload-box">
                        <input
                          type="file"
                          accept="video/*"
                          id="fileupload"
                          className="file-upload-input"
                          onChange={handleVideoInput}
                          multiple
                        />
                        <span>
                          Drag and drop or{" "}
                          <span className="file-link">Choose your files</span>
                        </span>
                      </div>
                    </div>
                    <div className="kb-attach-box mb-3">
                      {selectedVideos.map((vid) => (
                        <div className="file-atc-box" key={vid.id}>
                          <div className="file-image">
                            <video
                              width="100"
                              height="60"
                              controls
                              src={vid.fileurl}
                            ></video>
                          </div>
                          <div className="file-detail">
                            <h6>{vid.filename}</h6>
                            <p>
                              <span>Size : {vid.filesize}</span>
                              <span className="ml-2">
                                Modified Time : {vid.datetime}
                              </span>
                            </p>
                            <div className="file-actions">
                              <button
                                type="button"
                                className="file-action-btn"
                                onClick={() => deleteUploadedVideo(vid.id)}
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="row gy-4 mb-4">
                      <div className="col-lg-12">
                        <TextField
                          variant="outlined"
                          size="small"
                          className="w-100"
                          placeholder="Enter video title.."
                        />
                      </div>
                      <div className="col-lg-12">
                        <Autocomplete
                          id="controlled-demo"
                          size="small"
                          value={value}
                          options={[
                            "Option A",
                            "Option B",
                            "Option C",
                            "Option D",
                            "Option E",
                          ]}
                          onChange={(event, newValue) => {
                            setValue(newValue);
                          }}
                          renderInput={(params) => (
                            <TextField {...params} label="Add Your State" />
                          )}
                        />
                      </div>
                      <div className="col-lg-12">
                        <TextField
                          variant="outlined"
                          size="small"
                          placeholder="Enter video title.."
                          className="w-100"
                        />
                      </div>
                    </div>
                    <div className="kb-buttons-box d-flex justify-content-center gap-2">
                      <Button
                        onClick={handleClose}
                        color="error"
                        variant="contained"
                      >
                        Cancel
                      </Button>
                      <Button type="submit" color="success" variant="contained">
                        Save
                      </Button>
                    </div>
                  </form>

                  {videoFiles.length > 0 && (
                    <div className="kb-attach-box">
                      <hr />
                      {videoFiles.map((vid) => (
                        <div className="file-atc-box" key={vid.id}>
                          <div className="file-image">
                            <video
                              width="100"
                              height="60"
                              controls
                              src={vid.fileurl}
                            ></video>
                          </div>
                          <div className="file-detail">
                            <h6>{vid.filename}</h6>
                            <p>
                              <span>Size : {vid.filesize}</span>
                              <span className="ml-3">
                                Modified Time : {vid.datetime}
                              </span>
                            </p>
                            <div className="file-actions">
                              <button
                                className="file-action-btn"
                                onClick={() => deleteUploadedVideo(vid.id)}
                              >
                                Delete
                              </button>
                              <a
                                href={vid.fileurl}
                                className="file-action-btn"
                                download={vid.filename}
                              >
                                Download
                              </a>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </form>
          </Offcanvas.Body>
        </Offcanvas>

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
