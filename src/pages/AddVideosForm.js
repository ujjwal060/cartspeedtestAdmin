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

const AddVideoOffcanvas = ({ open, setOpen, handleClose, onVideoUploaded }) => {
  const [value, setValue] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [section, setSection] = useState("");
  const [sectionTitle, setSectionTitle] = useState("");
  const [videoSections, setVideoSections] = useState([
    {
      id: 1,
      title: "",
      description: "",
      videoFiles: [],
    },
  ]);

  const handleVideoInput = (e, sectionId) => {
    const files = Array.from(e.target.files);
    const updatedFiles = files.map((file, index) => ({
      id: `${file.name}-${index}-${Date.now()}`,
      filename: file.name,
      filesize: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
      datetime: new Date().toLocaleString(),
      fileurl: URL.createObjectURL(file),
      file: file,
    }));

    setVideoSections((prevSections) =>
      prevSections.map((section) =>
        section.id === sectionId
          ? { ...section, videoFiles: [...updatedFiles] }
          : section
      )
    );
  };

  const handleSection = async (sectionNumber) => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    try {
      const response = await sectionVideos(value, sectionNumber, token, userId);
      console.log(response);
      if (response.status === 200) {
        sectionTitle(response.data.title);
      }
    } catch (error) {
      console.error("Error checking section:", error);
    }
  };

  const handleVideoUpload = async (e) => {
    e.preventDefault();

    // Check if any section has no videos
    const hasEmptySections = videoSections.some(
      (section) => section.videoFiles.length === 0
    );

    if (hasEmptySections) {
      toast.error("Please select at least one video file in each section");
      return;
    }

    setIsSubmitting(true);
    const token = localStorage.getItem("token");

    try {
      // Create an array of all upload promises from all sections
      const uploadPromises = videoSections.flatMap((section) =>
        section.videoFiles.map((vid) => {
          const formData = new FormData();
          formData.append("title", vid.title || section.title);
          formData.append("state", value);
          formData.append("description", section.description);
          formData.append("section", section.sectionTitle || section);
          formData.append("video", vid.file);

          return addVideos(formData, token);
        })
      );

      // Wait for all uploads to complete
      const responses = await Promise.all(uploadPromises);

      // Check all responses for success
      const allSuccess = responses.every((response) => response.status === 201);

      if (allSuccess) {
        const totalVideos = videoSections.reduce(
          (sum, section) => sum + section.videoFiles.length,
          0
        );
        toast.success(`${totalVideos} Video(s) Uploaded Successfully`, {
          autoClose: 3000,
        });
        resetForm();
        setOpen(false);
        handleClose();
        onVideoUploaded();
      } else {
        throw new Error("Some videos failed to upload");
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message?.[0] || "Error uploading videos"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setValue("");
    setSection("");
    setVideoSections([
      {
        id: 1,
        title: "",
        description: "",
        videoFiles: [],
        sectionTitle: "",
      },
    ]);
  };

  const addNewSection = () => {
    if (videoSections.length >= 5) {
      toast.warning("Maximum 5 sections allowed");
      return;
    }
    setVideoSections((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        title: "",
        description: "",
        videoFiles: [],
        sectionTitle: "",
      },
    ]);
  };

  const removeSection = (sectionId) => {
    if (videoSections.length <= 1) {
      toast.warning("At least one section is required");
      return;
    }
    setVideoSections((prev) =>
      prev.filter((section) => section.id !== sectionId)
    );
  };

  const updateSectionField = (sectionId, field, value) => {
    setVideoSections((prevSections) =>
      prevSections.map((section) =>
        section.id === sectionId ? { ...section, [field]: value } : section
      )
    );
  };

  const deleteUploadedVideo = (sectionId, videoId) => {
    setVideoSections((prevSections) =>
      prevSections.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              videoFiles: section.videoFiles.filter(
                (vid) => vid.id !== videoId
              ),
            }
          : section
      )
    );
  };

  return (
    <Offcanvas show={open} onHide={handleClose} placement={"end"}>
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>Add New Videos</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        <form onSubmit={handleVideoUpload}>
          <div className="row gy-4 mb-4">
            <div className="col-lg-12">
              {/* <TextField
                variant="outlined"
                size="small"
                className="w-100"
                placeholder="Enter video state.."
                value={value}
                onChange={(e) => setValue(e.target.value)}
                required
              /> */}
            </div>
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
                  <MenuItem value={1}>Section1</MenuItem>
                  <MenuItem value={2}>Section2</MenuItem>
                  <MenuItem value={3}>Section3</MenuItem>
                  <MenuItem value={4}>Section4</MenuItem>
                  <MenuItem value={5}>Section5</MenuItem>
                </Select>
              </FormControl>
            </div>
            <div className="col-lg-6">
              <TextField
                variant="standard"
                className="w-100 h-100 full-height"
                placeholder="Enter section title.."
                value={sectionTitle}
                onChange={(e) => setSectionTitle(e.target.value)}
                required
              />
            </div>
          </div>

          {section && sectionTitle && (
            <>
              {videoSections.map((videoSection, index) => (
                <>
                  <div key={videoSection.id} className="fileupload-view mb-4">
                    <div className="kb-data-box">
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <h5>Section {index + 1}</h5>
                        {videoSections.length > 1 && (
                          <Button
                            variant="outlined"
                            color="error"
                            size="small"
                            onClick={() => removeSection(videoSection.id)}
                          >
                            Remove Section
                          </Button>
                        )}
                      </div>

                      <div className="kb-file-upload">
                        <div className="file-upload-box">
                          <input
                            type="file"
                            accept="video/*"
                            id={`fileupload-${videoSection.id}`}
                            className="file-upload-input"
                            onChange={(e) =>
                              handleVideoInput(e, videoSection.id)
                            }
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
                                  onClick={() =>
                                    deleteUploadedVideo(videoSection.id, vid.id)
                                  }
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
                              updateSectionField(
                                videoSection.id,
                                "title",
                                e.target.value
                              )
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
                              updateSectionField(
                                videoSection.id,
                                "description",
                                e.target.value
                              )
                            }
                            required
                            multiline
                            rows={4}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              ))}
            </>
          )}
          <div className="d-flex flex-column gap-2 align-items-center">
            <Button
              color="primary"
              variant="outlined"
              className="rounded-4"
              onClick={addNewSection}
              disabled={videoSections.length >= 5 || isSubmitting}
            >
              Add More Sections (Max 5)
            </Button>

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
                  videoSections.some(
                    (section) => section.videoFiles.length === 0
                  )
                }
              >
                {isSubmitting ? "Uploading..." : `Save`}
              </Button>
            </div>
          </div>
        </form>
      </Offcanvas.Body>
    </Offcanvas>
  );
};

export default AddVideoOffcanvas;
