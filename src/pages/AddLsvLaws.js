import React, { useState } from "react";
import {
  Button,
  Modal,
  Table,
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
} from "react-icons/fa";
import axios from "axios";

const AddLsvLaws = () => {
  const [showModal, setShowModal] = useState(false);
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

  const sectionTypes = [
    { value: "driver", label: "Driver & Passenger Laws", color: "primary" },
    { value: "roadway", label: "Roadway Laws", color: "success" },
    { value: "vehicle", label: "Vehicle Requirements", color: "warning" },
  ];

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

  const handleRemoveGuideline = (id) => {
    if (guidelines.length > 1) {
      setGuidelines(guidelines.filter((guideline) => guideline.id !== id));
    }
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);

      const formData = new FormData();

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

        setTableData([...tableData, newSection]);
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

  const getBadgeColor = (type) => {
    return sectionTypes.find((t) => t.value === type)?.color || "secondary";
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
    <Container className="py-4">
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
            {role === "Admin" && (
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
            <Row className="mb-4">
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="fw-bold">Section Type</Form.Label>
                  <Form.Select
                    value={sectionType}
                    onChange={(e) => setSectionType(e.target.value)}
                    className="form-select-lg"
                  >
                    {sectionTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

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

      {tableData.length > 0 ? (
        <Card className="shadow-sm">
          <Card.Header className="bg-light">
            <h5 className="mb-0">Saved Law Sections</h5>
          </Card.Header>
          <Card.Body className="p-0">
            <div className="table-responsive">
              <Table hover className="mb-0">
                <thead className="table-light">
                  <tr>
                    <th>#</th>
                    <th>Type</th>
                    <th>Title</th>
                    <th>Description</th>
                    <th>Laws Count</th>
                    <th>Guidelines</th>
                    <th>Static Content</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {tableData.map((section, index) => (
                    <tr key={section.id}>
                      <td className="fw-bold">{index + 1}</td>
                      <td>
                        <Badge bg={getBadgeColor(section.type)}>
                          {
                            sectionTypes.find((t) => t.value === section.type)
                              ?.label
                          }
                        </Badge>
                      </td>
                      <td className="fw-semibold">{section.title}</td>
                      <td>
                        <div
                          dangerouslySetInnerHTML={{
                            __html:
                              section.description.substring(0, 60) +
                              (section.description.length > 60 ? "..." : ""),
                          }}
                          className="text-muted"
                        />
                      </td>
                      <td>
                        <Badge bg="info" pill>
                          {section.laws ? section.laws.length : 0}
                        </Badge>
                      </td>
                      <td style={{ maxWidth: "200px" }}>
                        {section.guidelines.map((g, i) => (
                          <div key={i} className="mb-2">
                            <small className="fw-bold d-block">{g.title}</small>
                            <small className="text-muted d-block text-truncate">
                              {g.description
                                .replace(/<[^>]+>/g, "")
                                .substring(0, 30)}
                              ...
                            </small>
                            {g.imagePreviews?.length > 0 && (
                              <small className="d-flex align-items-center mt-1">
                                <FaImage className="me-1 text-primary" />
                                {g.imagePreviews.length} image(s)
                              </small>
                            )}
                          </div>
                        ))}
                      </td>
                      <td style={{ maxWidth: "300px" }}>
                        <div className="static-content-cell">
                          <div className="mb-1">
                            <small className="fw-bold d-block">Caring:</small>
                            <small className="text-muted">
                              {section.headings?.caring}
                            </small>
                          </div>
                          <div className="mb-1">
                            <small className="fw-bold d-block">Tips:</small>
                            <small className="text-muted">
                              {section.headings?.tips}
                            </small>
                          </div>
                          <div>
                            <small className="fw-bold d-block">Safety:</small>
                            <small className="text-muted">
                              {section.headings?.safety}
                            </small>
                          </div>
                        </div>
                      </td>
                      <td>
                        <Button
                          variant="outline-primary"
                          size="sm"
                          className="me-2"
                        >
                          <FaEdit />
                        </Button>
                        <Button variant="outline-danger" size="sm">
                          <FaTrash />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </Card.Body>
        </Card>
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
            <Button
              variant="primary"
              onClick={() => setShowModal(true)}
              className="d-flex align-items-center mx-auto"
            >
              <FaPlus className="me-2" /> Add New Section
            </Button>
          </Card.Body>
        </Card>
      )}
    </Container>
  );
};

export default AddLsvLaws;
