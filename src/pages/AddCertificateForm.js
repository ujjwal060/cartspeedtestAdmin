
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

const AddCertificateOffCanvas =
({ open, setOpen, handleClose, onCertificateUploaded})=> {
  const [value, setValue] = useState("");

  const [titleError, setTitleError] = useState(false);  


  const [section, setSection] = useState("");
  const [sectionTitle, setSectionTitle] = useState("");
  const [certificateFile, setCertificateFile] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Changed to single section instead of array
  const [videoSection, setVideoSection] = useState({
    id: 1,
    title: "",
    description: "",
    videoFiles: [],
  });

  

 
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

    setIsSubmitting(true);
    const token = localStorage.getItem("token");

    try {
      const formData = new FormData();
      formData.append("sectionNumber", section);
      formData.append("sectionTitle", sectionTitle);
      formData.append("title", title);
      formData.append("description", description);
      formData.append("certificateFile", certificateFile.file);

      // const response = await addCertificate(formData, token); // your API call
      // Simulated success response:
      const response = { status: 201 };

      if (response.status === 200 || response.status === 201) {
        toast.success("Certificate uploaded successfully.");
        resetForm();
        setOpen(false);
        handleClose();
        onCertificateUploaded();
      } else {
        throw new Error("Failed to upload certificate");
      }
    } catch (error) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
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

 

  return (
    // <Offcanvas show={open} onHide={handleClose} placement={"end"}>
    //   <Offcanvas.Header closeButton>
    //     <Offcanvas.Title>Add New Videos</Offcanvas.Title>
    //   </Offcanvas.Header>
    //   <Offcanvas.Body>
    //     <form onSubmit={handleVideoUpload}>
    //       <div className="row gy-4 mb-4">
    //         <div className="col-lg-6">
    //           <FormControl fullWidth variant="standard">
    //             <InputLabel id="demo-simple-select-label">
    //               Select Section
    //             </InputLabel>
    //             <Select
    //               labelId="demo-simple-select-label"
    //               id="demo-simple-select"
    //               value={section}
    //               size="small"
    //               label="Select Section"
    //               onChange={(e) => {
    //                 setSection(e.target.value);
    //                 handleSection(e.target.value);
    //               }}
    //             >
    //               {[1, 2, 3, 4, 5].map((num) => (
    //                 <MenuItem key={num} value={num}>Section{num}</MenuItem>
    //               ))}
    //             </Select>
    //           </FormControl>
    //         </div>
    //         <div className="col-lg-6">
    //           <TextField
    //             variant="standard"
    //             className="w-100 h-100 full-height"
    //             placeholder="Enter section title.."
    //             value={sectionTitle}
    //             onChange={(e) => {
    //               setSectionTitle(e.target.value);
    //               setTitleError(false);
    //             }}
    //             required
    //             error={titleError}
    //             helperText={titleError ? "Title is required" : ""}
    //           />
    //         </div>
    //       </div>

    //       {section && sectionTitle && (
    //         <div className="fileupload-view mb-4">
    //           <div className="kb-data-box">
    //             <div className="kb-file-upload">
    //               <div className="file-upload-box">
    //                 <input
    //                   type="file"
    //                   accept="video/*"
    //                   id="fileupload"
    //                   className="file-upload-input"
    //                   onChange={handleVideoInput}
    //                   multiple
    //                 />
    //                 <span>
    //                   Drag and drop or{" "}
    //                   <span className="file-link">Choose your files</span>
    //                 </span>
    //               </div>
    //               {videoSection.videoFiles.length > 0 && (
    //                 <p className="mt-2">
    //                   {videoSection.videoFiles.length} video(s) selected
    //                 </p>
    //               )}
    //             </div>

    //             <div className="kb-attach-box mb-3">
    //               {videoSection.videoFiles.map((vid) => (
    //                 <div className="file-atc-box" key={vid.id}>
    //                   <div className="file-image">
    //                     <video
    //                       width="100"
    //                       height="60"
    //                       controls
    //                       src={vid.fileurl}
    //                     ></video>
    //                   </div>
    //                   <div className="file-detail">
    //                     <h6>{vid.filename}</h6>
    //                     <p>
    //                       <span>Size : {vid.filesize}</span>
    //                       <span className="ml-2">
    //                         Modified Time : {vid.datetime}
    //                       </span>
    //                     </p>
    //                     <div className="file-actions">
    //                       <button
    //                         type="button"
    //                         className="file-action-btn"
    //                         onClick={() => deleteUploadedVideo(vid.id)}
    //                       >
    //                         Delete
    //                       </button>
    //                     </div>
    //                   </div>
    //                 </div>
    //               ))}
    //             </div>

    //             <div className="row gy-4 mb-4">
    //               <div className="col-lg-12">
    //                 <TextField
    //                   variant="outlined"
    //                   size="small"
    //                   className="w-100"
    //                   placeholder="Enter video title.."
    //                   value={videoSection.title}
    //                   onChange={(e) =>
    //                     updateSectionField("title", e.target.value)
    //                   }
    //                   required
    //                 />
    //               </div>

    //               <div className="col-lg-12">
    //                 <TextField
    //                   variant="outlined"
    //                   size="small"
    //                   placeholder="Enter video description.."
    //                   className="w-100"
    //                   value={videoSection.description}
    //                   onChange={(e) =>
    //                     updateSectionField("description", e.target.value)
    //                   }
    //                   required
    //                   multiline
    //                   rows={4}
    //                 />
    //               </div>
    //             </div>
    //           </div>
    //         </div>
    //       )}

    //       <div className="d-flex gap-2 justify-content-end">
    //         <Button
    //           onClick={resetForm}
    //           color="error"
    //           variant="contained"
    //           className="rounded-4"
    //           disabled={isSubmitting}
    //         >
    //           Reset Form
    //         </Button>
    //         <Button
    //           type="submit"
    //           color="success"
    //           variant="contained"
    //           className="rounded-4"
    //           disabled={
    //             isSubmitting ||
    //             videoSection.videoFiles.length === 0 ||
    //             titleError
    //           }
    //         >
    //           {isSubmitting ? "Uploading..." : `Save`}
    //         </Button>
    //       </div>
    //     </form>
    //   </Offcanvas.Body>
    // </Offcanvas>
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

export default AddCertificateOffCanvas