import React, { useEffect, useState, useCallback } from "react";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import SafetyCheckIcon from '@mui/icons-material/SafetyCheck'; // New icon for safety videos
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
import { useNavigate } from "react-router-dom";
import Select from "@mui/material/Select";
import Switch from "@mui/material/Switch";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
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
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import Form from "react-bootstrap/Form";
import { getVideos, deleteVideos, isActiveVideos } from "../api/video";
import AddVideoOffcanvas from "./AddVideosForm";
import AddSafetyVideoOffcanvas from "./AddSafetyVideosForm"; // New component for safety videos
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const rowsPerPage = 10;

const headCells = [
  {
    id: "title",
    numeric: false,
    disablePadding: false,
    label: "Title",
  },
  {
    id: "description",
    numeric: false,
    disablePadding: false,
    label: "Description",
    disableSort: true,
  },
  {
    id: "section",
    numeric: false,
    disablePadding: false,
    label: "Section",
    disableSort: true,
  },
  {
    id: "sectionTitle",
    numeric: false,
    disablePadding: false,
    label: "Section Title",
    disableSort: true,
  },
  {
    id: "locationName",
    numeric: false,
    disablePadding: false,
    label: "Location",
    disableSort: true,
  },
  {
    id: "durationTime",
    numeric: false,
    disablePadding: false,
    label: "Duration",
    disableSort: true,
  },
  {
    id: "status",
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
  const [open, setOpen] = useState(false);
  const [openSafetyVideo, setOpenSafetyVideo] = useState(false); // New state for safety videos
  const [playOpen, setPlayOpen] = useState(false);
  const [videoFiles, setVideoFiles] = useState([]);
  const [safetyVideoFiles, setSafetyVideoFiles] = useState([]); // New state for safety video files
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("");
  const [totalData, setTotalData] = useState([]);
  const [selected, setSelected] = useState([]);
  const [openFilter, setOpenFilter] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [filters, setFilters] = useState({});
  const handleClickOpen = () => setOpen(true);
  const handleSafetyVideoClickOpen = () => setOpenSafetyVideo(true); // New handler for safety videos
  const handleClose = () => setOpen(false);
  const handleSafetyVideoClose = () => setOpenSafetyVideo(false); // New handler for safety videos
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;
  const [level, setLevel] = useState("");
  const [uploadingloading, setUploadingLoading] = useState(false);
  const navigate = useNavigate();
  const handleChange = (event) => {
    setLevel(event.target.value);
  };
  
  const fetchVideos = async () => {
    const offset = currentPage * rowsPerPage;
    const limit = rowsPerPage;
    const [sortBy, sortField] = [order === "asc" ? 1 : -1, orderBy];
    try {
      setLoading(true);
      const response = await getVideos(
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
      toast.error(error?.response?.data?.message?.[0]);
    } finally {
      setLoading(false);
    }
  };

  const deleteUploadedVideo = (id) => {
    setVideoFiles((prev) => prev.filter((v) => v.id !== id));
  };

  const deleteUploadedSafetyVideo = (id) => {
    setSafetyVideoFiles((prev) => prev.filter((v) => v.id !== id));
  };

  const handleDelete = async (videoId) => {
    try {
      const res = await deleteVideos(videoId, token);
      toast.success(res.message[0]);
      fetchVideos();
    } catch (error) {
      toast.error(error.response.data.message[0]);
    }
  };

  const handleToggleStatus = async (videoId) => {
    try {
      const res = await isActiveVideos(videoId, token);
      toast.success(res.message[0]);
      fetchVideos();
    } catch (error) {
      toast.error(error.response.data.message[0]);
    }
  };

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
    fetchVideos();
  }, [currentPage]);

  useEffect(() => {
    setCurrentPage(0);
    fetchVideos();
  }, [filters, order, orderBy]);

  if (uploadingloading) {
    return (
      <div className="">
        <div className="global-loader margin-loader ">
          <div className="loader-animation">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </div>
    );
  }

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
              onClick={handleSafetyVideoClickOpen}
              className="rounded-4 d-flex gap-1 flex-row"
              style={{ backgroundColor: '#4caf50' }} // Green color for safety videos
            >
              <SafetyCheckIcon />
              Safety Videos
            </Button>

            <Button
              variant="contained"
              color="primary"
              onClick={handleClickOpen}
              className="rounded-4 d-flex gap-1 flex-row"
            >
              <AddCircleOutlineIcon />
              Video
            </Button>
            
            <AddVideoOffcanvas
              open={open}
              setOpen={setOpen}
              handleClose={handleClose}
              selectedVideos={[]}
              setUploadingLoading={setUploadingLoading}
              uploadingloading={uploadingloading}
              videoFiles={videoFiles}
              setVideoFiles={setVideoFiles}
              deleteUploadedVideo={deleteUploadedVideo}
              onVideoUploaded={fetchVideos}
            />

            <AddSafetyVideoOffcanvas
              open={openSafetyVideo}
              setOpen={setOpenSafetyVideo}
              handleClose={handleSafetyVideoClose}
              selectedVideos={[]}
              videoFiles={safetyVideoFiles}
              setVideoFiles={setSafetyVideoFiles}
              deleteUploadedVideo={deleteUploadedSafetyVideo}
              onVideoUploaded={fetchVideos}
            />
          </div>
        </div>
        <Paper elevation={3} className="mt-3">
          <TableContainer>
            {
              <Stack direction="row" spacing={1} className="p-3">
                {inputValue.title && (
                  <Chip
                    label={`Title: ${inputValue.title}`}
                    onDelete={() => handleFilterChange("title", "")}
                  />
                )}
                {inputValue.description && (
                  <Chip
                    label={`Description: ${inputValue.description}`}
                    onDelete={() => handleFilterChange("description", "")}
                  />
                )}
                {inputValue.section && (
                  <Chip
                    label={`Section: ${inputValue.section}`}
                    onDelete={() => handleFilterChange("section", "")}
                  />
                )}
                {inputValue.sectionTitle && (
                  <Chip
                    label={`Section Title: ${inputValue.sectionTitle}`}
                    onDelete={() => handleFilterChange("sectionTitle", "")}
                  />
                )}
                {inputValue.locationState && (
                  <Chip
                    label={`Location: ${inputValue.locationState}`}
                    onDelete={() => handleFilterChange("locationState", "")}
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
                    <TableCell>
                      <Form.Control
                        placeholder="Title"
                        value={inputValue.title || ""}
                        className="rounded-0 custom-input"
                        onChange={(e) =>
                          handleFilterChange("title", e.target.value)
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <Form.Control
                        placeholder="Description"
                        value={inputValue.description || ""}
                        className="rounded-0 custom-input"
                        onChange={(e) =>
                          handleFilterChange("description", e.target.value)
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <FormControl
                        size="small"
                        style={{ width: "120px" }}
                        variant="standard"
                      >
                        <InputLabel>Section</InputLabel>
                        <Select
                          value={inputValue.section || ""}
                          onChange={(e) =>
                            handleFilterChange("section", e.target.value)
                          }
                        >
                          <MenuItem value="section1">Section 1</MenuItem>
                          <MenuItem value="section2">Section 2</MenuItem>
                          <MenuItem value="section3">Section 3</MenuItem>
                          <MenuItem value="section4">Section 4</MenuItem>
                          <MenuItem value="section5">Section 5</MenuItem>
                        </Select>
                      </FormControl>
                    </TableCell>
                    <TableCell>
                      <Form.Control
                        placeholder="Section Title"
                        value={inputValue.sectionTitle || ""}
                        className="rounded-0 custom-input"
                        onChange={(e) =>
                          handleFilterChange("sectionTitle", e.target.value)
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <Form.Control
                        placeholder="Location"
                        value={inputValue.locationState || ""}
                        className="rounded-0 custom-input"
                        onChange={(e) =>
                          handleFilterChange("locationState", e.target.value)
                        }
                      />
                    </TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                )}

                {getVideo.map((item, index) => (
                  <TableRow key={item.video._id || index}>
                    <TableCell
                      onClick={() =>
                        navigate("/assessment", {
                          state: {
                            title: item.video.title,
                            videoId: item.video._id,
                          },
                        })
                      }
                      style={{
                        cursor: "pointer",
                        color: "#1976d2",
                        textDecoration: "underline",
                      }}
                    >
                      {item.video.title}
                    </TableCell>
                    <TableCell>{item.video.description}</TableCell>
                    <TableCell>{item.section}</TableCell>
                    <TableCell>{item.sectionTitle}</TableCell>
                    <TableCell>{item.locationName}</TableCell>
                    <TableCell>{item.video.durationTime}</TableCell>
                    <TableCell>
                      <Switch
                        checked={item.video.isActive}
                        onChange={() => handleToggleStatus(item.video._id)}
                        color="primary"
                        inputProps={{ "aria-label": "toggle video status" }}
                      />
                    </TableCell>
                    <TableCell>
                      <PlayArrowIcon
                        color="success"
                        onClick={() => handlePlayOpen(item.video.url)}
                        style={{ cursor: "pointer" }}
                      />
                      <DeleteIcon
                        color="error"
                        style={{ cursor: "pointer" }}
                        onClick={() => handleDelete(item.video._id)}
                      />
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
        <Dialog
          open={playOpen}
          TransitionComponent={Transition}
          keepMounted
          onClose={(event, reason) => {
            if (reason === "backdropClick" || reason === "escapeKeyDown") {
              return;
            }
            handlePlayClose();
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