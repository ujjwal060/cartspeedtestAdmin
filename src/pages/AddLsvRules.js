import React, { useState, useEffect } from "react";
import {
  Button,
  Modal,
  Table,
  Container,
  Form,
  Card,
  Badge,
  Row,
  Col,
  Image as BootstrapImage,
  Accordion,
  ListGroup
} from "react-bootstrap";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { ToastContainer, toast } from "react-toastify";
import { FaEye, FaPlus, FaTrash, FaTimes, FaUpload, FaInfoCircle, FaBook } from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";
import axios from "../api/axios";

const AddLsvRules = () => {
  const [showModal, setShowModal] = useState(false);
  const [viewModal, setViewModal] = useState(false);
  const [selectedSection, setSelectedSection] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);
  const [imageInputKey, setImageInputKey] = useState(Date.now());

  const [content, setContent] = useState({
    whatIsLSV: "",
    importance: "",
    safety: "",
  });

  const [sectionData, setSectionData] = useState([
    { title: "", description: "", isActive: true },
  ]);

  const [guidelines, setGuidelines] = useState([
    { 
      title: "", 
      description: "",
      images: [],
      imagePreviews: []
    },
  ]);

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

  const handleGuidelineImageChange = (guidelineIndex, e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const updatedGuidelines = [...guidelines];
    const currentGuideline = updatedGuidelines[guidelineIndex];
    
    
    const newImages = [...currentGuideline.images, ...files];
    currentGuideline.images = newImages;
    
    
    const newPreviews = files.map(file => URL.createObjectURL(file));
    currentGuideline.imagePreviews = [...currentGuideline.imagePreviews, ...newPreviews];
    
    setGuidelines(updatedGuidelines);
    setImageInputKey(Date.now());
  };

  const handleRemoveGuidelineImage = (guidelineIndex, imageIndex) => {
    const updatedGuidelines = [...guidelines];
    const currentGuideline = updatedGuidelines[guidelineIndex];
    
   
    currentGuideline.images.splice(imageIndex, 1);
    URL.revokeObjectURL(currentGuideline.imagePreviews[imageIndex]);
    currentGuideline.imagePreviews.splice(imageIndex, 1);
    
    setGuidelines(updatedGuidelines);
  };

  const handleAddGuideline = () => {
    setGuidelines([...guidelines, { 
      title: "", 
      description: "",
      images: [],
      imagePreviews: []
    }]);
  };

  const handleRemoveGuideline = (index) => {
    if (guidelines.length > 1) {
    
      guidelines[index].imagePreviews.forEach(url => URL.revokeObjectURL(url));
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
      
      
      const guidelinesWithImages = guidelines.map(guideline => ({
        title: guideline.title,
        description: guideline.description,
      }));
      
      formData.append("guidelines", JSON.stringify(guidelinesWithImages));
      
     
      guidelines.forEach(guideline => {
        guideline.images.forEach(image => {
          formData.append("image", image);
        });
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
    setGuidelines([{ 
      title: "", 
      description: "",
      images: [],
      imagePreviews: []
    }]);
  };

  return (
    <Container className="py-4">
      <ToastContainer position="top-right" autoClose={5000} />
      
      {/* Header Card */}
      <Card className="shadow-sm mb-4">
        <Card.Body className="py-4">
          <div className="d-flex align-items-center">
            <FaBook className="text-primary me-3" size={32} />
            <div>
              <h2 className="mb-1">LSV Rules Management</h2>
              <p className="text-muted mb-0">Manage Low-Speed Vehicle regulations and guidelines</p>
            </div>
            <Button
              variant="primary"
              onClick={() => setShowModal(true)}
              className="ms-auto d-flex align-items-center"
            >
              <FaPlus className="me-2" /> Add New Rules
            </Button>
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
        backdrop="static"
      >
        <Modal.Header closeButton className="bg-light">
          <Modal.Title className="d-flex align-items-center">
            <FaBook className="text-primary me-2" />
            Add New LSV Rules
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          <Row>
            <Col md={6}>
             
              <Card className="mb-4 shadow-sm">
                <Card.Header className="bg-light d-flex align-items-center">
                  <FaInfoCircle className="text-primary me-2" />
                  <span>Basic Information</span>
                </Card.Header>
                <Card.Body>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">What is LSV?</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      value={content.whatIsLSV}
                      onChange={(e) =>
                        setContent({ ...content, whatIsLSV: e.target.value })
                      }
                      placeholder="Explain what Low-Speed Vehicles are"
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">Importance</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      value={content.importance}
                      onChange={(e) =>
                        setContent({ ...content, importance: e.target.value })
                      }
                      placeholder="Explain the importance of these rules"
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">Safety</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      value={content.safety}
                      onChange={(e) =>
                        setContent({ ...content, safety: e.target.value })
                      }
                      placeholder="Describe safety considerations"
                    />
                  </Form.Group>
                </Card.Body>
              </Card>
            </Col>

            <Col md={6}>
             
              <Card className="mb-4 shadow-sm">
                <Card.Header className="bg-light d-flex align-items-center">
                  <FaInfoCircle className="text-primary me-2" />
                  <span>Sections</span>
                  <Button
                    variant="outline-primary"
                    size="sm"
                    className="ms-auto d-flex align-items-center"
                    onClick={() => {
                      setSectionData([
                        ...sectionData,
                        { title: "", description: "", isActive: true },
                      ]);
                    }}
                  >
                    <FaPlus size={12} className="me-1" /> Add Section
                  </Button>
                </Card.Header>
                <Card.Body>
                  <Accordion defaultActiveKey="0">
                    {sectionData.map((section, index) => (
                      <Accordion.Item eventKey={index.toString()} key={index} className="mb-3">
                        <Accordion.Header>
                          <div className="d-flex align-items-center w-100">
                            <span className="fw-bold me-2">Section {index + 1}</span>
                            {!section.title && (
                              <span className="text-muted">(Untitled)</span>
                            )}
                            {section.title && (
                              <span className="text-truncate">{section.title}</span>
                            )}
                            {sectionData.length > 1 && (
                              <Button
                                variant="outline-danger"
                                size="sm"
                                className="ms-auto me-2"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSectionData(sectionData.filter((_, i) => i !== index));
                                }}
                              >
                                <FaTrash size={12} />
                              </Button>
                            )}
                          </div>
                        </Accordion.Header>
                        <Accordion.Body>
                          <Form.Group className="mb-3">
                            <Form.Label>Title</Form.Label>
                            <Form.Control
                              type="text"
                              value={section.title}
                              onChange={(e) => {
                                const updated = [...sectionData];
                                updated[index].title = e.target.value;
                                setSectionData(updated);
                              }}
                              placeholder="Enter section title"
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
                              config={{
                                toolbar: ['heading', '|', 'bold', 'italic', 'link', 'bulletedList', 'numberedList', 'blockQuote']
                              }}
                            />
                          </Form.Group>
                        </Accordion.Body>
                      </Accordion.Item>
                    ))}
                  </Accordion>
                </Card.Body>
              </Card>
            </Col>
          </Row>

         
          <Card className="mb-4 shadow-sm">
            <Card.Header className="bg-light d-flex align-items-center">
              <FaInfoCircle className="text-primary me-2" />
              <span>Guidelines</span>
              <Button
                variant="outline-primary"
                size="sm"
                className="ms-auto d-flex align-items-center"
                onClick={handleAddGuideline}
              >
                <FaPlus size={12} className="me-1" /> Add Guideline
              </Button>
            </Card.Header>
            <Card.Body>
              <Accordion>
                {guidelines.map((guideline, index) => (
                  <Accordion.Item eventKey={index.toString()} key={index} className="mb-3">
                    <Accordion.Header>
                      <div className="d-flex align-items-center w-100">
                        <span className="fw-bold me-2">Guideline {index + 1}</span>
                        {!guideline.title && (
                          <span className="text-muted">(Untitled)</span>
                        )}
                        {guideline.title && (
                          <span className="text-truncate">{guideline.title}</span>
                        )}
                        {guidelines.length > 1 && (
                          <Button
                            variant="outline-danger"
                            size="sm"
                            className="ms-auto me-2"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveGuideline(index);
                            }}
                          >
                            <FaTrash size={12} />
                          </Button>
                        )}
                      </div>
                    </Accordion.Header>
                    <Accordion.Body>
                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Title</Form.Label>
                            <Form.Control
                              type="text"
                              value={guideline.title}
                              onChange={(e) => {
                                const updated = [...guidelines];
                                updated[index].title = e.target.value;
                                setGuidelines(updated);
                              }}
                              placeholder="Enter guideline title"
                            />
                          </Form.Group>
                          <Form.Group>
                            <Form.Label>Description</Form.Label>
                            <CKEditor
                              editor={ClassicEditor}
                              data={guideline.description}
                              onChange={(event, editor) => {
                                const data = editor.getData();
                                const updated = [...guidelines];
                                updated[index].description = data;
                                setGuidelines(updated);
                              }}
                              config={{
                                toolbar: ['bold', 'italic', 'link', 'bulletedList', 'numberedList', 'blockQuote']
                              }}
                            />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group>
                            <Form.Label>Images</Form.Label>
                            <div className="d-flex mb-3">
                              <Button
                                variant="outline-secondary"
                                onClick={() => document.getElementById(`guideline-image-${index}`).click()}
                                className="d-flex align-items-center"
                              >
                                <FaUpload className="me-2" /> Upload Images
                              </Button>
                              <input
                                id={`guideline-image-${index}`}
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleGuidelineImageChange(index, e)}
                                key={`${imageInputKey}-${index}`}
                                style={{ display: 'none' }}
                                multiple
                              />
                            </div>
                            
                            {guideline.imagePreviews.length > 0 ? (
                              <Row className="g-2">
                                {guideline.imagePreviews.map((preview, imgIndex) => (
                                  <Col xs={6} md={4} key={imgIndex} className="position-relative">
                                    <div className="image-preview-container border rounded p-1">
                                      <BootstrapImage
                                        src={preview}
                                        thumbnail
                                        className="w-100"
                                        style={{ height: "100px", objectFit: "cover" }}
                                      />
                                      <Button
                                        variant="danger"
                                        size="sm"
                                        className="position-absolute top-0 end-0 m-1 rounded-circle"
                                        style={{ width: "25px", height: "25px", padding: "0" }}
                                        onClick={() => handleRemoveGuidelineImage(index, imgIndex)}
                                      >
                                        <FaTimes size={10} />
                                      </Button>
                                    </div>
                                  </Col>
                                ))}
                              </Row>
                            ) : (
                              <div className="text-center py-4 text-muted border rounded">
                                <FaUpload size={24} className="mb-2" />
                                <p>No images selected for this guideline</p>
                              </div>
                            )}
                          </Form.Group>
                        </Col>
                      </Row>
                    </Accordion.Body>
                  </Accordion.Item>
                ))}
              </Accordion>
            </Card.Body>
          </Card>
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
          <Button
            variant="primary"
            onClick={handleSave}
            disabled={isLoading}
          >
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Data Table */}
      <Card className="shadow-sm">
        <Card.Header className="bg-light d-flex align-items-center">
          <FaBook className="text-primary me-2" />
          <h5 className="mb-0">Current LSV Rules</h5>
        </Card.Header>
        <Card.Body>
          <div className="table-responsive">
            <Table striped bordered hover className="mb-0">
              <thead className="table-light">
                <tr>
                  <th>#</th>
                  <th>What Is LSV?</th>
                  <th>Importance</th>
                  <th>Safety</th>
                  <th>Guidelines</th>
                  <th>Sections</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item, index) => (
                  <tr key={item._id}>
                    <td>{index + 1}</td>
                    <td>
                      <div className="text-truncate" style={{ maxWidth: "200px" }}>
                        {item.questions.whatIsLSV}
                      </div>
                    </td>
                    <td>
                      <div className="text-truncate" style={{ maxWidth: "200px" }}>
                        {item.questions.importance}
                      </div>
                    </td>
                    <td>
                      <div className="text-truncate" style={{ maxWidth: "200px" }}>
                        {item.questions.safety}
                      </div>
                    </td>
                    <td className="text-center">
                      <Badge bg="info" pill>
                        {item.guidelines?.length || 0}
                      </Badge>
                    </td>
                    <td className="text-center">
                      <Badge bg="primary" pill>
                        {item.sections?.length || 0}
                      </Badge>
                    </td>
                    <td className="text-center">
                      <Button
                        variant="outline-info"
                        size="sm"
                        className="me-2"
                        onClick={() => {
                          setSelectedSection(item);
                          setViewModal(true);
                        }}
                        title="View Details"
                      >
                        <FaEye />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Card.Body>
      </Card>

    
      <Modal show={viewModal} onHide={() => setViewModal(false)} size="lg" centered>
        <Modal.Header closeButton className="bg-light">
          <Modal.Title className="d-flex align-items-center">
            <FaBook className="text-primary me-2" />
            LSV Rules Details
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedSection && (
            <>
              <Card className="mb-3 shadow-sm">
                <Card.Header className="bg-light">Basic Information</Card.Header>
                <Card.Body>
                  <h5>What is LSV?</h5>
                  <p className="text-muted">{selectedSection.questions.whatIsLSV}</p>

                  <h5 className="mt-3">Importance</h5>
                  <p className="text-muted">{selectedSection.questions.importance}</p>

                  <h5 className="mt-3">Safety</h5>
                  <p className="text-muted">{selectedSection.questions.safety}</p>
                </Card.Body>
              </Card>

              <Card className="mb-3 shadow-sm">
                <Card.Header className="bg-light">Sections</Card.Header>
                <Card.Body>
                  <ListGroup variant="flush">
                    {selectedSection.sections?.map((section, i) => (
                      <ListGroup.Item key={i}>
                        <h6>{section.title}</h6>
                        <div dangerouslySetInnerHTML={{ __html: section.description }} />
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                </Card.Body>
              </Card>

              <Card className="shadow-sm">
                <Card.Header className="bg-light">Guidelines</Card.Header>
                <Card.Body>
                  <Accordion>
                    {selectedSection.guidelines?.map((guideline, i) => (
                      <Accordion.Item eventKey={i.toString()} key={i} className="mb-2">
                        <Accordion.Header>
                          <strong>{guideline.title}</strong>
                        </Accordion.Header>
                        <Accordion.Body>
                          <div dangerouslySetInnerHTML={{ __html: guideline.description }} />
                          
                          {guideline.imageUrl && (
                            <>
                              <h6 className="mt-3">Image:</h6>
                              <Row className="g-2 mt-2">
                                <Col xs={12} md={6}>
                                  <BootstrapImage
                                    src={guideline.imageUrl}
                                    thumbnail
                                    className="w-100"
                                    style={{ height: "200px", objectFit: "contain" }}
                                  />
                                </Col>
                              </Row>
                            </>
                          )}
                        </Accordion.Body>
                      </Accordion.Item>
                    ))}
                  </Accordion>
                </Card.Body>
              </Card>
            </>
          )}
        </Modal.Body>
        <Modal.Footer className="bg-light">
          <Button variant="outline-secondary" onClick={() => setViewModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default AddLsvRules;








