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
import { FaEye, FaPlus, FaInfoCircle, FaTrash, FaEdit } from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";
import axios from "../api/axios";
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
  const [tableData, setTableData] = useState([]);
  const [sectionData, setSectionData] = useState({
    title: "",
    description: "",
  });
  const navigate = useNavigate();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/admin/lsv/getGLSV", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        if (response.status === 200) {
          console.log(response.data);
          setData(response.data);
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

      // 2. Create the payload with proper structure
      const payload = {
        questions: content,
        sections: [
          {
            title: sectionData.title,
            description: sectionData.description,
            isActive: true,
          },
        ],
      };

      console.log("Final Payload:", JSON.stringify(payload, null, 2)); // Debug output

      // 3. Make the API call
      const response = await axios.post("/admin/lsv/addGLSVR", payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.status === 200) {
        toast.success("Section added successfully!");
        setSectionData({ title: "", description: "" });
        setShowModal(false);
        // Optionally refresh data
        // await fetchData();
      }
    } catch (error) {
      console.error("Error saving section:", error);
      toast.error(error.response?.data?.message || "Failed to add section.");
    } finally {
      setIsLoading(false);
    }
  };
  const resetForm = () => {
    setSectionType("traffic");
    setTitle("");
    setSubtitle("");
    setQuestion("");
    setContent("");
  };

  return (
    <Container className="py-4">
      <ToastContainer />
      <Card className="shadow-sm mb-4">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-4">
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

          <div className="alert alert-info d-flex align-items-center">
            <FaInfoCircle className="me-2" size={20} />
            <span>
              Static sections (marked with <Badge bg="info">General</Badge>)
              cannot be edited or deleted
            </span>
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
                        required
                        type="text"
                        placeholder="Enter Section Title"
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
                        type="text"
                        placeholder="Enter Section Title"
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
                        type="text"
                        placeholder="Enter Section Title"
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
                <div className="row mb-3">
                  <div className="col-md-6">
                    <Form.Group>
                      <Form.Label>
                        Section Title <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control
                        required
                        type="text"
                        placeholder="Enter Section Title"
                        value={sectionData?.title}
                        onChange={(e) =>
                          setSectionData({
                            ...sectionData,
                            title: e.target.value,
                          })
                        }
                      />
                      {/* {sectionTypes.map((type) => (
                          <option key={type.value} value={type.value}>
                            {type.label}
                          </option>
                        ))} */}
                    </Form.Group>
                  </div>
                </div>

                {/* <Form.Group className="mb-3">
                  <Form.Label>
                    Title <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter section title"
                    size="lg"
                  />
                </Form.Group>*/}

                {/* <Form.Group className="mb-3">
                  <Form.Label>Add Question</Form.Label>
                  <Form.Control
                    type="text"
                    value={subtitle}
                    onChange={(e) => setSubtitle(e.target.value)}
                    placeholder="Enter Question"
                  />
                </Form.Group> */}

                <Form.Group className="mb-3">
                  <Form.Label>
                    Content <span className="text-danger">*</span>
                  </Form.Label>
                  <div className="border rounded overflow-hidden">
                    <CKEditor
                      editor={ClassicEditor}
                      data={sectionData?.description}
                      value={sectionData?.description}
                      onChange={(event, editor) => {
                        const data = editor.getData();
                        setSectionData({
                          ...sectionData,
                          description: data,
                        });
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
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div>
                  <h4>{selectedSection.title}</h4>
                  {selectedSection.subtitle && (
                    <h6 className="text-muted">{selectedSection.subtitle}</h6>
                  )}
                </div>
                {/* <div>{getTypeBadge(selectedSection.type)}</div> */}
              </div>

              <div className="border-top pt-3">
                <div
                  dangerouslySetInnerHTML={{ __html: selectedSection.content }}
                />
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
                  <th width="150">Type</th>
                  <th>Title</th>
                  <th>Subtitle</th>
                  <th width="120">Actions</th>
                </tr>
              </thead>
              <tbody>
                {/* {[...staticSections, ...tableData].map((section, index) => (
                  <tr key={section.id || index}>
                    <td className="text-center">{index + 1}</td>
                    <td>{getTypeBadge(section.type)}</td>
                    <td>
                      <div className="fw-semibold">{section.title}</div>
                      <div
                        className="text-muted small"
                        style={{ maxHeight: "40px", overflow: "hidden" }}
                      >
                        {section.subtitle || "No subtitle"}
                      </div>
                    </td>
                    <td>
                      <div
                        className="text-muted small"
                        style={{ maxHeight: "40px", overflow: "hidden" }}
                        dangerouslySetInnerHTML={{
                          __html:
                            section.content.substring(0, 100) +
                            (section.content.length > 100 ? "..." : ""),
                        }}
                      />
                    </td>
                    <td className="text-center">
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
                      <Button
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
                      </Button>
                      {!staticSections.some((s) => s.id === section.id) && (
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleDelete(section.id)}
                          title="Delete"
                          disabled={isLoading}
                        >
                          <FaTrash />
                        </Button>
                      )}
                    </td>
                  </tr>
                ))} */}
                {tableData.length === 0 && (
                  <tr>
                    <td colSpan="5" className="text-center py-4 text-muted">
                      No custom sections added yet. Click "Add Section" to
                      create one.
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
