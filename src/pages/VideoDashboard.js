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
import Select from "@mui/material/Select";
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
import { getVideos, deleteVideos } from "../api/video";
import AddVideoOffcanvas from "./AddVideosForm";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const rowsPerPage = 10;

const headCells = [
  // {
  //   id: "id",
  //   numeric: true,
  //   disablePadding: false,
  //   label: "S.No",
  //   disableSort: true,
  // },
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
    id: "level",
    numeric: false,
    disablePadding: false,
    label: "level",
    disableSort: true,
  },
  {
    id: "locationState",
    numeric: false,
    disablePadding: false,
    label: "Location",
    disableSort: true,
  },
  {
    id: "uploadedBy.name",
    numeric: false,
    disablePadding: false,
    label: "Uploaded By",
    disableSort: true,
  },
  {
    id: "uploadDate",
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

  const [open, setOpen] = useState(false);
  const [playOpen, setPlayOpen] = useState(false);
  const [videoFiles, setVideoFiles] = useState([]);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("");
  const [totalData, setTotalData] = useState([]);
  const [selected, setSelected] = useState([]);
  const [openFilter, setOpenFilter] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [filters, setFilters] = useState({});
  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;
  const [level, setLevel] = useState("");
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
      console.error("Error fetching videos:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteUploadedVideo = (id) => {
    setVideoFiles((prev) => prev.filter((v) => v.id !== id));
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
              Video
            </Button>
            <AddVideoOffcanvas
              open={open}
              setOpen={setOpen}
              handleClose={handleClose}
              selectedVideos={[]}
              videoFiles={videoFiles}
              setVideoFiles={setVideoFiles}
              deleteUploadedVideo={deleteUploadedVideo}
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
                    label={`Desc: ${inputValue.description}`}
                    onDelete={() => handleFilterChange("description", "")}
                  />
                )}
                {inputValue.locationState && (
                  <Chip
                    label={`Location: ${inputValue.locationState}`}
                    onDelete={() => handleFilterChange("locationState", "")}
                  />
                )}
                {inputValue.uploadedBy && (
                  <Chip
                    label={`Uploaded By: ${inputValue.uploadedBy}`}
                    onDelete={() => handleFilterChange("uploadedBy", "")}
                  />
                )}
                {inputValue.uploadDate && (
                  <Chip
                    label={`Date: ${inputValue.uploadDate}`}
                    onDelete={() => handleFilterChange("uploadDate", "")}
                  />
                )}
                {inputValue.views && (
                  <Chip
                    label={`Views: ${inputValue.views}`}
                    onDelete={() => handleFilterChange("views", "")}
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
                        id="filter-title"
                        placeholder="Title"
                        value={inputValue.title}
                        className="rounded-0 custom-input"
                        onChange={(e) =>
                          handleFilterChange("title", e.target.value)
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <FormControl
                        size="small"
                        className="mb-2"
                        style={{ width: "100px" }}
                        variant="standard"
                      >
                        <InputLabel id="demo-simple-select-label">
                          Level
                        </InputLabel>
                        <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          value={level}
                          label="Level"
                          onChange={handleChange}
                        >
                          <MenuItem value={"Easy"}>Easy</MenuItem>
                          <MenuItem value={"Medium"}>Medium</MenuItem>
                          <MenuItem value={"Hard"}>Hard</MenuItem>
                        </Select>
                      </FormControl>
                    </TableCell>
                    <TableCell>
                      <Form.Control
                        id="filter-locationState"
                        placeholder="Location"
                        value={inputValue.locationState}
                        className="rounded-0 custom-input"
                        onChange={(e) =>
                          handleFilterChange("locationState", e.target.value)
                        }
                      />
                    </TableCell>
                    <TableCell>
                      {/* <Form.Control
                        id="filter-uploadedBy"
                        placeholder="Uploaded By"
                        value={inputValue.uploadedBy}
                        className="rounded-0 custom-input"
                        onChange={(e) =>
                          handleFilterChange("uploadedBy", e.target.value)
                        }
                      /> */}
                    </TableCell>
                    <TableCell>
                      <Form.Control
                        id="filter-uploadDate"
                        placeholder="Uploaded Date"
                        value={inputValue.uploadDate}
                        className="rounded-0 custom-input"
                        onChange={(e) =>
                          handleFilterChange("uploadDate", e.target.value)
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <Form.Control
                        id="filter-views"
                        placeholder="Views"
                        className="rounded-0 custom-input"
                        value={inputValue.views}
                        onChange={(e) =>
                          handleFilterChange("views", e.target.value)
                        }
                        type="number"
                      />
                    </TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                )}
                {getVideo.map((video, index) => (
                  <TableRow
                    key={video._id || index}
                    className="table-custom-level"
                  >
                    {/* <TableCell>
                      {currentPage * rowsPerPage + index + 1}
                    </TableCell> */}
                    <TableCell>{video.title}</TableCell>
                    <TableCell>{video.description}</TableCell>
                    <TableCell>
                      <Chip
                        label={` ${video?.level}`}
                        className={`${video?.level?.toLowerCase()}`}
                      />
                    </TableCell>
                    <TableCell>{video.locationState}</TableCell>
                    <TableCell>{video.uploadedBy?.name}</TableCell>
                    <TableCell>
                      {new Date(video.uploadDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{video.views}</TableCell>
                    <TableCell>
                      <PlayArrowIcon
                        color="success"
                        onClick={() => handlePlayOpen(video.url)}
                        style={{ cursor: "pointer" }}
                      />
                      <DeleteIcon
                        color="error"
                        style={{ cursor: "pointer" }}
                        onClick={() => handleDelete(video._id)}
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
