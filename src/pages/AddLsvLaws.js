import React, { useEffect, useState } from "react";
import {
  Button,
  Modal,
  Container,
  Form,
  Row,
  Col,
  Card,
  Badge,
} from "react-bootstrap";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  FaPlus,
  FaTrash,
  FaEdit,
  FaInfoCircle,
  FaBook,
  FaImage,
  FaEye,
} from "react-icons/fa";
import axios from "axios";
import {
  Box,
  CardContent,
  Grid,
  InputAdornment,
  MenuItem,
  Paper,
  Stack,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  CircularProgress,
  TablePagination,
  Chip,
  LinearProgress,
  IconButton,
} from "@mui/material";

const AddLsvLaws = () => {
  const [showModal, setShowModal] = useState(false);
  const [editModal, setEditModal] = useState(false);

  const [sectionType, setSectionType] = useState("driver");
  const [laws, setLaws] = useState([{ id: 1, content: "" }]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [guidelines, setGuidelines] = useState([
    {
      id: 1,
      title: "Guideline 1",
      description: "",
      images: [],
      imagePreviews: [],
    },
  ]);
  const [viewModal, setViewModal] = useState(false);
  const [selectedSection, setSelectedSection] = useState(null);
  const [editingSection, setEditingSection] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const role = localStorage.getItem("role");
  const navigate = useNavigate();

  const staticHeadings = {
    caring:
      "Basic caring rules for LSV users ensuring safety and responsibility.",
    tips: "Helpful tips to enhance your experience and compliance with LSV laws.",
    safety:
      "Important safety guidelines to prevent accidents and maintain safe driving.",
  };

  const handleAddLaw = () => {
    setLaws([...laws, { id: Date.now(), content: "" }]);
  };

  const handleLawChange = (id, content) => {
    setLaws(laws.map((law) => (law.id === id ? { ...law, content } : law)));
  };

  const handleRemoveLaw = (id) => {
    if (laws.length > 1) {
      setLaws(laws.filter((law) => law.id !== id));
    }
  };

  const handleAddGuideline = () => {
    setGuidelines([
      ...guidelines,
      {
        id: Date.now(),
        title: `Guideline ${guidelines.length + 1}`,
        description: "",
        images: [],
        imagePreviews: [],
      },
    ]);
  };

  const handleGuidelineImageChange = (guidelineId, e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setGuidelines(
        guidelines.map((guideline) => {
          if (guideline.id === guidelineId) {
            const newImages = [...guideline.images];
            const newPreviews = [...guideline.imagePreviews];

            files.forEach((file) => {
              newImages.push(file);
              const reader = new FileReader();
              reader.onloadend = () => {
                newPreviews.push(reader.result);
              };
              reader.readAsDataURL(file);
            });

            return {
              ...guideline,
              images: newImages,
              imagePreviews: newPreviews,
            };
          }
          return guideline;
        })
      );
    }
  };

  const removeGuidelineImage = (guidelineId, index) => {
    setGuidelines(
      guidelines.map((guideline) => {
        if (guideline.id === guidelineId) {
          const newImages = [...guideline.images];
          const newPreviews = [...guideline.imagePreviews];

          newImages.splice(index, 1);
          newPreviews.splice(index, 1);

          return {
            ...guideline,
            images: newImages,
            imagePreviews: newPreviews,
          };
        }
        return guideline;
      })
    );
  };

  const handleGuidelineChange = (id, field, value) => {
    setGuidelines(
      guidelines.map((guideline) =>
        guideline.id === id ? { ...guideline, [field]: value } : guideline
      )
    );
  };

  const handleViewSection = (section) => {
    setSelectedSection(section);
    setViewModal(true);
  };

  const handleEditSection = (section) => {
    setEditingSection(section);
    setTitle(section.sections[0].title);
    setDescription(section.sections[0].description);
    setSectionType(section.type);

    // Set guidelines with existing data
    const formattedGuidelines = section.guidelines.map((g, index) => ({
      id: index + 1,
      title: g.title || `Guideline ${index + 1}`,
      description: g.description,
      images: [], // We'll handle existing images separately
      imagePreviews: g.imagePreviews || [],
    }));

    setGuidelines(formattedGuidelines);
    setEditModal(true);
  };

  const handleUpdate = async () => {
    try {
      setIsLoading(true);

      const formData = new FormData();
      formData.append("sectionId", editingSection._id);
      formData.append("sectionType", sectionType);

      // Append static questions
      formData.append(
        "questions",
        JSON.stringify({
          cartingRule: staticHeadings.caring,
          tips: staticHeadings.tips,
          safety: staticHeadings.safety,
        })
      );

      // Append sections
      formData.append(
        "sections",
        JSON.stringify([
          {
            title,
            description,
            isActive: true,
            type: sectionType,
          },
        ])
      );

      // Prepare guidelines without images
      const guidelinesData = guidelines.map((guideline) => ({
        title: guideline.title,
        description: guideline.description,
      }));
      formData.append("guidelines", JSON.stringify(guidelinesData));

      // Append all new images from all guidelines
      guidelines.forEach((guideline) => {
        guideline.images.forEach((image) => {
          formData.append("image", image);
        });
      });

      const token = localStorage.getItem("token");

      const response = await axios.put(
        "http://localhost:9090/api/admin/lsv/editGLSVRules",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        toast.success("Law section updated successfully!");
        handleGetData(); // Refresh the data
        setEditModal(false);
        resetForm();
      }
    } catch (error) {
      console.error("Update failed:", error);
      toast.error(error.response?.data?.message || "Failed to update section.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveGuideline = (id) => {
    if (guidelines.length > 1) {
      setGuidelines(guidelines.filter((guideline) => guideline.id !== id));
    }
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);

      const formData = new FormData();

      formData.append("sectionType", sectionType);
      // Append static questions
      formData.append(
        "questions",
        JSON.stringify({
          cartingRule: staticHeadings.caring,
          tips: staticHeadings.tips,
          safety: staticHeadings.safety,
        })
      );

      // Append sections
      formData.append(
        "sections",
        JSON.stringify([
          {
            title,
            description,
            isActive: true,
            type: sectionType,
          },
        ])
      );

      // Prepare guidelines without images (we'll append images separately)
      const guidelinesData = guidelines.map((guideline) => ({
        title: guideline.title,
        description: guideline.description,
      }));
      formData.append("guidelines", JSON.stringify(guidelinesData));

      // Append all images from all guidelines
      guidelines.forEach((guideline, index) => {
        guideline.images.forEach((image) => {
          formData.append("image", image);
        });
      });

      const token = localStorage.getItem("token");

      const response = await axios.post(
        "http://18.209.91.97:9090/api/admin/lsv/addRRLSVR",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 201 || response.status === 200) {
        toast.success("Law section added successfully!");

        const newSection = {
          id: Date.now(),
          type: sectionType,
          title,
          description,
          laws,
          guidelines: guidelines.map((g) => ({
            ...g,
            imagePreviews: g.imagePreviews, // Include previews for display
          })),
          headings: staticHeadings,
          createdAt: new Date().toISOString(),
        };

        // setTableData([...tableData, newSection]);
        resetForm();
        setShowModal(false);
      }
    } catch (error) {
      console.error("Upload failed:", error);
      toast.error(error.response?.data?.message || "Failed to save section.");
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setSectionType("driver");
    setTitle("");
    setDescription("");
    setGuidelines([
      {
        id: Date.now(),
        title: "Guideline 1",
        description: "",
        images: [],
        imagePreviews: [],
      },
    ]);
  };

  useEffect(() => {
    handleGetData();
  }, []);

  const handleGetData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://18.209.91.97:9090/api/admin/lsv/getGLSV",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setTableData(response?.data?.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const getBadgeColor = (type) => {
    return "secondary";
  };

  if (isLoading) {
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
    <>
      <ToastContainer position="top-right" newestOnTop />

      <Card className="shadow-sm mb-4">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div>
              <h2 className="mb-0">
                <FaBook className="me-2 text-primary" />
                LSV Laws Management
              </h2>
              <p className="text-muted mb-0">
                Add and manage Low-Speed Vehicle regulations
              </p>
            </div>
            {role === "admin" && (
              <Button
                variant="primary"
                onClick={() => setShowModal(true)}
                className="d-flex align-items-center"
              >
                <FaPlus className="me-2" /> Add New Section
              </Button>
            )}
          </div>
        </Card.Body>
      </Card>

      <Modal
        show={showModal}
        onHide={() => {
          setShowModal(false);
          resetForm();
        }}
        size="xl"
        centered
      >
        <Modal.Header closeButton className="bg-light">
          <Modal.Title className="fw-bold">
            <FaPlus className="me-2" /> Create New Law Section
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          <Card className="mb-4 border-0 shadow-sm">
            <Card.Header className="bg-primary text-white">
              <h5 className="mb-0">Standard Content Guidelines</h5>
            </Card.Header>
            <Card.Body>
              <div className="mb-3">
                <h6 className="d-flex align-items-center">
                  <FaInfoCircle className="me-2 text-info" /> Caring Rules
                </h6>
                <p className="text-muted ps-4">{staticHeadings.caring}</p>
              </div>
              <div className="mb-3">
                <h6 className="d-flex align-items-center">
                  <FaInfoCircle className="me-2 text-info" /> Tips
                </h6>
                <p className="text-muted ps-4">{staticHeadings.tips}</p>
              </div>
              <div>
                <h6 className="d-flex align-items-center">
                  <FaInfoCircle className="me-2 text-info" /> Safety
                </h6>
                <p className="text-muted ps-4">{staticHeadings.safety}</p>
              </div>
            </Card.Body>
          </Card>

          <Form>
            <Form.Group className="mb-4">
              <Form.Label className="fw-bold">
                Title <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Laws for All Drivers & Passengers of LSVs"
                required
                size="lg"
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label className="fw-bold">
                Description (Optional)
              </Form.Label>
              <div className="border rounded overflow-hidden">
                <CKEditor
                  editor={ClassicEditor}
                  data={description}
                  onChange={(event, editor) => {
                    const data = editor.getData();
                    setDescription(data);
                  }}
                  config={{
                    toolbar: [
                      "heading",
                      "|",
                      "bold",
                      "italic",
                      "link",
                      "bulletedList",
                      "numberedList",
                      "blockQuote",
                    ],
                  }}
                />
              </div>
            </Form.Group>

            <Card className="mb-4 border-0 shadow-sm">
              <Card.Header className="bg-info text-white d-flex align-items-center">
                <FaInfoCircle className="me-2" />
                <h5 className="mb-0">Guidelines Section</h5>
                <Button
                  variant="outline-light"
                  size="sm"
                  className="ms-auto"
                  onClick={handleAddGuideline}
                >
                  <FaPlus className="me-1" /> Add Guideline
                </Button>
              </Card.Header>
              <Card.Body>
                {guidelines.map((guideline, index) => (
                  <Card key={guideline.id} className="mb-3 border-0 shadow-sm">
                    <Card.Header className="bg-light d-flex justify-content-between align-items-center">
                      <h6 className="mb-0">Guideline {index + 1}</h6>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleRemoveGuideline(guideline.id)}
                        disabled={guidelines.length <= 1}
                      >
                        <FaTrash className="me-1" /> Remove
                      </Button>
                    </Card.Header>
                    <Card.Body>
                      <Form.Group className="mb-3">
                        <Form.Label>Title</Form.Label>
                        <Form.Control
                          type="text"
                          value={guideline.title}
                          onChange={(e) =>
                            handleGuidelineChange(
                              guideline.id,
                              "title",
                              e.target.value
                            )
                          }
                          placeholder="Enter guideline title"
                        />
                      </Form.Group>
                      <Form.Group>
                        <Form.Label>Description</Form.Label>
                        <div className="border rounded overflow-hidden">
                          <CKEditor
                            editor={ClassicEditor}
                            data={guideline.description}
                            onChange={(event, editor) => {
                              const data = editor.getData();
                              handleGuidelineChange(
                                guideline.id,
                                "description",
                                data
                              );
                            }}
                            config={{
                              toolbar: [
                                "bold",
                                "italic",
                                "link",
                                "bulletedList",
                                "numberedList",
                                "blockQuote",
                              ],
                            }}
                          />
                        </div>
                      </Form.Group>

                      {/* Image Upload Section inside each Guideline */}
                      <Form.Group className="mt-3">
                        <Form.Label>Images</Form.Label>
                        <div className="d-flex flex-wrap gap-2 mb-3">
                          {guideline.imagePreviews.length > 0 ? (
                            guideline.imagePreviews.map((preview, imgIndex) => (
                              <div key={imgIndex} className="position-relative">
                                <img
                                  src={preview}
                                  alt={`Preview ${imgIndex + 1}`}
                                  style={{
                                    width: "100px",
                                    height: "100px",
                                    objectFit: "cover",
                                    borderRadius: "4px",
                                  }}
                                />
                                <Badge
                                  bg="danger"
                                  pill
                                  className="position-absolute top-0 start-100 translate-middle"
                                  onClick={() =>
                                    removeGuidelineImage(guideline.id, imgIndex)
                                  }
                                  style={{ cursor: "pointer" }}
                                >
                                  ×
                                </Badge>
                              </div>
                            ))
                          ) : (
                            <div className="text-muted">No images selected</div>
                          )}
                        </div>
                        <Button
                          variant="outline-primary"
                          onClick={() =>
                            document
                              .getElementById(`image-upload-${guideline.id}`)
                              .click()
                          }
                          className="d-flex align-items-center"
                        >
                          <FaPlus className="me-1" /> Add Images
                        </Button>
                        <input
                          type="file"
                          id={`image-upload-${guideline.id}`}
                          accept="image/*"
                          onChange={(e) =>
                            handleGuidelineImageChange(guideline.id, e)
                          }
                          multiple
                          style={{ display: "none" }}
                        />
                      </Form.Group>
                    </Card.Body>
                  </Card>
                ))}
              </Card.Body>
            </Card>

            <Form.Group>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <Form.Label className="fw-bold mb-0">
                  Laws <span className="text-danger">*</span>
                </Form.Label>
                <Button
                  variant="outline-primary"
                  onClick={handleAddLaw}
                  className="d-flex align-items-center"
                >
                  <FaPlus className="me-1" /> Add Law
                </Button>
              </div>

              {laws.map((law, index) => (
                <Card key={law.id} className="mb-3 border-0 shadow-sm">
                  <Card.Header className="bg-light d-flex justify-content-between align-items-center">
                    <h6 className="mb-0">Law {index + 1}</h6>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleRemoveLaw(law.id)}
                      disabled={laws.length <= 1}
                      className="d-flex align-items-center"
                    >
                      <FaTrash className="me-1" /> Remove
                    </Button>
                  </Card.Header>
                  <Card.Body>
                    <div className="border rounded overflow-hidden">
                      <CKEditor
                        editor={ClassicEditor}
                        data={law.content}
                        onChange={(event, editor) => {
                          const data = editor.getData();
                          handleLawChange(law.id, data);
                        }}
                        config={{
                          toolbar: [
                            "bold",
                            "italic",
                            "link",
                            "bulletedList",
                            "numberedList",
                            "blockQuote",
                          ],
                        }}
                      />
                    </div>
                  </Card.Body>
                </Card>
              ))}
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer className="bg-light">
          <Button
            variant="outline-secondary"
            onClick={() => {
              setShowModal(false);
              resetForm();
            }}
          >
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave} className="px-4">
            Save Section
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={viewModal}
        onHide={() => setViewModal(false)}
        size="xl"
        centered
        scrollable
      >
        <Modal.Header closeButton className="bg-light">
          <Modal.Title className="fw-bold">
            <FaEye className="me-2" /> View Law Section Details
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedSection && (
            <div className="p-3">
              <Card className="mb-4 border-0 shadow-sm">
                <Card.Header className="bg-primary text-white">
                  <h4 className="mb-0">{selectedSection.sections[0].title}</h4>
                </Card.Header>
                <Card.Body>
                  <div className="mb-4">
                    <h5 className="d-flex align-items-center mb-3">
                      <FaInfoCircle className="me-2 text-info" /> Description
                    </h5>
                    <div
                      className="p-3 bg-light rounded"
                      dangerouslySetInnerHTML={{
                        __html: selectedSection.sections[0].description,
                      }}
                    />
                  </div>

                  <div className="mb-4">
                    <h5 className="d-flex align-items-center mb-3">
                      <FaBook className="me-2 text-info" /> Guidelines
                    </h5>
                    {selectedSection.guidelines.map((guideline, index) => (
                      <Card key={index} className="mb-3 border-0 shadow-sm">
                        <Card.Header className="bg-light">
                          <h6 className="mb-0">
                            {guideline.title || `Guideline ${index + 1}`}
                          </h6>
                        </Card.Header>
                        <Card.Body>
                          <div
                            className="mb-3"
                            dangerouslySetInnerHTML={{
                              __html: guideline.description,
                            }}
                          />
                          {guideline.imagePreviews?.length > 0 && (
                            <div>
                              <h6 className="d-flex align-items-center mb-2">
                                <FaImage className="me-2 text-primary" /> Images
                              </h6>
                              <div className="d-flex flex-wrap gap-3">
                                {guideline.imagePreviews.map(
                                  (preview, imgIndex) => (
                                    <img
                                      key={imgIndex}
                                      src={preview}
                                      alt={`Guideline ${index + 1} - Image ${
                                        imgIndex + 1
                                      }`}
                                      className="img-thumbnail"
                                      style={{
                                        maxWidth: "200px",
                                        maxHeight: "200px",
                                      }}
                                    />
                                  )
                                )}
                              </div>
                            </div>
                          )}
                        </Card.Body>
                      </Card>
                    ))}
                  </div>

                  <div className="mb-4">
                    <h5 className="d-flex align-items-center mb-3">
                      <FaInfoCircle className="me-2 text-info" /> What is LSV
                    </h5>
                    <div className="p-3 bg-light rounded">
                      {selectedSection.questions?.whatIsLSV}
                    </div>
                  </div>

                  <div className="mb-4">
                    <h5 className="d-flex align-items-center mb-3">
                      <FaInfoCircle className="me-2 text-info" /> Importance
                    </h5>
                    <div className="p-3 bg-light rounded">
                      {selectedSection.questions?.importance}
                    </div>
                  </div>

                  <div>
                    <h5 className="d-flex align-items-center mb-3">
                      <FaInfoCircle className="me-2 text-info" /> Safety
                    </h5>
                    <div className="p-3 bg-light rounded">
                      {selectedSection.questions?.safety}
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer className="bg-light">
          <Button variant="secondary" onClick={() => setViewModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={editModal}
        onHide={() => {
          setEditModal(false);
          resetForm();
        }}
        size="xl"
        centered
      >
        <Modal.Header closeButton className="bg-light">
          <Modal.Title className="fw-bold">
            <FaEdit className="me-2" /> Edit Law Section
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          <Card className="mb-4 border-0 shadow-sm">
            <Card.Header className="bg-primary text-white">
              <h5 className="mb-0">Standard Content Guidelines</h5>
            </Card.Header>
            <Card.Body>
              <div className="mb-3">
                <h6 className="d-flex align-items-center">
                  <FaInfoCircle className="me-2 text-info" /> Caring Rules
                </h6>
                <p className="text-muted ps-4">{staticHeadings.caring}</p>
              </div>
              <div className="mb-3">
                <h6 className="d-flex align-items-center">
                  <FaInfoCircle className="me-2 text-info" /> Tips
                </h6>
                <p className="text-muted ps-4">{staticHeadings.tips}</p>
              </div>
              <div>
                <h6 className="d-flex align-items-center">
                  <FaInfoCircle className="me-2 text-info" /> Safety
                </h6>
                <p className="text-muted ps-4">{staticHeadings.safety}</p>
              </div>
            </Card.Body>
          </Card>

          <Form>
            <Form.Group className="mb-4">
              <Form.Label className="fw-bold">
                Title <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Laws for All Drivers & Passengers of LSVs"
                required
                size="lg"
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label className="fw-bold">
                Description (Optional)
              </Form.Label>
              <div className="border rounded overflow-hidden">
                <CKEditor
                  editor={ClassicEditor}
                  data={description}
                  onChange={(event, editor) => {
                    const data = editor.getData();
                    setDescription(data);
                  }}
                  config={{
                    toolbar: [
                      "heading",
                      "|",
                      "bold",
                      "italic",
                      "link",
                      "bulletedList",
                      "numberedList",
                      "blockQuote",
                    ],
                  }}
                />
              </div>
            </Form.Group>

            <Card className="mb-4 border-0 shadow-sm">
              <Card.Header className="bg-info text-white d-flex align-items-center">
                <FaInfoCircle className="me-2" />
                <h5 className="mb-0">Guidelines Section</h5>
                <Button
                  variant="outline-light"
                  size="sm"
                  className="ms-auto"
                  onClick={handleAddGuideline}
                >
                  <FaPlus className="me-1" /> Add Guideline
                </Button>
              </Card.Header>
              <Card.Body>
                {guidelines.map((guideline, index) => (
                  <Card key={guideline.id} className="mb-3 border-0 shadow-sm">
                    <Card.Header className="bg-light d-flex justify-content-between align-items-center">
                      <h6 className="mb-0">Guideline {index + 1}</h6>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleRemoveGuideline(guideline.id)}
                        disabled={guidelines.length <= 1}
                      >
                        <FaTrash className="me-1" /> Remove
                      </Button>
                    </Card.Header>
                    <Card.Body>
                      <Form.Group className="mb-3">
                        <Form.Label>Title</Form.Label>
                        <Form.Control
                          type="text"
                          value={guideline.title}
                          onChange={(e) =>
                            handleGuidelineChange(
                              guideline.id,
                              "title",
                              e.target.value
                            )
                          }
                          placeholder="Enter guideline title"
                        />
                      </Form.Group>
                      <Form.Group>
                        <Form.Label>Description</Form.Label>
                        <div className="border rounded overflow-hidden">
                          <CKEditor
                            editor={ClassicEditor}
                            data={guideline.description}
                            onChange={(event, editor) => {
                              const data = editor.getData();
                              handleGuidelineChange(
                                guideline.id,
                                "description",
                                data
                              );
                            }}
                            config={{
                              toolbar: [
                                "bold",
                                "italic",
                                "link",
                                "bulletedList",
                                "numberedList",
                                "blockQuote",
                              ],
                            }}
                          />
                        </div>
                      </Form.Group>

                      {/* Image Upload Section */}
                      <Form.Group className="mt-3">
                        <Form.Label>Images</Form.Label>
                        <div className="d-flex flex-wrap gap-2 mb-3">
                          {guideline.imagePreviews.length > 0 ? (
                            guideline.imagePreviews.map((preview, imgIndex) => (
                              <div key={imgIndex} className="position-relative">
                                <img
                                  src={preview}
                                  alt={`Preview ${imgIndex + 1}`}
                                  style={{
                                    width: "100px",
                                    height: "100px",
                                    objectFit: "cover",
                                    borderRadius: "4px",
                                  }}
                                />
                                <Badge
                                  bg="danger"
                                  pill
                                  className="position-absolute top-0 start-100 translate-middle"
                                  onClick={() =>
                                    removeGuidelineImage(guideline.id, imgIndex)
                                  }
                                  style={{ cursor: "pointer" }}
                                >
                                  ×
                                </Badge>
                              </div>
                            ))
                          ) : (
                            <div className="text-muted">No images selected</div>
                          )}
                        </div>
                        <Button
                          variant="outline-primary"
                          onClick={() =>
                            document
                              .getElementById(`image-upload-${guideline.id}`)
                              .click()
                          }
                          className="d-flex align-items-center"
                        >
                          <FaPlus className="me-1" /> Add Images
                        </Button>
                        <input
                          type="file"
                          id={`image-upload-${guideline.id}`}
                          accept="image/*"
                          onChange={(e) =>
                            handleGuidelineImageChange(guideline.id, e)
                          }
                          multiple
                          style={{ display: "none" }}
                        />
                      </Form.Group>
                    </Card.Body>
                  </Card>
                ))}
              </Card.Body>
            </Card>

            <Form.Group>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <Form.Label className="fw-bold mb-0">
                  Laws <span className="text-danger">*</span>
                </Form.Label>
                <Button
                  variant="outline-primary"
                  onClick={handleAddLaw}
                  className="d-flex align-items-center"
                >
                  <FaPlus className="me-1" /> Add Law
                </Button>
              </div>

              {laws.map((law, index) => (
                <Card key={law.id} className="mb-3 border-0 shadow-sm">
                  <Card.Header className="bg-light d-flex justify-content-between align-items-center">
                    <h6 className="mb-0">Law {index + 1}</h6>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleRemoveLaw(law.id)}
                      disabled={laws.length <= 1}
                      className="d-flex align-items-center"
                    >
                      <FaTrash className="me-1" /> Remove
                    </Button>
                  </Card.Header>
                  <Card.Body>
                    <div className="border rounded overflow-hidden">
                      <CKEditor
                        editor={ClassicEditor}
                        data={law.content}
                        onChange={(event, editor) => {
                          const data = editor.getData();
                          handleLawChange(law.id, data);
                        }}
                        config={{
                          toolbar: [
                            "bold",
                            "italic",
                            "link",
                            "bulletedList",
                            "numberedList",
                            "blockQuote",
                          ],
                        }}
                      />
                    </div>
                  </Card.Body>
                </Card>
              ))}
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer className="bg-light">
          <Button
            variant="outline-secondary"
            onClick={() => {
              setEditModal(false);
              resetForm();
            }}
          >
            Cancel
          </Button>
          <Button variant="primary" onClick={handleUpdate} className="px-4">
            Update Section
          </Button>
        </Modal.Footer>
      </Modal>

      {tableData.length > 0 ? (
        <TableContainer component={Paper}>
          <Table
            stickyHeader
            aria-label="sticky table"
            sx={{ "& .MuiTableCell-root": { padding: "12px 16px" } }}
          >
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f8f9fa" }}>
                <TableCell>#</TableCell>
                <TableCell>Title</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Guidelines</TableCell>
                <TableCell>What is LSV</TableCell>
                <TableCell>Importance</TableCell>
                <TableCell>Safety</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tableData.map((section, index) => (
                <TableRow key={section.id} hover>
                  <TableCell sx={{ fontWeight: "bold" }}>{index + 1}</TableCell>
                  <TableCell>
                    <Chip
                      label={section?.sections[0].title}
                      color={getBadgeColor(section.type)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {section.sections.map((data) => (
                      <Box key={data.id} sx={{ mb: 1 }}>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          component="div"
                        >
                          <div
                            dangerouslySetInnerHTML={{
                              __html: data.description,
                            }}
                          />
                        </Typography>
                      </Box>
                    ))}
                  </TableCell>
                  <TableCell sx={{ maxWidth: 150 }}>
                    {section.guidelines.map((g, i) => (
                      <Box key={i} sx={{ mb: 1 }}>
                        <Typography
                          variant="caption"
                          fontWeight="bold"
                          component="div"
                        >
                          {g.title}
                        </Typography>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          noWrap
                          component="div"
                        >
                          {g.description
                            .replace(/<[^>]+>/g, "")
                            .substring(0, 30)}
                          ...
                        </Typography>
                        {g.imagePreviews?.length > 0 && (
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              mt: 0.5,
                            }}
                          >
                            <FaImage
                              style={{ color: "#1976d2", marginRight: 4 }}
                              size={12}
                            />
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {g.imagePreviews.length} image(s)
                            </Typography>
                          </Box>
                        )}
                      </Box>
                    ))}
                  </TableCell>
                  <TableCell sx={{ maxWidth: 150 }}>
                    <Typography
                      component="p"
                      variant="body1"
                      color="text.secondary"
                      sx={{
                        maxWidth: 150,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {section?.questions?.whatIsLSV}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ maxWidth: 150 }}>
                    <Typography
                      component="p"
                      variant="body1"
                      color="text.secondary"
                      sx={{
                        maxWidth: 150,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {section.questions?.importance}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ maxWidth: 150 }}>
                    <Typography
                      component="p"
                      variant="body1"
                      color="text.secondary"
                      sx={{
                        maxWidth: 150,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {section?.questions?.safety}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ maxWidth: 150 }}>
                    <Button
                      className="btn btn-success mb-3"
                      size="small"
                      onClick={() => handleViewSection(section)}
                     
                    >
                      <FaEye />
                    </Button>
                    <Button
                      className="btn btn-info text-light mb-3"
                      size="small"
                      onClick={() => handleEditSection(section)}
                      
                    >
                      <FaEdit />
                    </Button>
                    <Button className="btn btn-danger" size="small">
                      <FaTrash />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Card className="shadow-sm text-center py-5">
          <Card.Body>
            <div className="text-muted mb-3" style={{ fontSize: "3rem" }}>
              <FaBook />
            </div>
            <h4 className="mb-3">No Law Sections Added Yet</h4>
            <p className="text-muted mb-4">
              Start by adding your first LSV law section to manage regulations
              and guidelines.
            </p>
            {role === "admin" && (
              <Button
                variant="primary"
                onClick={() => setShowModal(true)}
                className="d-flex align-items-center mx-auto"
              >
                <FaPlus className="me-2" /> Add New Section
              </Button>
            )}
          </Card.Body>
        </Card>
      )}
    </>
  );
};

export default AddLsvLaws;
