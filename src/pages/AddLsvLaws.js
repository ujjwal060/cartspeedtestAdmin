

import React, { useState } from 'react';
import { Button, Modal, Table, Container, Form, Row, Col, Card, Badge } from 'react-bootstrap';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaPlus, FaTrash, FaEdit, FaInfoCircle, FaBook } from 'react-icons/fa';

const AddLsvLaws = () => {
  const [showModal, setShowModal] = useState(false);
  const [sectionType, setSectionType] = useState('driver');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [laws, setLaws] = useState([{ id: 1, content: '' }]);
  const [tableData, setTableData] = useState([]);
  const navigate = useNavigate();

  const staticHeadings = {
    caring: 'Basic caring rules for LSV users ensuring safety and responsibility.',
    tips: 'Helpful tips to enhance your experience and compliance with LSV laws.',
    safety: 'Important safety guidelines to prevent accidents and maintain safe driving.'
  };

  const sectionTypes = [
    { value: 'driver', label: 'Driver & Passenger Laws', color: 'primary' },
    { value: 'roadway', label: 'Roadway Laws', color: 'success' },
    { value: 'vehicle', label: 'Vehicle Requirements', color: 'warning' }
  ];

  const handleAddLaw = () => {
    setLaws([...laws, { id: Date.now(), content: '' }]);
  };

  const handleLawChange = (id, content) => {
    setLaws(laws.map(law => law.id === id ? { ...law, content } : law));
  };

  const handleRemoveLaw = (id) => {
    if (laws.length > 1) {
      setLaws(laws.filter(law => law.id !== id));
    }
  };

  const handleSave = () => {
    const validLaws = laws.filter(law => law.content.trim() !== '');

    if (title.trim() !== '' && validLaws.length > 0) {
      const newSection = {
        id: Date.now(),
        type: sectionType,
        title,
        description,
        laws: validLaws.map(law => law.content),
        headings: staticHeadings,
        createdAt: new Date().toISOString()
      };

      setTableData([...tableData, newSection]);
      resetForm();
      setShowModal(false);

      toast.success('Law section added successfully!', {
        position: 'top-right',
        autoClose: 2000,
      });
    } else {
      toast.error('Please fill all required fields', {
        position: 'top-right',
        autoClose: 2000,
      });
    }
  };

  const resetForm = () => {
    setSectionType('driver');
    setTitle('');
    setDescription('');
    setLaws([{ id: Date.now(), content: '' }]);
  };

  const getBadgeColor = (type) => {
    return sectionTypes.find(t => t.value === type)?.color || 'secondary';
  };

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
              <p className="text-muted mb-0">Add and manage Low-Speed Vehicle regulations</p>
            </div>
            <Button 
              variant="primary" 
              onClick={() => setShowModal(true)}
              className="d-flex align-items-center"
            >
              <FaPlus className="me-2" /> Add New Section
            </Button>
          </div>
        </Card.Body>
      </Card>

    
      <Modal show={showModal} onHide={() => { setShowModal(false); resetForm(); }} size="xl" centered>
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
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-4">
              <Form.Label className="fw-bold">Title <span className="text-danger">*</span></Form.Label>
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
              <Form.Label className="fw-bold">Description (Optional)</Form.Label>
              <div className="border rounded overflow-hidden">
                <CKEditor
                  editor={ClassicEditor}
                  data={description}
                  onChange={(event, editor) => {
                    const data = editor.getData();
                    setDescription(data);
                  }}
                  config={{
                    toolbar: ['heading', '|', 'bold', 'italic', 'link', 'bulletedList', 'numberedList', 'blockQuote']
                  }}
                />
              </div>
            </Form.Group>

            <Form.Group>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <Form.Label className="fw-bold mb-0">Laws <span className="text-danger">*</span></Form.Label>
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
                          toolbar: ['bold', 'italic', 'link', 'bulletedList', 'numberedList', 'blockQuote']
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
          <Button variant="outline-secondary" onClick={() => { setShowModal(false); resetForm(); }}>Cancel</Button>
          <Button variant="primary" onClick={handleSave} className="px-4">Save Section</Button>
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
                          {sectionTypes.find(t => t.value === section.type)?.label}
                        </Badge>
                      </td>
                      <td className="fw-semibold">{section.title}</td>
                      <td>
                        <div 
                          dangerouslySetInnerHTML={{ 
                            __html: section.description.substring(0, 60) + 
                            (section.description.length > 60 ? '...' : '') 
                          }} 
                          className="text-muted"
                        />
                      </td>
                      <td>
                        <Badge bg="info" pill>
                          {section.laws.length}
                        </Badge>
                      </td>
                      <td style={{ maxWidth: '300px' }}>
                        <div className="static-content-cell">
                          <div className="mb-1">
                            <small className="fw-bold d-block">Caring:</small>
                            <small className="text-muted">{section.headings?.caring}</small>
                          </div>
                          <div className="mb-1">
                            <small className="fw-bold d-block">Tips:</small>
                            <small className="text-muted">{section.headings?.tips}</small>
                          </div>
                          <div>
                            <small className="fw-bold d-block">Safety:</small>
                            <small className="text-muted">{section.headings?.safety}</small>
                          </div>
                        </div>
                      </td>
                      <td>
                        <Button variant="outline-primary" size="sm" className="me-2">
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
            <div className="text-muted mb-3" style={{ fontSize: '3rem' }}>
              <FaBook />
            </div>
            <h4 className="mb-3">No Law Sections Added Yet</h4>
            <p className="text-muted mb-4">
              Start by adding your first LSV law section to manage regulations and guidelines.
            </p>
    
          </Card.Body>
        </Card>
      )}
    </Container>
  );
};

export default AddLsvLaws;