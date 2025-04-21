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
  },
  {
    id: "description",
    numeric: false,
    disablePadding: false,
    label: "Description",
  },
  {
    id: "locationState",
    numeric: false,
    disablePadding: false,
    label: "Location",
  },
  {
    id: "uploadedBy.name",
    numeric: false,
    disablePadding: false,
    label: "Uploaded By",
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
  const [getVideo, setGetVideo] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [open, setOpen] = useState(false);
  const [playOpen, setPlayOpen] = useState(false);
  const [videoFiles, setVideoFiles] = useState([]);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("");
  const [totalData, setTotalData] = useState([]);
  const [selected, setSelected] = useState([]);
  const [openFilter, setOpenFilter] = useState(false);
  const [filters, setFilters] = useState({
    title: "",
    description: "",
    locationState: "",
    uploadedBy: "",
    uploadDate: "",
    views: "",
  });

  const today = dayjs().startOf("day");
  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const offset = currentPage * rowsPerPage;
    const limit = rowsPerPage;
    // const [sortBy,sortField]=[order,orderBy]
    const [sortBy, sortField] = [order === "asc" ? 1 : -1, orderBy];
    
    const fetchVideos = async () => {
      try {
        const response = await getVideos(
          token, 
          offset, 
          limit,
          sortBy,
          sortField,
          filters.title,
          filters.description,
          filters.locationState,
          filters.uploadedBy,
          filters.uploadDate,
          filters.views
        );
        
        if (response.status === 200) {
          setGetVideo(response?.data);
          setTotalData(response?.total);
        }
      } catch (error) {
        console.error("Error fetching videos:", error);
      }
    };
    fetchVideos();
  }, [currentPage, order, orderBy, filters]);

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
                    label={`Title: ${filters.title}`}
                    onDelete={() => handleFilterChange("title", "")}
                  />
                )}
                {filters.description && (
                  <Chip
                    label={`Desc: ${filters.description}`}
                    onDelete={() => handleFilterChange("description", "")}
                  />
                )}
                {filters.locationState && (
                  <Chip
                    label={`Location: ${filters.locationState}`}
                    onDelete={() => handleFilterChange("locationState", "")}
                  />
                )}
                {filters.uploadedBy && (
                  <Chip
                    label={`Uploaded By: ${filters.uploadedBy}`}
                    onDelete={() => handleFilterChange("uploadedBy", "")}
                  />
                )}
                {filters.uploadDate && (
                  <Chip
                    label={`Date: ${filters.uploadDate}`}
                    onDelete={() => handleFilterChange("uploadDate", "")}
                  />
                )}
                {filters.views && (
                  <Chip
                    label={`Views: ${filters.views}`}
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
                        value={filters.description}
                        className="rounded-0 custom-input"
                        onChange={(e) =>
                          handleFilterChange("description", e.target.value)
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <Form.Control
                        id="filter-locationState"
                        placeholder="Location"
                        value={filters.locationState}
                        className="rounded-0 custom-input"
                        onChange={(e) =>
                          handleFilterChange("locationState", e.target.value)
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <Form.Control
                        id="filter-uploadedBy"
                        placeholder="Uploaded By"
                        value={filters.uploadedBy}
                        className="rounded-0 custom-input"
                        onChange={(e) =>
                          handleFilterChange("uploadedBy", e.target.value)
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <Form.Control
                        id="filter-uploadDate"
                        placeholder="Uploaded Date"
                        value={filters.uploadDate}
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
                {getVideo.map((video, index) => (
                  <TableRow key={video._id || index}>
                    <TableCell>{currentPage * rowsPerPage + index + 1}</TableCell>
                    <TableCell>{video.title}</TableCell>
                    <TableCell>{video.description}</TableCell>
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