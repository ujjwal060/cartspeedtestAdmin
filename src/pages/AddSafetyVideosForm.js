import React, { useState } from "react";
import { Button, TextField } from "@mui/material";
import Offcanvas from "react-bootstrap/Offcanvas";
import { toast } from "react-toastify";

import { addSafetyVideo } from ".././api/video";
const AddSafetyVideoOffcanvas = ({
  open,
  setOpen,
  handleClose,
  onVideoUploaded,
  uploadingloading,
  setUploadingLoading,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [image, setImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image) {
      toast.error("Please select an image");
      return;
    }

    if (!formData.title || !formData.description) {
      toast.error("Please fill all required fields");
      return;
    }

    setUploadingLoading(true);
    setIsSubmitting(true);
    const token = localStorage.getItem("token");

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("image", image);

      const data = await addSafetyVideo(token, formDataToSend);

      toast.success("Safety Video Added Successfully");
      resetForm();
      handleClose();
      setUploadingLoading(false);
      if (onVideoUploaded) onVideoUploaded();
    } catch (error) {
      console.error("Error:", error);
      setUploadingLoading(false);
      toast.error(error.message || "Error uploading safety video");
    } finally {
      setIsSubmitting(false);
    }
  };
  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
    });
    setImage(null);
    setPreviewImage(null);
  };

  const removeImage = () => {
    setImage(null);
    setPreviewImage(null);
  };

  return (
    <Offcanvas
      show={open}
      onHide={handleClose}
      placement="end"
      className="offcanvas-large"
      backdrop="static"
    >
      {isSubmitting ? (
        <Offcanvas.Header>
          <Offcanvas.Title>Add New Safety Video</Offcanvas.Title>
        </Offcanvas.Header>
      ) : (
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Add New Safety Video </Offcanvas.Title>
        </Offcanvas.Header>
      )}

      <Offcanvas.Body>
        <form onSubmit={handleSubmit}>
          <div className="row gy-4 mb-4">
            <div className="col-lg-12">
              <div className="fileupload-view">
                <div className="kb-data-box">
                  <div className="kb-file-upload">
                    <div className="file-upload-box">
                      <input
                        type="file"
                        accept="image/*,video/*"
                        id="imageupload"
                        className="file-upload-input"
                        onChange={handleImageChange}
                        required
                      />
                      <span>
                        {previewImage
                          ? "Change file"
                          : "Choose safety video file (image or video)"}
                      </span>
                    </div>
                  </div>

                  {previewImage && (
                    <div className="kb-attach-box mb-3">
                      <div className="file-atc-box">
                        <div className="file-image">
                          {image.type.includes("image") ? (
                            <img
                              src={previewImage}
                              alt="Preview"
                              style={{ width: "100px", height: "auto" }}
                            />
                          ) : (
                            <video
                              width="100"
                              height="60"
                              controls
                              src={previewImage}
                            />
                          )}
                        </div>
                        <div className="file-detail">
                          <h6>{image.name}</h6>
                          <p>
                            Size: {(image.size / (1024 * 1024)).toFixed(2)} MB
                          </p>
                          <div className="file-actions">
                            <button
                              type="button"
                              className="file-action-btn"
                              onClick={removeImage}
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="col-lg-12">
              <TextField
                variant="outlined"
                size="small"
                className="w-100"
                placeholder="Enter safety video title.."
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="col-lg-12">
              <TextField
                variant="outlined"
                size="small"
                placeholder="Enter safety video description.."
                className="w-100"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                multiline
                rows={4}
              />
            </div>
          </div>

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
              disabled={isSubmitting || !image}
            >
              {isSubmitting ? "Uploading..." : "Save"}
            </Button>
          </div>
        </form>
      </Offcanvas.Body>
    </Offcanvas>
  );
};

export default AddSafetyVideoOffcanvas;
