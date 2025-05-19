import React, { useState, useEffect } from "react";
import {
  Box,
  Tooltip,
  Typography,
  Dialog,
  DialogContent,
  Slide,
  Breadcrumbs,
  Button,
  Chip,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  TablePagination,
  TextField,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Accordion from "react-bootstrap/Accordion";
import { useLocation } from "react-router-dom";
import { getQA } from "../api/test";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import AddAssesmentFormFile from "./AddAssesmentForm";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import FilterListIcon from "@mui/icons-material/FilterList";
import LocationPinIcon from "@mui/icons-material/LocationPin";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import ReactPlayer from "react-player";
import { toast } from "react-toastify";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const sectionStyles = {
  section1: { backgroundColor: "#fff3e0", color: "#ef6c00" },
  section2: { backgroundColor: "#d0e2ff", color: "#003f88" },
  section3: { backgroundColor: "#dcfce7", color: "#15803d" },
  section4: { backgroundColor: "#fdecea", color: "#b91c1c" },
  section5: { backgroundColor: "#ede9fe", color: "#6b21a8" },
};

const sectionOptions = [
  { label: "Section 1", key: "section1", value: "1" },
  { label: "Section 2", key: "section2", value: "2" },
  { label: "Section 3", key: "section3", value: "3" },
  { label: "Section 4", key: "section4", value: "4" },
  { label: "Section 5", key: "section5", value: "5" },
];

const AssessmentDashboard = () => {
  const rowsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(0);
  const [filters, setFilters] = useState({});
  const [show, setShow] = useState(false);
  const [getData, setGetData] = useState([]);
  const [totalData, setTotalData] = useState(0);
  const [loading, setLoading] = useState(false);
  const [openFilter, setOpenFilter] = useState(false);
  const [sectionNumber, setSectionNumber] = useState("");
  const location = useLocation();
  const { title: initialTitle, videoId } = location.state || {};
  const [title, setTitle] = useState(initialTitle || "");

  const [playOpen, setPlayOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);

  // const { title, videoId } = location.state || {};
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;
  const token = localStorage.getItem("token");

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleChangePage = (_, newPage) => setCurrentPage(newPage);
  const toggleFilter = () => setOpenFilter(!openFilter);

  const handlePlayOpen = (url) => {
    setSelectedVideo(url);
    setPlayOpen(true);
  };
  const handlePlayClose = () => setPlayOpen(false);

  const handleSectionChange = (event) => {
    const selectedSection = event.target.value;
    setSectionNumber(selectedSection);
    setFilters((prev) => ({ ...prev, sectionNumber: selectedSection }));
  };

  const handleSectionFilter = (sectionValue) => {
    if (sectionNumber === sectionValue) {
      clearSectionFilter();
    } else {
      setSectionNumber(sectionValue);
      setFilters((prev) => ({ ...prev, sectionNumber: sectionValue }));
    }
  };

  const clearSectionFilter = () => {
    setSectionNumber("");
    setFilters((prev) => {
      const { sectionNumber, ...rest } = prev;
      return rest;
    });
  };

  const handleDateChange = (update) => {
    setDateRange(update);
    setFilters((prev) => ({
      ...prev,
      startDate: update[0],
      endDate: update[1],
    }));
  };

  const fetchQA = async () => {
    const offset = currentPage * rowsPerPage;
    const limit = rowsPerPage;
    setLoading(true);
    try {
      const response = await getQA(token, offset, limit, filters);
      setGetData(response?.data || []);
      setTotalData(response?.total || 0);
    } catch (error) {
      toast.error(error?.response?.data?.message?.[0] || "Error fetching data");
    } finally {
      setLoading(false);
    }
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
    const selectedSection = sectionOptions.find(
      (opt) => opt.value === sectionNumber
    );

    return (
      <Box display="flex" alignItems="center" mb={2} flexWrap="wrap">
        {title && (
          <Chip
            label={title}
            sx={{
              backgroundColor: "#2E5AAC",
              color: "white",
              fontWeight: "bold",
              fontSize: "0.875rem",
              maxWidth: 200,
              textOverflow: "ellipsis",
              overflow: "hidden",
              padding: "0 20px",
            }}
          />
        )}

        {selectedSection && (
          <Chip
            label={selectedSection.label.replace("Section ", "section")}
            className={`${title && "custom-design-chip"}`}
            sx={{
              backgroundColor: "#2E5AAC",
              color: "white",
              fontWeight: "bold",
              fontSize: "0.875rem",
              textTransform: "lowercase",
              maxWidth: 150,
              textOverflow: "ellipsis",
              overflow: "hidden",
              padding: "0 20px",
            }}
          />
        )}

        {(title || selectedSection) && (
          <Chip
            icon={<CloseIcon fontSize="small" />}
            label="Clear"
            onClick={() => {
              setSectionNumber("");
              setTitle("");
              setFilters((prev) => {
                const { sectionNumber, title, ...rest } = prev;
                return rest;
              });
            }}
            sx={{
              backgroundColor: "#e0e0e0",
              color: "#2E5AAC",
              fontWeight: 500,
              fontSize: "0.85rem",
              "& .MuiChip-icon": {
                color: "#2E5AAC",
              },
              ml: 1,
            }}
          />
        )}
      </Box>
    );
  };

  if (loading) {
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
        {renderBreadcrumb()}

        <Box
          display="flex"
          justifyContent="flex-end"
          gap={2}
          mb={4}
          alignItems="center"
        >
          <div className="d-flex justify-content-between align-items-center w-100">
            <Box display="flex" alignItems="center" gap={2} flexWrap="wrap">
              {sectionOptions.map((section) => (
                <Box key={section.key} textAlign="center">
                  <Tooltip title={section.label} arrow>
                    <Box
                      sx={{
                        width: 28,
                        height: 28,
                        borderRadius: "4px",
                        backgroundColor:
                          sectionStyles[section.key].backgroundColor,
                        border: `2px solid ${
                          sectionNumber === section.value
                            ? "#000"
                            : sectionStyles[section.key].color
                        }`,
                        cursor: "pointer",
                        mx: "auto",
                      }}
                      onClick={() => handleSectionFilter(section.value)}
                    />
                  </Tooltip>
                  <Typography variant="caption">{section.label}</Typography>
                </Box>
              ))}
            </Box>
            <div className="d-flex gap-3 flex-row">
              {openFilter && (
                <>
                  <TextField
                    label="Search by Location"
                    variant="outlined"
                    size="small"
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        location: e.target.value,
                      }))
                    }
                  />

                  <Box className="custom-picker">
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
                </>
              )}

              <Tooltip title="Filter" placement="top">
                <Box display="flex" alignItems="center">
                  <FilterListIcon
                    onClick={toggleFilter}
                    color="primary"
                    style={{ cursor: "pointer" }}
                  />
                </Box>
              </Tooltip>

              <Button
                variant="contained"
                color="primary"
                startIcon={<AddCircleOutlineIcon />}
                onClick={handleShow}
              >
                Assessment
              </Button>
            </div>
          </div>
        </Box>

        <Accordion className="d-flex flex-column gap-3 custom-accordion" flush>
          {getData.map((item, index) => (
            <Accordion.Item eventKey={index.toString()} key={item._id}>
              <Accordion.Header
                className="accordion-button p-0"
                style={sectionStyles[`section${item.sectionNumber}`] || {}}
              >
                Q{currentPage * rowsPerPage + index + 1}. {item.question}
              </Accordion.Header>
              <Accordion.Body>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Box>
                    <Box display="flex" gap={1} alignItems="center">
                      <Typography variant="h6">Section:</Typography>
                      <Typography>{item.sectionNumber}</Typography>
                    </Box>
                  </Box>
                  {item.videoData?.title && (
                    <Box
                      display="flex"
                      alignItems="center"
                      gap={2}
                      sx={{ cursor: "pointer" }}
                      onClick={() => handlePlayOpen(item.videoData?.url)}
                    >
                      <PlayArrowIcon color="success" />
                      <Typography color="primary">
                        {item.videoData.title}
                      </Typography>
                    </Box>
                  )}
                  <Box>
                    <Box display="flex" gap={1} alignItems="center">
                      <LocationPinIcon />
                      <Typography>{item.locationName}</Typography>
                    </Box>
                  </Box>
                </Box>

                <div className="row gy-4 mt-3">
                  <div className="col-lg-4">
                    {item.options.slice(0, 2).map((option, optIndex) => (
                      <Typography key={option._id} sx={{ mb: 1 }}>
                        {String.fromCharCode(65 + optIndex)}. {option.text}
                      </Typography>
                    ))}
                  </div>

                  <div className="col-lg-4">
                    {item.options.slice(2, 4).map((option, optIndex) => (
                      <Typography key={option._id} sx={{ mb: 1 }}>
                        {String.fromCharCode(65 + optIndex + 2)}. {option.text}
                      </Typography>
                    ))}
                  </div>

                  <div className="col-lg-4">
                    <div className="d-flex align-items-end justify-content-end h-100">
                      {item.options
                        .filter((option) => option.isCorrect)
                        .map((option, optIndex) => (
                          <Chip
                            key={option._id}
                            label={`${String.fromCharCode(
                              65 + item.options.indexOf(option)
                            )}. ${option.text}`}
                            color="success"
                            sx={{ ml: 1 }}
                          />
                        ))}
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
        onClose={handlePlayClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogContent>
          <ReactPlayer
            url={selectedVideo}
            controls
            width="100%"
            style={{ margin: "0 auto" }}
          />
          <Box textAlign="center" mt={2}>
            <Button
              variant="contained"
              color="error"
              onClick={handlePlayClose}
              sx={{ px: 5 }}
            >
              Close
            </Button>
          </Box>
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

export default AssessmentDashboard;
