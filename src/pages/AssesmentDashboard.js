import React, { useState, useEffect } from "react";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  Box,
  Tooltip,
  Typography,
  Dialog,
  DialogContent,
  Slide,
  Breadcrumbs,
} from "@mui/material";
import { Button } from "@mui/material";
import Chip from "@mui/material/Chip";
import { useLocation } from "react-router-dom";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Accordion from "react-bootstrap/Accordion";
import { getQA } from "../api/test";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import AddAssesmentFormFile from "./AddAssesmentForm";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import TablePagination from "@mui/material/TablePagination";
import "../components/css/accordion-level-styles.css";
import FilterListIcon from "@mui/icons-material/FilterList";
import LocationPinIcon from "@mui/icons-material/LocationPin";
import "../index.css";
import Loader from "../components/Loader";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import ReactPlayer from "react-player";
import { toast } from "react-toastify";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import TextField from '@mui/material/TextField';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const AssesmentDashboard = () => {
  const rowsPerPage = 10;
  
  const [currentPage, setCurrentPage] = useState(0);
  const [filters, setFilters] = useState({});
  const [show, setShow] = useState(false);
  const [getData, setGetData] = useState([]);
  const [totalData, setTotalData] = useState([]);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [loading, setLoading] = useState(false);
  const [openFilter, setOpenFilter] = useState(false);
  const token = localStorage.getItem("token");
  const [level, setLevel] = useState("");
  const [playOpen, setPlayOpen] = useState(false);
  const [selected, setSelected] = useState([]);
  const location = useLocation();
  const { title, videoId } = location.state || {};
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;
  const fetchQA = async () => {
    const offset = currentPage * rowsPerPage;
    const limit = rowsPerPage;
    setLoading(true);
    try {
      const response = await getQA(token, offset, limit, filters);
      setGetData(response?.data);
      setTotalData(response?.total);
    } catch (error) {
      toast.error(error?.response?.data?.message?.[0]);
    } finally {
      setLoading(false);
    }
  };
  const handleChangePage = (_, newPage) => setCurrentPage(newPage);

  const handeOpenFilter = () => {
    setOpenFilter(!openFilter);
    // if (openFilter) {
    //   setFilters({});
    // }
  };

  const handlePlayOpen = (url) => {
    setSelected(url);
    setPlayOpen(true);
  };
  const handlePlayClose = () => setPlayOpen(false);

  const handleLevelChange = (event) => {
    const selectedLevel = event.target.value;
    setLevel(selectedLevel);
    setFilters((prev) => ({ ...prev, level: selectedLevel }));
  };

  useEffect(() => {
    if (videoId) {
      setFilters({ videoId });
    }
  }, [videoId]);

  useEffect(() => {
    fetchQA();
  }, [currentPage, filters]);

  const renderBreadcrumb = () => {
    if (!title) return null;

    return (
      <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>

        <Typography color="text.primary">{title}</Typography>
      </Breadcrumbs>
    );
  };
const sectionStyles = {
  section1: { backgroundColor: "#fff3e0", color: "#ef6c00" }, 
  section2: { backgroundColor: "#e3f2fd", color: "#1565c0" }, 
  section3: { backgroundColor: "#e8f5e9", color: "#2e7d32" },
  section4: { backgroundColor: "#ffebee", color: "#c62828" }, 
  section5: { backgroundColor: "#f3e5f5", color: "#6a1b9a" }, 
};

  const handleDateChange = (update) => {
    setDateRange(update);
    setFilters((prev) => ({
      ...prev,
      startDate: update[0],
      endDate: update[1],
    }));
  };
  return loading ? (
    <div className="">
      <div className="global-loader margin-loader ">
        <div className="loader-animation">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </div>
  ) : (
    <Box p={4}>
      <Box>
        {renderBreadcrumb()}
        <div className="position-sticky top-0 d-flex justify-content-end gap-2 mb-4 align-items-center">
          {openFilter && (
            <>
               <TextField id="outlined-basic" label="Search by Location" variant="outlined" size="small"/>
              <FormControl sx={{ width: "200px" }} size="small">
                <InputLabel id="demo-simple-select-label">
                  Filter By Section
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={level}
                  label="Filter By Section"
                  onChange={handleLevelChange}
                  sx={{ height: "40px" }}
                >
                  <MenuItem value={1}>Section 1</MenuItem>
                  <MenuItem value={2}>Section 2</MenuItem>
                  <MenuItem value={3}>Section 3</MenuItem>
                  <MenuItem value={4}>Section 4</MenuItem>
                  <MenuItem value={5}>Section 5</MenuItem>
                </Select>
              </FormControl>
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
            </>
          )}
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
            className="rounded-4 d-flex gap-1 flex-row "
            onClick={handleShow}
          >
            <AddCircleOutlineIcon />
            Assessment
          </Button>
        </div>

        <Accordion className="d-flex flex-column gap-3 custom-accordion" flush>
          {getData?.map((item, index) => (
            <Accordion.Item eventKey={index.toString()} key={item._id}>

           <Accordion.Header
  className="accordion-button p-0"
  style={sectionStyles[`section${item.sectionNumber}`?.toLowerCase()] || {}}
>
  Q{currentPage * rowsPerPage + index + 1}. {item.question}
</Accordion.Header>


              <Accordion.Body>

                <div className="d-flex justify-content-between align-items-center">
                  <div className="">
                    <div className="d-flex justify-content-start gap-1 align-items-center">
                      <Typography className="text-end" variant="h6">
                        Section:
                      </Typography>
                      <span className="fs-6">{item.sectionNumber}</span>
                    </div>
                  </div>
                  {item.videoData?.title && (
                    <div
                      className="d-flex align-items-center gap-2"
                      style={{ cursor: "pointer" }}
                      onClick={() => handlePlayOpen(item.videoData?.url)}
                    >
                      <PlayArrowIcon
                        color="success"
                        style={{ cursor: "pointer" }}
                      />
                      <Typography className="fs-6 text-primary">
                        {item.videoData.title}
                      </Typography>
                    </div>
                  )}
                  <div className="">
                    <div className="d-flex justify-content-end gap-1 align-items-center">
                      <Typography className="text-end" variant="h6">
                        <LocationPinIcon />
                      </Typography>
                      <span className="fs-6">{item.locationName}</span>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-lg-6">
                    <div className="row gy-3 align-items-center ps-1 pt-3">
                      {item.options.map((option, optIndex) => (
                        <div className="col-lg-6" key={option._id}>
                          <Typography>
                            {String.fromCharCode(65 + optIndex)}. {option.text}
                          </Typography>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div className="mt-5 d-flex justify-content-end">
                      {item.options.map((option, optIndex) =>
                        option.isCorrect ? (
                          <Chip
                            key={option._id}
                            label={`${String.fromCharCode(65 + optIndex)}. ${option.text
                              }`}
                            color="success"
                          />
                        ) : null
                      )}
                    </div>
                  </div>
                </div>
              </Accordion.Body>
            </Accordion.Item>
          ))}
        </Accordion>
        <TablePagination
          rowsPerPageOptions={[rowsPerPage]}
          component="div"
          className="paginated-custom"
          count={totalData}
          rowsPerPage={rowsPerPage}
          page={currentPage}
          onPageChange={handleChangePage}
        />
      </Box>
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
      <AddAssesmentFormFile
        handleClose={handleClose}
        show={show}
        onVideoUploaded={fetchQA}
      />
    </Box>
  );
};

export default AssesmentDashboard;
