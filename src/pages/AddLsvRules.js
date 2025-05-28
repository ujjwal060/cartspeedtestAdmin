
import React, { useState, useEffect } from "react";
import {
  Button,
  Modal,
  Table,
  Container,
  Form,
  Accordion,
  Card,
  Badge,
  Row,
  Col,
  Image,
 Image as BootstrapImage,

} from "react-bootstrap";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { ToastContainer, toast } from "react-toastify";
import { FaEye, FaPlus, FaTrash, FaTimes ,FaUpload  } from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";
import axios from "../api/axios";

const AddLsvRules = () => {
  const [showModal, setShowModal] = useState(false);
  const [viewModal, setViewModal] = useState(false);
  const [selectedSection, setSelectedSection] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);
    const [imageInputKey, setImageInputKey] = useState(Date.now()); // To reset file input

  const [content, setContent] = useState({
    whatIsLSV: "",
    importance: "",
    safety: "",
  });
  const [sectionData, setSectionData] = useState([
    { title: "", description: "", isActive: true },
  ]);
  const [guidelines, setGuidelines] = useState([
    { title: "", description: "" },
  ]);
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get("/admin/lsv/getGLSV", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (response.status === 200) {
        setData(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to fetch LSV rules");
    }
  };

  // const handleImageChange = (e) => {
  //   const files = Array.from(e.target.files);
  //   const newImages = [...images, ...files];
  //   setImages(newImages);
    
  //   // Create previews
  //   const previews = files.map(file => URL.createObjectURL(file));
  //   setImagePreviews([...imagePreviews, ...previews]);
  // };


    const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const newImages = [...images, ...files];
    setImages(newImages);

    // Create previews for new images
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setImagePreviews([...imagePreviews, ...newPreviews]);

    // Reset file input to allow selecting same file again
    setImageInputKey(Date.now());
  };

  const handleRemoveImage = (index) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
    
    const newPreviews = [...imagePreviews];
    URL.revokeObjectURL(newPreviews[index]);
    newPreviews.splice(index, 1);
    setImagePreviews(newPreviews);
  };

  const handleAddGuideline = () => {
    setGuidelines([...guidelines, { title: "", description: "" }]);
  };

  const handleRemoveGuideline = (index) => {
    if (guidelines.length > 1) {
      setGuidelines(guidelines.filter((_, i) => i !== index));
    }
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);

      const formData = new FormData();
      
      formData.append("questions", JSON.stringify({
        whatIsLSV: content.whatIsLSV,
        importance: content.importance,
        safety: content.safety,
      }));
      
      formData.append("sections", JSON.stringify(
        sectionData.map(section => ({
          title: section.title,
          description: section.description,
          isActive: true
        }))
      ));
      
      formData.append("guidelines", JSON.stringify(
        guidelines.map(guideline => ({
          title: guideline.title,
          description: guideline.description
        }))
      ));
      
      images.forEach((image) => {
        formData.append("image", image);
      });

      const token = localStorage.getItem("token");
      const response = await axios.post("/admin/lsv/addGLSVR", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 201) {
        toast.success("LSV rules added successfully!");
        resetForm();
        setShowModal(false);
        fetchData();
      }
    } catch (error) {
      console.error("Error saving sections:", error);
      toast.error(error.response?.data?.message || "Failed to add sections.");
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setContent({
      whatIsLSV: "",
      importance: "",
      safety: "",
    });
    setSectionData([{ title: "", description: "", isActive: true }]);
    setGuidelines([{ title: "", description: "" }]);
    setImages([]);
    setImagePreviews([]);
  };

  return (
    <Container className="py-4">
      <ToastContainer position="top-right" autoClose={5000} />
      
      {/* Add Section Button */}
      <Button
        variant="primary"
        onClick={() => setShowModal(true)}
        className="mb-4"
      >
        <FaPlus className="me-2" /> Add LSV Rules
      </Button>

      {/* Add Section Modal */}
      <Modal
        show={showModal}
        onHide={() => {
          setShowModal(false);
          resetForm();
        }}
        size="xl"
        centered
        backdrop="static"
      >
        <Modal.Header closeButton>
          <Modal.Title>Add New LSV Rules</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col md={6}>
              {/* Basic Information */}
              <Card className="mb-4">
                <Card.Header>Basic Information</Card.Header>
                <Card.Body>
                  <Form.Group className="mb-3">
                    <Form.Label>What is LSV?</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={2}
                      value={content.whatIsLSV}
                      onChange={(e) =>
                        setContent({ ...content, whatIsLSV: e.target.value })
                      }
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Importance</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={2}
                      value={content.importance}
                      onChange={(e) =>
                        setContent({ ...content, importance: e.target.value })
                      }
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Safety</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={2}
                      value={content.safety}
                      onChange={(e) =>
                        setContent({ ...content, safety: e.target.value })
                      }
                    />
                  </Form.Group>
                </Card.Body>
              </Card>

              {/* Guidelines */}
              <Card className="mb-4">
                <Card.Header>
                  <div className="d-flex justify-content-between align-items-center">
                    <span>Guidelines</span>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={handleAddGuideline}
                    >
                      <FaPlus /> Add Guideline
                    </Button>
                  </div>
                </Card.Header>
                <Card.Body>
                  {guidelines.map((guideline, index) => (
                    <div key={index} className="mb-3 border-bottom pb-3">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <h6>Guideline {index + 1}</h6>
                        {guidelines.length > 1 && (
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => handleRemoveGuideline(index)}
                          >
                            <FaTrash />
                          </Button>
                        )}
                      </div>
                      <Form.Group className="mb-2">
                        <Form.Label>Title</Form.Label>
                        <Form.Control
                          type="text"
                          value={guideline.title}
                          onChange={(e) => {
                            const updated = [...guidelines];
                            updated[index].title = e.target.value;
                            setGuidelines(updated);
                          }}
                        />
                      </Form.Group>
                      <Form.Group>
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={2}
                          value={guideline.description}
                          onChange={(e) => {
                            const updated = [...guidelines];
                            updated[index].description = e.target.value;
                            setGuidelines(updated);
                          }}
                        />
                      </Form.Group>
                    </div>
                  ))}
                </Card.Body>
              </Card>
            </Col>

            <Col md={6}>
              {/* Sections */}
              <Card className="mb-4">
                <Card.Header>
                  <div className="d-flex justify-content-between align-items-center">
                    <span>Sections</span>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() => {
                        setSectionData([
                          ...sectionData,
                          { title: "", description: "", isActive: true },
                        ]);
                      }}
                    >
                      <FaPlus /> Add Section
                    </Button>
                  </div>
                </Card.Header>
                <Card.Body>
                  {sectionData.map((section, index) => (
                    <div key={index} className="mb-3 border-bottom pb-3">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <h6>Section {index + 1}</h6>
                        {sectionData.length > 1 && (
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => {
                              setSectionData(sectionData.filter((_, i) => i !== index));
                            }}
                          >
                            <FaTrash />
                          </Button>
                        )}
                      </div>
                      <Form.Group className="mb-2">
                        <Form.Label>Title</Form.Label>
                        <Form.Control
                          type="text"
                          value={section.title}
                          onChange={(e) => {
                            const updated = [...sectionData];
                            updated[index].title = e.target.value;
                            setSectionData(updated);
                          }}
                        />
                      </Form.Group>
                      <Form.Group>
                        <Form.Label>Content</Form.Label>
                        <CKEditor
                          editor={ClassicEditor}
                          data={section.description}
                          onChange={(event, editor) => {
                            const data = editor.getData();
                            const updated = [...sectionData];
                            updated[index].description = data;
                            setSectionData(updated);
                          }}
                        />
                      </Form.Group>
                    </div>
                  ))}
                </Card.Body>
              </Card>

              {/* Images */}
              {/* <Card>
                <Card.Header>Images</Card.Header>
                <Card.Body>
                  <Form.Group>
                    <Form.Label>Upload Images</Form.Label>
                    <Form.Control
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageChange}
                      className="mb-3"
                    />
                  </Form.Group>

                  {imagePreviews.length > 0 && (
                    <div className="image-previews">
                      <h6>Selected Images:</h6>
                      <Row>
                        {imagePreviews.map((preview, index) => (
                          <Col xs={4} key={index} className="mb-3 position-relative">
                            <Image
                              src={preview}
                              thumbnail
                              className="w-100"
                              style={{ height: "100px", objectFit: "cover" }}
                            />
                            <Button
                              variant="danger"
                              size="sm"
                              className="position-absolute top-0 end-0 m-1"
                              onClick={() => handleRemoveImage(index)}
                              style={{ borderRadius: "50%" }}
                            >
                              <FaTimes />
                            </Button>
                          </Col>
                        ))}
                      </Row>
                    </div>
                  )}
                </Card.Body>
              </Card> */}


                  <Card>
        <Card.Header>
          <div className="d-flex justify-content-between align-items-center">
            <span>Images</span>
            <div>
              <Button
                variant="outline-primary"
                size="sm"
                onClick={() => document.getElementById('image-upload').click()}
                className="me-2"
              >
                <FaUpload /> Add Image
              </Button>
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                key={imageInputKey}
                style={{ display: 'none' }}
              />
            </div>
          </div>
        </Card.Header>
        <Card.Body>
          {imagePreviews.length > 0 ? (
            <Row className="g-2">
              {imagePreviews.map((preview, index) => (
                <Col xs={4} key={index} className="position-relative">
                  <div className="image-preview-container">
                    <BootstrapImage
                      src={preview}
                      thumbnail
                      className="w-100"
                      style={{ height: "120px", objectFit: "cover" }}
                    />
                    <Button
                      variant="danger"
                      size="sm"
                      className="position-absolute top-0 end-0 m-1 rounded-circle"
                      style={{ width: "25px", height: "25px", padding: "0" }}
                      onClick={() => handleRemoveImage(index)}
                    >
                      <FaTimes size={10} />
                    </Button>
                  </div>
                </Col>
              ))}
            </Row>
          ) : (
            <div className="text-center py-4 text-muted">
              <FaUpload size={24} className="mb-2" />
              <p>No images selected</p>
              <Button
                variant="outline-primary"
                onClick={() => document.getElementById('image-upload').click()}
              >
                Select Images
              </Button>
            </div>
          )}
        </Card.Body>
      </Card>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => {
              setShowModal(false);
              resetForm();
            }}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSave}
            disabled={isLoading}
          >
            {isLoading ? "Saving..." : "Save"}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Data Table */}
      <Card>
        <Card.Body>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>#</th>
                <th>What Is LSV?</th>
                <th>Importance</th>
                <th>Safety</th>
                <th>Guidelines</th>
                <th>Sections</th>
                <th>Images</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr key={item._id}>
                  <td>{index + 1}</td>
                  <td>{item.questions.whatIsLSV}</td>
                  <td>{item.questions.importance}</td>
                  <td>{item.questions.safety}</td>
                  <td>
                    <Badge bg="info">{item.guidelines?.length || 0}</Badge>
                  </td>
                  <td>
                    <Badge bg="primary">{item.sections?.length || 0}</Badge>
                  </td>
                  <td>
                    <Badge bg="secondary">{item.images?.length || 0}</Badge>
                  </td>
                  <td>
                    <Button
                      variant="info"
                      size="sm"
                      onClick={() => {
                        setSelectedSection(item);
                        setViewModal(true);
                      }}
                    >
                      <FaEye />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {/* View Modal */}
      <Modal show={viewModal} onHide={() => setViewModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>LSV Rules Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedSection && (
            <>
              <h5>What is LSV?</h5>
              <p>{selectedSection.questions.whatIsLSV}</p>

              <h5 className="mt-4">Importance</h5>
              <p>{selectedSection.questions.importance}</p>

              <h5 className="mt-4">Safety</h5>
              <p>{selectedSection.questions.safety}</p>

              <h5 className="mt-4">Guidelines</h5>
              <ul>
                {selectedSection.guidelines?.map((g, i) => (
                  <li key={i}>
                    <strong>{g.title}:</strong> {g.description}
                  </li>
                ))}
              </ul>

              <h5 className="mt-4">Imaghhhhhhes</h5>
              <Row>
                {selectedSection.image?.map((img, i) => (
                  <Col xs={4} key={i} className="mb-3">
                    <Image
                      src={`${process.env.REACT_APP_API_URL}/${img}`}
                      thumbnail
                      className="w-100"
                    />
                  </Col>
                ))}
              </Row>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setViewModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default AddLsvRules;