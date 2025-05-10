

import React, { useState } from "react";
import { Button, TextField } from "@mui/material";
import Offcanvas from "react-bootstrap/Offcanvas";
import { toast } from "react-toastify";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";

const AddCertificateOffCanvas = ({ open, setOpen, handleClose }) => {
  const [value, setValue] = useState("");
  const [titleError, setTitleError] = useState(false);  
  const [section, setSection] = useState("");
  const [sectionTitle, setSectionTitle] = useState("");
  const [certificateFile, setCertificateFile] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileInput = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCertificateFile({
        file,
        filename: file.name,
        filesize: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
        fileurl: URL.createObjectURL(file),
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!section || !sectionTitle || !certificateFile || !title || !description) {
      toast.error("Please fill all fields and upload certificate file.");
      return;
    }
  
    const formData = {
      section,
      sectionTitle,
      title,
      description,
      certificateFile: {
        filename: certificateFile.filename,
        filesize: certificateFile.filesize,
      },
      timestamp: new Date().toISOString()
    };
  
    // Store in localStorage
    const existingCertificates = JSON.parse(localStorage.getItem('certificates') || '[]');
    existingCertificates.push(formData);
    localStorage.setItem('certificates', JSON.stringify(existingCertificates));
  
    setIsSubmitting(true);
  
    try {
      const response = { status: 201 }; // Simulated response
  
      if (response.status === 200 || response.status === 201) {
        toast.success("Certificate uploaded successfully.");
        resetForm(); // Form clear करें
        setOpen(false);
        handleClose();
      }
    } catch (error) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Updated resetForm function
  const resetForm = () => {
    setValue("");
    setSection("");
    setSectionTitle("");
    setCertificateFile(null);
    setTitle("");
    setDescription("");
    setTitleError(false);
  };

  return (
    <Offcanvas show={open} onHide={handleClose} placement="end">
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>Add New Certificate</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        <form onSubmit={handleSubmit}>
          <div className="row gy-4 mb-4">
            <div className="col-lg-6">
              <FormControl fullWidth variant="standard">
                <InputLabel>Select Section</InputLabel>
                <Select
                  value={section}
                  size="small"
                  onChange={(e) => setSection(e.target.value)}
                >
                  {[1, 2, 3, 4, 5].map((num) => (
                    <MenuItem key={num} value={num}>Section{num}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
            <div className="col-lg-6">
              <TextField
                variant="standard"
                className="w-100"
                placeholder="Enter section title"
                value={sectionTitle}
                onChange={(e) => setSectionTitle(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="mb-3">
            <input
              type="file"
              accept=".pdf,image/*"
              onChange={handleFileInput}
            />
            {certificateFile && (
              <p className="mt-2">
                Selected: {certificateFile.filename} ({certificateFile.filesize})
              </p>
            )}
          </div>

          <TextField
            variant="outlined"
            size="small"
            fullWidth
            placeholder="Enter certificate title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="mb-3"
          />
          <TextField
            variant="outlined"
            size="small"
            fullWidth
            placeholder="Enter certificate description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            multiline
            rows={4}
            className="mb-3"
          />

          <div className="d-flex justify-content-end gap-2">
            <Button
              onClick={resetForm}
              color="error"
              variant="contained"
              disabled={isSubmitting}
            >
              Reset
            </Button>
            <Button
              type="submit"
              color="primary"
              variant="contained"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Uploading..." : "Upload Certificate"}
            </Button>
          </div>
        </form>
      </Offcanvas.Body>
    </Offcanvas>
  );
};

export default AddCertificateOffCanvas;