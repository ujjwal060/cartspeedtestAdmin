import React, { useState } from "react";
import { Button, TextField } from "@mui/material";
import Offcanvas from "react-bootstrap/Offcanvas";
import { addVideos } from "../api/video";
import { toast } from "react-toastify";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import { sectionVideos } from "../api/video";

const AddVideoOffcanvas = ({
  open,
  setOpen,
  handleClose,
  onVideoUploaded,
  setUploadingLoading,
}) => {
  const [value, setValue] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [section, setSection] = useState("");
  const [sectionTitle, setSectionTitle] = useState("");
  const [titleError, setTitleError] = useState(false);

  // Changed to single section instead of array
  const [videoSection, setVideoSection] = useState({
    id: 1,
    title: "",
    description: "",
    videoFiles: [],
  });

  const handleVideoInput = (e) => {
    const files = Array.from(e.target.files);
    const updatedFiles = files.map((file, index) => ({
      id: `${file.name}-${index}-${Date.now()}`,
      filename: file.name,
      filesize: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
      datetime: new Date().toLocaleString(),
      fileurl: URL.createObjectURL(file),
      file: file,
    }));

    setVideoSection((prev) => ({
      ...prev,
      videoFiles: [...updatedFiles],
    }));
  };

  const handleSection = async (sectionNumber) => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    try {
      const response = await sectionVideos(value, sectionNumber, token, userId);
      if (response.status === 200) {
        if (response.data.title) {
          setSectionTitle(response.data.title);
          setTitleError(false);
        } else {
          setSectionTitle("");
          setTitleError(true);
        }
      }
    } catch (error) {
      console.error("Error checking section:", error);
      setTitleError(true);
    }
  };

  const handleVideoUpload = async (e) => {
    e.preventDefault();

    if (!section || !sectionTitle) {
      toast.error("Please select a section and enter section title");
      return;
    }

    if (videoSection.videoFiles.length === 0) {
      toast.error("Please select at least one video file");
      return;
    }

    setIsSubmitting(true);
    setUploadingLoading(true);
    const token = localStorage.getItem("token");

    try {
      const uploadPromises = videoSection.videoFiles.map((vid) => {
        const formData = new FormData();
        formData.append("title", vid.title || videoSection.title || "");
        formData.append("description", videoSection.description || "");
        formData.append("image", vid.file);
        formData.append("sectionNumber", section);
        formData.append("sectionTitle", sectionTitle);

        return addVideos(formData, token);
      });

      const responses = await Promise.all(uploadPromises);
      console.log("API Responses:", responses); // Debugging

      const allSuccess = responses.every((response) => {
        if (!response) return false;
        // Some APIs return success on 200, not just 201
        return response.status === 200 || response.status === 201;
      });

      if (allSuccess) {
        toast.success(
          `${videoSection.videoFiles.length} Video(s) Uploaded Successfully`,
          {
            autoClose: 3000,
          }
        );
        setUploadingLoading(false);
        resetForm();
        setOpen(false);
        handleClose();
        onVideoUploaded();
      } else {
        const firstError = responses.find((r) => !r || r.status !== 201);
        setUploadingLoading(false);

        throw new Error(
          firstError?.data?.message || "Some videos failed to upload"
        );
      }
    } catch (error) {
      console.error("Full error object:", error);

      let errorMessage = "Error uploading videos";
      if (error.response) {
        // Handle different backend error formats
        errorMessage =
          (Array.isArray(error.response.data?.message)
            ? error.response.data.message[0]
            : error.response.data?.message) ||
          error.response.data?.error ||
          error.response.statusText ||
          `Server error (${error.response.status})`;
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
      setUploadingLoading(false);
    }
  };
  const resetForm = () => {
    setValue("");
    setSection("");
    setSectionTitle("");
    setTitleError(false);
    setVideoSection({
      id: 1,
      title: "",
      description: "",
      videoFiles: [],
    });
  };

  const updateSectionField = (field, value) => {
    setVideoSection((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const deleteUploadedVideo = (videoId) => {
    setVideoSection((prev) => ({
      ...prev,
      videoFiles: prev.videoFiles.filter((vid) => vid.id !== videoId),
    }));
  };

  return (
    <Offcanvas show={open} onHide={handleClose} placement={"end"}   backdrop="static">
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>Add New Videos</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        <form onSubmit={handleVideoUpload}>
          <div className="row gy-4 mb-4">
            <div className="col-lg-6">
              <FormControl fullWidth variant="standard">
                <InputLabel id="demo-simple-select-label">
                  Select Section
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={section}
                  size="small"
                  label="Select Section"
                  onChange={(e) => {
                    setSection(e.target.value);
                    handleSection(e.target.value);
                  }}
                >
                  {[1, 2, 3, 4, 5].map((num) => (
                    <MenuItem key={num} value={num}>
                      Section{num}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
            <div className="col-lg-6">
              <TextField
                variant="standard"
                className="w-100 h-100 full-height"
                placeholder="Enter section title.."
                value={sectionTitle}
                onChange={(e) => {
                  setSectionTitle(e.target.value);
                  setTitleError(false);
                }}
                required
                error={titleError}
                helperText={titleError ? "Title is required" : ""}
              />
            </div>
          </div>

          {section && sectionTitle && (
            <div className="fileupload-view mb-4">
              <div className="kb-data-box">
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
                  {videoSection.videoFiles.length > 0 && (
                    <p className="mt-2">
                      {videoSection.videoFiles.length} video(s) selected
                    </p>
                  )}
                </div>

                <div className="kb-attach-box mb-3">
                  {videoSection.videoFiles.map((vid) => (
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
                      value={videoSection.title}
                      onChange={(e) =>
                        updateSectionField("title", e.target.value)
                      }
                      required
                    />
                  </div>

                  <div className="col-lg-12">
                    <TextField
                      variant="outlined"
                      size="small"
                      placeholder="Enter video description.."
                      className="w-100"
                      value={videoSection.description}
                      onChange={(e) =>
                        updateSectionField("description", e.target.value)
                      }
                      required
                      multiline
                      rows={4}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="d-flex gap-2 justify-content-end">
            <Button
              onClick={resetForm}
              color="error"
              variant="contained"
              className="rounded-4"
              disabled={isSubmitting}
            >
              Reset
            </Button>
            <Button
              type="submit"
              color="success"
              variant="contained"
              className="rounded-4"
              disabled={
                isSubmitting ||
                videoSection.videoFiles.length === 0 ||
                titleError
              }
            >
              {isSubmitting ? "Uploading..." : `Save`}
            </Button>
          </div>
        </form>
      </Offcanvas.Body>
    </Offcanvas>
  );
};

export default AddVideoOffcanvas;
