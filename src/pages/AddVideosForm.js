import React, { useState } from "react";
import { Button, TextField } from "@mui/material";
import Offcanvas from "react-bootstrap/Offcanvas";
import { addVideos } from "../api/video";
import { toast } from "react-toastify";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Autocomplete from "@mui/material/Autocomplete";

const AddVideoOffcanvas = ({
  open,
  setOpen,
  handleClose,
  onVideoUploaded,
  deleteUploadedVideo,
  videoFiles,
  setVideoFiles,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [value, setValue] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [level, setLevel] = useState("");
  const [section, setSection] = useState("");

  const handleChange = (event) => {
    setLevel(event.target.value);
  };

  const handleVideoInput = (e) => {
    const files = Array.from(e.target.files);
    const updatedFiles = files.map((file, index) => ({
      id: `${file.name}-${index}-${Date.now()}`, // Added timestamp for better uniqueness
      filename: file.name,
      filesize: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
      datetime: new Date().toLocaleString(),
      fileurl: URL.createObjectURL(file),
      file: file,
    }));
    setVideoFiles((prev) => [...prev, ...updatedFiles]); // Append new files to existing ones
  };

  const handleVideoUpload = async (e) => {
    e.preventDefault();

    if (videoFiles.length === 0) {
      toast.error("Please select at least one video file");
      return;
    }

    setIsSubmitting(true);
    const token = localStorage.getItem("token");

    try {
      const uploadPromises = videoFiles.map((vid) => {
        const formData = new FormData();
        formData.append("title", vid.title || title);
        formData.append("state", value);
        formData.append("description", description);
        formData.append("section", section);
        formData.append("video", vid.file); // Changed from "image" to "video"

        return addVideos(formData, token);
      });

      // Wait for all uploads to complete
      const responses = await Promise.all(uploadPromises);

      // Check all responses for success
      const allSuccess = responses.every((response) => response.status === 201);

      if (allSuccess) {
        toast.success(`${videoFiles.length} Video(s) Uploaded Successfully`, {
          autoClose: 3000,
        });
        setTitle("");
        setValue("");
        setDescription("");
        setLevel("");
        setSection("");
        setVideoFiles([]);
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

  const modalClose = () => {
    setTitle("");
    setValue("");
    setVideoFiles([]);
    setDescription("");
  };

  return (
    <Offcanvas show={open} onHide={handleClose} placement={"end"}>
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>Add New Videos</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        <form onSubmit={handleVideoUpload}>
          <TextField
            variant="outlined"
            size="small"
            className="w-100"
            placeholder="Enter video state.."
            value={value}
            onChange={(e) => setValue(e.target.value)}
            required
          />
          <div className="fileupload-view">
            <div className="kb-data-box">
              <div className="kb-file-upload">
                <div className="file-upload-box">
                  <input
                    type="file"
                    accept="video/*"
                    id="fileupload"
                    className="file-upload-input"
                    onChange={handleVideoInput}
                    multiple // Added multiple attribute
                  />
                  <span>
                    Drag and drop or{" "}
                    <span className="file-link">Choose your files</span>
                  </span>
                </div>
                {videoFiles.length > 0 && (
                  <p className="mt-2">{videoFiles.length} video(s) selected</p>
                )}
              </div>

              <div className="kb-attach-box mb-3">
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
                <div className="col-lg-6">
                  <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">
                      Select Section
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={section}
                      label="Select Section"
                      size="small"
                      onChange={(e) => setSection(e.target.value)}
                    >
                      <MenuItem value={"Section1"}>Section1</MenuItem>
                      <MenuItem value={"Section2"}>Section2</MenuItem>
                      <MenuItem value={"Section3"}>Section3</MenuItem>
                      <MenuItem value={"Section4"}>Section4</MenuItem>
                      <MenuItem value={"Section5"}>Section5</MenuItem>
                    </Select>
                  </FormControl>
                </div>
                <div className="col-lg-6">
                  <TextField
                    variant="outlined"
                    size="small"
                    className="w-100"
                    placeholder="Enter video title.."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    // disabled
                  />
                </div>
                <div className="col-lg-12">
                  <TextField
                    variant="outlined"
                    size="small"
                    className="w-100"
                    placeholder="Enter video title.."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>

                <div className="col-lg-12">
                  <TextField
                    variant="outlined"
                    size="small"
                    placeholder="Enter video description.."
                    className="w-100"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    multiline
                    rows={4}
                  />
                </div>
              </div>

              <div className="kb-buttons-box d-flex justify-content-end gap-2 align-items-center">
                <Button
                  onClick={modalClose}
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
                  disabled={isSubmitting || videoFiles.length === 0}
                >
                  {isSubmitting
                    ? "Uploading..."
                    : `Upload ${videoFiles.length} Video(s)`}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </Offcanvas.Body>
    </Offcanvas>
  );
};

export default AddVideoOffcanvas;
