import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Tooltip,
  Typography,
  Dialog,
  DialogContent,
  Slide,
  // Breadcrumbs,
  Button,
  Chip,
  // InputLabel,
  // MenuItem,
  // FormControl,
  // Select,
  TablePagination,
  TextField,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { FaEdit, FaTrash } from "react-icons/fa";
import Accordion from "react-bootstrap/Accordion";
import { useLocation } from "react-router-dom";
import { getQA, editQA, deleteQA } from "../api/test";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import AddAssesmentFormFile from "./AddAssesmentForm";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import FilterListIcon from "@mui/icons-material/FilterList";
import LocationPinIcon from "@mui/icons-material/LocationPin";
import ReactPlayer from "react-player";
import { toast } from "react-toastify";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { Link, useNavigate } from "react-router-dom";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CancelIcon from "@mui/icons-material/Cancel";
import Radio from "@mui/material/Radio";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import { debounce } from "lodash";
import DialogBox from "../components/deleteDialog";

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
  const [currentId, setCurrentId] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [filters, setFilters] = useState({});
  const [show, setShow] = useState(false);
  const [getData, setGetData] = useState([]);
  const [totalData, setTotalData] = useState(0);
  const [loading, setLoading] = useState(false);
  const [openFilter, setOpenFilter] = useState(false);
  const [sectionNumber, setSectionNumber] = useState("");
  const location = useLocation();
  const { title: initialTitle, videoId, adminName } = location.state || {};
  console.log(adminName, "..assesment page admin");
  const [title, setTitle] = useState(initialTitle || "");
  const [editData, setEditData] = useState(null);
  const [data, setData] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [open, setOpen] = useState(false);
  const [playOpen, setPlayOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);

  // const { title, videoId } = location.state || {};
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({
    question: "",
    options: [],
  });
  const role = localStorage.getItem("role");

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

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

  const handleCancelEdit = () => {
    setEditId(null);
    setEditForm({ question: "", options: [] });
  };

  const dialogClose = () => setOpen(false);
  const dialogOpen = (id) => {
    setOpen(true);
    setCurrentId(id);
  };

  const handleDelete = async () => {
    console.log(currentId);
    try {
      const response = await deleteQA(currentId);
      if (response && response.status === 200) {
        toast.success(response.message || "Question deleted successfully");
        fetchQA(); // Refresh the data
        setOpen(false);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete question");
      console.error("Error deleting question:", error);
      setOpen(false);
    }
  };
  const handleSaveEdit = async () => {
    try {
      // Find the correct answer index
      const correctAnswerIndex = editForm.options.findIndex(
        (opt) => opt.isCorrect
      );
      const answer =
        correctAnswerIndex >= 0
          ? editForm.options[correctAnswerIndex].text
          : "";

      const response = await editQA(
        token,
        editId,
        editForm.question,
        editForm.options,
        answer
      );

      if (response && response.status === 200) {
        toast.success(response.message || "Question updated successfully");
        fetchQA(); // Refresh the data
        setEditId(null);
        setEditForm({ question: "", options: [] });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update question");
      console.error("Error updating question:", error);
    }
  };

  // const handleEditClick = (item) => {
  //   console.log("Rendering options for:", item._id, item.options);
  //   setEditId(item._id);
  //   setEditForm({
  //     question: item.question,
  //     options: item.options.map((opt) => ({ ...opt })),
  //   });
  // };

  const handleEditClick = (item) => {
    setEditId(item._id);
    setEditForm({
      question: item.question,
      options: item.options.map((opt) => ({
        text: opt.text,
        isCorrect: opt.isCorrect,
      })),
    });
  };

  const renderBreadcrumb = () => {
    const selectedSection = sectionOptions.find(
      (opt) => opt.value === sectionNumber
    );

    return (
      <Box display="flex" alignItems="center" mb={2} flexWrap="wrap" gap={1}>
        {adminName && (
          <Chip
            label={`Admin: ${adminName}`}
            sx={{
              backgroundColor: "#2E5AAC",
              color: "white",
              fontWeight: "bold",
              fontSize: "0.875rem",
              maxWidth: 200,
              textOverflow: "ellipsis",
              overflow: "hidden",
              padding: "0 20px",
              height: "32px",
              "& .MuiChip-label": {
                padding: "0 8px",
              },
            }}
          />
        )}

        {title && (
          <Link to="/videos" style={{ textDecoration: "none" }}>
            <Chip
              label={title}
              className="custom-design-chip"
              onClick={(e) => {
                e.preventDefault();
                navigate("/videos");
              }}
              sx={{
                backgroundColor: "#2E5AAC",
                color: "white",
                fontWeight: "bold",
                fontSize: "0.875rem",
                maxWidth: 200,
                textOverflow: "ellipsis",
                overflow: "hidden",
                padding: "0 20px",
                height: "32px",
                cursor: "pointer",
                "&:hover": {
                  backgroundColor: "#1d4a9c",
                },
                "& .MuiChip-label": {
                  padding: "0 8px",
                },
              }}
            />
          </Link>
        )}

        {selectedSection && (
          <Chip
            label={selectedSection.label.replace("Section ", "section")}
            className="custom-design-chip"
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
              height: "32px",
              "& .MuiChip-label": {
                padding: "0 8px",
              },
            }}
          />
        )}

        {(adminName || title || selectedSection) && (
          <Chip
            icon={<CloseIcon fontSize="small" />}
            label="Clear"
            onClick={() => {
              setSectionNumber("");
              setTitle("");
              // Clear adminName if it exists
              if (adminName) {
                // You might need to update the state in the parent component
                // or use a different approach depending on how adminName is managed
                // This assumes adminName is managed in this component's state
                // If it comes from props, you'll need to call a prop function to clear it
                navigate(location.pathname, {
                  state: {
                    ...(location.state || {}),
                    adminName: undefined,
                  },
                  replace: true,
                });
              }
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
              height: "32px",
              "& .MuiChip-icon": {
                color: "#2E5AAC",
              },
              "& .MuiChip-label": {
                padding: "0 8px",
              },
            }}
          />
        )}
      </Box>
    );
  };
  return (
    <Box>
      {loading ? (
        <>
          {" "}
          <div className="">
            <div className="global-loader margin-loader ">
              <div className="loader-animation">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          {" "}
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
                        label="Search by PinCode"
                        variant="outlined"
                        size="small"
                        value={inputValue.location || ""}
                        onChange={(e) => {
                          const value = e.target.value;
                          // Only allow numbers and max 6 digits
                          if (/^\d{0,6}$/.test(value)) {
                            handleFilterChange("location", value);
                          }
                        }}
                        inputProps={{
                          inputMode: "numeric", // Shows numeric keyboard on mobile
                          pattern: "[0-9]{6}", // HTML5 validation pattern
                          maxLength: 6, // Hard limit on input length
                        }}
                      
                        error={
                          inputValue.location &&
                          inputValue.location.length !== 6
                        }
                      />
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

                  {role === "admin" && (
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={<AddCircleOutlineIcon />}
                      onClick={handleShow}
                    >
                      Assessment
                    </Button>
                  )}
                </div>
              </div>
            </Box>

            <Accordion
              className="d-flex flex-column gap-3 custom-accordion"
              flush
            >
              {getData.map((item, index) => (
                <Accordion.Item eventKey={index.toString()} key={item._id}>
                  <Accordion.Header
                    className="accordion-button p-0 d-flex justify-content-between align-items-center"
                    style={sectionStyles[`section${item.sectionNumber}`] || {}}
                  >
                    <div className="d-flex align-items-center w-100 justify-content-between">
                      <span
                        className="text-truncate"
                        style={{ maxWidth: "70%" }}
                      >
                        Q{currentPage * rowsPerPage + index + 1}.{" "}
                        {editId === item._id ? (
                          <TextField
                            fullWidth
                            variant="standard"
                            value={editForm.question}
                            onChange={(e) =>
                              setEditForm((prev) => ({
                                ...prev,
                                question: e.target.value,
                              }))
                            }
                          />
                        ) : (
                          item.question
                        )}
                      </span>
                      {role === "admin" && (
                        <>
                          {" "}
                          <div
                            className="d-flex align-items-center me-2"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {editId === item._id ? (
                              <>
                                {/* <Button
                          size="small"
                          color="success"
                          onClick={handleSaveEdit}
                          className="me-2"
                        >
                          Save
                        </Button> */}
                                <CheckCircleOutlineIcon
                                  onClick={handleSaveEdit}
                                  fontSize="medium"
                                  color="success"
                                  className="me-2 cursor-pointer"
                                />
                                <CancelIcon
                                  onClick={handleCancelEdit}
                                  fontSize="medium"
                                  color="error"
                                  className="cursor-pointer"
                                />
                              </>
                            ) : (
                              <>
                                <FaEdit
                                  size={16}
                                  color="blue"
                                  className="me-3 cursor-pointer"
                                  onClick={() => handleEditClick(item)}
                                />
                                <FaTrash
                                  size={16}
                                  color="red"
                                  className="cursor-pointer"
                                  onClick={() => dialogOpen(item._id)}
                                />
                              </>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  </Accordion.Header>

                  <Accordion.Body>
                    <div className="row gy-4 ">
                      <div className="col-lg-12">
                        <div className="d-flex flex-row justify-content-between align-items-center">
                          <p>
                            <LocationPinIcon />
                            {item?.locationName}
                          </p>
                          {role !== "admin" && (
                            <p>
                              <SupervisorAccountIcon />
                              {item?.adminName}
                            </p>
                          )}
                        </div>

                        <Box
                          display="grid"
                          gridTemplateColumns="repeat(4, 1fr)"
                          gap={2}
                        >
                          {item.options.map((option, optIndex) => (
                            <Box
                              key={optIndex}
                              display="flex"
                              alignItems="center"
                              sx={{
                                mb: 1,
                                p: 1,
                                border: "1px solid",
                                borderColor: option.isCorrect
                                  ? "success.main"
                                  : "divider",
                                borderRadius: 1,
                              }}
                            >
                              <Typography sx={{ mr: 1, fontWeight: "bold" }}>
                                {String.fromCharCode(65 + optIndex)}.
                              </Typography>

                              {editId === item._id ? (
                                <>
                                  <TextField
                                    variant="outlined"
                                    size="small"
                                    value={
                                      editForm.options[optIndex]?.text || ""
                                    }
                                    onChange={(e) =>
                                      setEditForm((prev) => {
                                        const updatedOptions = [
                                          ...prev.options,
                                        ];
                                        updatedOptions[optIndex].text =
                                          e.target.value;
                                        return {
                                          ...prev,
                                          options: updatedOptions,
                                        };
                                      })
                                    }
                                    sx={{ flexGrow: 1, mr: 1 }}
                                  />
                                  <Radio
                                    checked={
                                      editForm.options[optIndex]?.isCorrect
                                    }
                                    onChange={() =>
                                      setEditForm((prev) => {
                                        const updatedOptions = prev.options.map(
                                          (opt, i) => ({
                                            ...opt,
                                            isCorrect: i === optIndex,
                                          })
                                        );
                                        return {
                                          ...prev,
                                          options: updatedOptions,
                                        };
                                      })
                                    }
                                    color="success"
                                  />
                                </>
                              ) : (
                                <>
                                  <Typography sx={{ flexGrow: 1 }}>
                                    {option.text}
                                  </Typography>
                                  <Radio
                                    checked={option.isCorrect}
                                    color="success"
                                    disabled
                                  />
                                </>
                              )}
                            </Box>
                          ))}
                        </Box>
                      </div>

                      {/* <div className="col-lg-4 d-flex align-items-end justify-content-end">
                    {!editId &&
                      item.options
                        .filter((option) => option.isCorrect)
                        .map((option) => (
                          <Chip
                            key={option._id}
                            label={`${String.fromCharCode(
                              65 + item.options.indexOf(option)
                            )}. ${option.text}`}
                            color="success"
                            sx={{ ml: 1 }}
                          />
                        ))}
                  </div> */}
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
        </>
      )}

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
        handleClose={() => {
          setEditData(null);
          setShow(false);
        }}
        show={show}
        onVideoUploaded={fetchQA}
        editData={editData}
      />

      <DialogBox open={open} onClose={dialogClose} onDelete={handleDelete} />
    </Box>
  );
};

export default AssessmentDashboard;
