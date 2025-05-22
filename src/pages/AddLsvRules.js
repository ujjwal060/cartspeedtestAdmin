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
} from "react-bootstrap";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import {
  FaEye,
  FaPlus,
  FaInfoCircle,
  FaTrash,
  FaEdit,
  FaMinus,
} from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";
import axios from "../api/axios";
import { BsGeoAlt } from "react-icons/bs";
const AddLsvRules = () => {
  const [showModal, setShowModal] = useState(false);
  const [viewModal, setViewModal] = useState(false);
  const [selectedSection, setSelectedSection] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);
  const [sectionType, setSectionType] = useState("traffic");
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [question, setQuestion] = useState("");
  const [content, setContent] = useState({
    whatIsLSV: "",
    importance: "",
    safety: "",
  });
  const [sectionData, setSectionData] = useState([
    { title: "", description: "" }, // Initial section as an array with one object
  ]);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/admin/lsv/getGLSV", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        if (response.status === 200) {
          console.log(response.data);
          setData(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleSave = async () => {
    try {
      setIsLoading(true);

      const payload = {
        questions: content,
        sections: sectionData.map((section) => ({
          title: section.title,
          description: section.description,
          isActive: true,
        })),
      };

      console.log("Final Payload:", JSON.stringify(payload, null, 2));

      const response = await axios.post("/admin/lsv/addGLSVR", payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.status === 201) {
        toast.success("Sections added successfully!");
        setSectionData([{ title: "", description: "" }]); // Reset to initial state
        setShowModal(false);
      }
    } catch (error) {
      console.error("Error saving sections:", error);
      toast.error(error.response?.data?.message || "Failed to add sections.");
    } finally {
      setIsLoading(false);
    }
  };
  const resetForm = () => {
    setSectionType("traffic");
    setTitle("");
    setSubtitle("");
    setQuestion("");
    setContent({
      whatIsLSV: "",
      importance: "",
      safety: "",
    });
    setSectionData([{ title: "", description: "" }]); // Reset to initial single section
  };

  return (
    <Container className="py-4">
      <ToastContainer />
      <Card className="shadow-sm mb-4">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2 className="fw-bold mb-1">LSV Rules Management</h2>
              <p className="text-muted">
                Add and manage Low-Speed Vehicle rules and regulations
              </p>
            </div>
            <Button
              variant="primary"
              onClick={() => setShowModal(true)}
              className="d-flex align-items-center"
              disabled={isLoading}
            >
              <FaPlus className="me-2" /> Add Section
            </Button>
          </div>

          {/* <div className="alert alert-info d-flex align-items-center">
            <FaInfoCircle className="me-2" size={20} />
            <span>
              Static sections (marked with <Badge bg="info">General</Badge>)
              cannot be edited or deleted
            </span>
          </div> */}
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
          <Modal.Title>Add New Section</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ minHeight: "60vh" }}>
          <div className="row">
            <div className="col-md-6">
              <Card className="">
                <Card.Header className="bg-light">
                  <h5 className="mb-0">Available Sections</h5>
                </Card.Header>

                <Accordion defaultActiveKey="0" flush>
                  <Accordion.Item eventKey="0">
                    <Accordion.Header className="fw-semibold">
                      What is LSV?
                    </Accordion.Header>
                    <Accordion.Body className="small p-1">
                      <Form.Control
                        className="rounded-0"
                        required
                        type="text"
                        placeholder="Enter LSV"
                        value={content.whatIsLSV}
                        onChange={(e) =>
                          setContent({
                            ...content,
                            whatIsLSV: e.target.value,
                          })
                        }
                      />
                    </Accordion.Body>
                  </Accordion.Item>
                  <Accordion.Item eventKey="1">
                    <Accordion.Header className="fw-semibold">
                      Importance
                    </Accordion.Header>
                    <Accordion.Body className="small p-1">
                      <Form.Control
                        required
                        className="rounded-0"
                        type="text"
                        placeholder="Enter  Importance"
                        value={content.importance}
                        onChange={(e) =>
                          setContent({
                            ...content,
                            importance: e.target.value,
                          })
                        }
                      />
                    </Accordion.Body>
                  </Accordion.Item>
                  <Accordion.Item eventKey="2">
                    <Accordion.Header className="fw-semibold">
                      Safety
                    </Accordion.Header>
                    <Accordion.Body className="small p-1">
                      <Form.Control
                        required
                        className="rounded-0"
                        type="text"
                        placeholder="Enter Safety"
                        value={content.safety}
                        onChange={(e) =>
                          setContent({
                            ...content,
                            safety: e.target.value,
                          })
                        }
                      />
                    </Accordion.Body>
                  </Accordion.Item>
                </Accordion>
              </Card>
            </div>
            <div className="col-md-6">
              <Form>
                {sectionData.map((section, index) => (
                  <div key={index} className="mb-4 border-bottom pb-3">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h5>Section {index + 1}</h5>
                      {sectionData.length > 1 && (
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={(e) => {
                            e.preventDefault();
                            setSectionData((prevSections) =>
                              prevSections.filter((_, i) => i !== index)
                            );
                          }}
                        >
                          <FaMinus /> Remove
                        </Button>
                      )}
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-8">
                        <Form.Group>
                          <Form.Label>
                            Section Title <span className="text-danger">*</span>
                          </Form.Label>
                          <Form.Control
                            required
                            type="text"
                            placeholder="Enter Section Title"
                            value={section.title}
                            onChange={(e) => {
                              const updatedSections = [...sectionData];
                              updatedSections[index].title = e.target.value;
                              setSectionData(updatedSections);
                            }}
                          />
                        </Form.Group>
                      </div>
                    </div>

                    <Form.Group className="mb-3">
                      <Form.Label>
                        Content <span className="text-danger">*</span>
                      </Form.Label>
                      <div className="border rounded overflow-hidden">
                        <CKEditor
                          editor={ClassicEditor}
                          data={section.description}
                          onChange={(event, editor) => {
                            const data = editor.getData();
                            const updatedSections = [...sectionData];
                            updatedSections[index].description = data;
                            setSectionData(updatedSections);
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
                              "undo",
                              "redo",
                            ],
                          }}
                        />
                      </div>
                    </Form.Group>
                  </div>
                ))}

                <Button
                  variant="outline-primary"
                  onClick={() => {
                    setSectionData([
                      ...sectionData,
                      { title: "", description: "" },
                    ]);
                  }}
                  className="mb-3"
                >
                  <FaPlus /> Add Section
                </Button>
              </Form>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer className="bg-light">
          <Button
            variant="outline-secondary"
            onClick={() => {
              setShowModal(false);
              resetForm();
            }}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={() => handleSave()}
            disabled={isLoading}
          >
            {isLoading ? "Saving..." : "Save Section"}
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={viewModal}
        onHide={() => setViewModal(false)}
        size="lg"
        centered
      >
        <Modal.Header closeButton className="bg-light">
          <Modal.Title>Section Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedSection && (
            <div>
              <b className="">
                <BsGeoAlt className="me-1" />
                {selectedSection?.locationId?.name}
              </b>
              <div className="row gy-3 pt-3">
                <div className="col-lg-12">
                  <div className="d-flex flex-column gap-2 align-items-start mb-3">
                    <div>
                      <h5>What is LSV?</h5>
                      <h6>{selectedSection?.questions?.whatIsLSV}</h6>
                    </div>
                    <div>
                      <h5>Importance?</h5>
                      <h6>{selectedSection?.questions?.importance}</h6>
                    </div>
                    <div>
                      <h5>Safety?</h5>
                      <h6>{selectedSection?.questions?.safety}</h6>
                    </div>
                    {/* <div>{getTypeBadge(selectedSection.type)}</div> */}
                  </div>
                </div>
                <div className="col-lg-12">
                  <div className="d-flex flex-column gap-2 align-items-start mb-3">
                    <h4>Section</h4>
                    {selectedSection.sections && (
                      <Accordion defaultActiveKey="0" className="w-100">
                        {selectedSection.sections.map((section, index) => (
                          <Accordion.Item
                            eventKey={index.toString()}
                            key={section?._id}
                          >
                            <Accordion.Header>
                              <h5 className="mb-0">{section?.title}</h5>
                            </Accordion.Header>
                            <Accordion.Body>
                              <div
                                dangerouslySetInnerHTML={{
                                  __html: section?.description,
                                }}
                              />
                            </Accordion.Body>
                          </Accordion.Item>
                        ))}
                      </Accordion>
                    )}

                    {/* <div>{getTypeBadge(selectedSection.type)}</div> */}
                  </div>
                </div>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer className="bg-light">
          <Button
            variant="outline-secondary"
            onClick={() => setViewModal(false)}
            disabled={isLoading}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Sections Table */}
      <Card className="shadow-sm">
        <Card.Body className="p-0">
          <div className="table-responsive">
            <Table hover className="mb-0">
              <thead className="table-light">
                <tr>
                  <th width="50">#</th>
                  <th>What Is LSV?</th>
                  <th width="150">Importance</th>
                  <th>Safety</th>
                  <th>Location</th>
                  <th width="120">Actions</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(data) ? (
                  data.map((section, index) => (
                    <tr key={section.id || index}>
                      <td className="text-center">{index + 1}</td>
                      <td
                        className="text-truncate"
                        style={{ maxWidth: "200px" }}
                      >
                        {section.questions.whatIsLSV}
                      </td>
                      <td
                        className="text-truncate"
                        style={{ maxWidth: "200px" }}
                      >
                        {" "}
                        {section.questions.importance}
                      </td>
                      <td
                        className="text-truncate"
                        style={{ maxWidth: "200px" }}
                      >
                        {section.questions.safety}
                      </td>
                      <td>{section.locationId.name}</td>
                      <td className="text-start">
                        <Button
                          variant="outline-primary"
                          size="sm"
                          className="me-1"
                          onClick={() => {
                            setSelectedSection(section);
                            setViewModal(true);
                          }}
                          title="View"
                          disabled={isLoading}
                        >
                          <FaEye />
                        </Button>
                        {/* <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => {
                            setSelectedSection(section);
                            setViewModal(true);
                          }}
                          title="Delete"
                          disabled={isLoading}
                        >
                          <FaEdit />
                        </Button> */}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center py-4 text-muted">
                      No data available or data is not in expected format
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default AddLsvRules;
