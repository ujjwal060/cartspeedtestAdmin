import React, { useState } from "react";
import { Button, TextField } from "@mui/material";
import Offcanvas from "react-bootstrap/Offcanvas";
import { addVideos } from "../api/video";
import { toast } from "react-toastify";
const AddVideoOffcanvas = ({
  open,
  setOpen,
  handleClose,
  selectedVideos,
  deleteUploadedVideo,
  videoFiles,
  setVideoFiles,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [value, setValue] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleVideoInput = (e) => {
    const files = Array.from(e.target.files);
    const updatedFiles = files.map((file, index) => ({
      id: `${file.name}-${index}`,
      filename: file.name,
      filesize: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
      datetime: new Date().toLocaleString(),
      fileurl: URL.createObjectURL(file),
      file: file,
    }));
    setVideoFiles((prev) => [...updatedFiles]);
  };

  const handleVideoUpload = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const token = localStorage.getItem("token");

    const formData = new FormData();
    formData.append("title", title);
    formData.append("state", value);
    formData.append("description", description);

    videoFiles.forEach((vid) => {
      formData.append("image", vid.file);
    });

    try {
      const response = await addVideos(formData, token);

      if (response.status === 201) {
        toast.success("Video Uploaded Successfully", {
          autoClose: 3000,
        });
        setTitle("");
        setValue("");
        setDescription("");
        setVideoFiles([]);
        setOpen(false);
        handleClose();
        setIsSubmitting(false);
      }
    } catch (err) {
      console.error("Video upload failed:", err);
    }
  };

  const modalClose = () => {
    setTitle("");
    setValue("");
    setVideoFiles([]);
    setDescription("");
  }

  return (
    <Offcanvas show={open} onHide={handleClose} placement={"end"}>
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>Add New Video</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        <form onSubmit={handleVideoUpload}>
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
                  />
                  <span>
                    Drag and drop or{" "}
                    <span className="file-link">Choose your files</span>
                  </span>
                </div>
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
                  {/* <Autocomplete
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
                    freeSolo={false}
                    clearOnBlur={false}
                    selectOnFocus={true}
                    handleHomeEndKeys={true}
                    onChange={(event, newValue) => {
                      setValue(newValue);
                    }}
                    renderInput={(params) => (
                      <TextField {...params} label="Add Your State" />
                    )}
                  /> */}
                  <TextField
                    variant="outlined"
                    size="small"
                    className="w-100"
                    placeholder="Enter video state.."
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
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
                  />
                </div>
              </div>

              <div className="kb-buttons-box d-flex justify-content-end gap-2">
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
                  disabled={isSubmitting}
                  loading={isSubmitting}
                  loadingPosition="start"
                >
                  Save
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
