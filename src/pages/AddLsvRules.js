

import React, { useState } from 'react';
import { Button, Modal, Table, Container, Form, Accordion, Card, Badge } from 'react-bootstrap';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { FaEye, FaPlus, FaInfoCircle, FaTrash, FaEdit } from 'react-icons/fa';
import 'react-toastify/dist/ReactToastify.css';

const AddLsvRules = () => {
  const [showModal, setShowModal] = useState(false);
  const [viewModal, setViewModal] = useState(false);
  const [selectedSection, setSelectedSection] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [sectionType, setSectionType] = useState('traffic');
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [question, setQuestion] = useState('');
  const [content, setContent] = useState('');
  const [tableData, setTableData] = useState([]);
  const navigate = useNavigate();

  const staticSections = [
    {
      id: 1,
      type: 'info',
      title: 'What is LSV?',
      content: 'A Low-Speed Vehicle (LSV) is a four-wheeled motor vehicle that has a top speed of greater than 20 mph but not greater than 25 mph.'
    },
    {
      id: 2,
      type: 'info',
      title: 'Importance',
      content: 'Proper regulation of LSVs ensures safety for both operators and pedestrians while allowing efficient campus transportation.'
    },
    {
      id: 3,
      type: 'info',
      title: 'Safety',
      content: 'LSV operators must follow all traffic laws and regulations applicable to motor vehicles, unless specifically exempted.'
    }
  ];

const handleSave = async () => {
    if (title.trim() === '' || content.trim() === '') {
      toast.error('Title and Content are required fields', {
        position: 'top-right',
        autoClose: 2000,
      });
      return;
    }

    setIsLoading(true);

    try {
    
      const token = localStorage.getItem('token'); // or from your auth context
      console.log(token,'...token')
      if (!token) {
        throw new Error('No authentication token found');
      }

    
      const requestData = {
        questions: {
          whatIsLSV: staticSections.find(s => s.title === 'What is LSV?')?.content || '',
          importance: staticSections.find(s => s.title === 'Importance')?.content || '',
          safety: staticSections.find(s => s.title === 'Safety')?.content || ''
        },
        sections: [
          ...tableData.map(section => ({
            title: section.title,
            description: section.content,
            isActive: true
          })),
          {
            title: title,
            description: content,
            isActive: true
          }
        ]
      };

    
      const response = await fetch('http://18.209.91.97:9090/api/admin/lsv/addGLSVR', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(requestData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save data');
      }

      const result = await response.json();

      
      const newSection = {
        id: Date.now(),
        type: sectionType,
        title,
        subtitle,
        question,
        content
      };

      setTableData([...tableData, newSection]);
      resetForm();
      setShowModal(false);

      toast.success('Section added successfully!', {
        position: 'top-right',
        autoClose: 2000,
      });
    } catch (error) {
      console.error('Error saving section:', error);
      toast.error(error.message || 'Failed to save section. Please try again.', {
        position: 'top-right',
        autoClose: 2000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setSectionType('traffic');
    setTitle('');
    setSubtitle('');
    setQuestion('');
    setContent('');
  };

  const sectionTypes = [
    { value: 'traffic', label: 'Traffic & Parking', color: 'primary' },
    { value: 'safety', label: 'Safety & Operation', color: 'success' },
    { value: 'damage', label: 'Damage Inspection', color: 'warning' },
    { value: 'info', label: 'General Information', color: 'info' }
  ];

  const getTypeBadge = (type) => {
    const typeInfo = sectionTypes.find(t => t.value === type) || { label: 'General', color: 'secondary' };
    return (
      <Badge bg={typeInfo.color} className="text-capitalize">
        {typeInfo.label}
      </Badge>
    );
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this section?')) {
      setTableData(tableData.filter(item => item.id !== id));
      toast.success('Section deleted successfully!', {
        position: 'top-right',
        autoClose: 2000,
      });
    }
  };

  return (
    <Container className="py-4">
      <ToastContainer />
      <Card className="shadow-sm mb-4">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h2 className="fw-bold mb-1">LSV Rules Management</h2>
              <p className="text-muted">Add and manage Low-Speed Vehicle rules and regulations</p>
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
            <span>Static sections (marked with <Badge bg="info">General</Badge>) cannot be edited or deleted</span>
          </div>
        </Card.Body>
      </Card>

      
      <Modal show={showModal} onHide={() => { setShowModal(false); resetForm(); }} size="xl" centered>
        <Modal.Header closeButton className="bg-light">
          <Modal.Title>Add New Section</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ minHeight: '60vh' }}>
          <div className="row">
            <div className="col-md-4">
              <Card className="h-100">
                <Card.Header className="bg-light">
                  <h5 className="mb-0">Available Sections</h5>
                </Card.Header>
                <Card.Body className="p-0">
                  <Accordion defaultActiveKey="0" flush>
                    {staticSections.map((section, index) => (
                      <Accordion.Item eventKey={index.toString()} key={section.id}>
                        <Accordion.Header className="fw-semibold">
                          {section.title}
                        </Accordion.Header>
                        <Accordion.Body className="small">
                          <div dangerouslySetInnerHTML={{ __html: section.content.substring(0, 150) + '...' }} />
                        </Accordion.Body>
                      </Accordion.Item>
                    ))}
                  </Accordion>
                </Card.Body>
              </Card>
            </div>
            <div className="col-md-8">
              <Form>
                <div className="row mb-3">
                  <div className="col-md-6">
                    <Form.Group>
                      <Form.Label>Section Type <span className="text-danger">*</span></Form.Label>
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
                  </div>
                </div>

                <Form.Group className="mb-3">
                  <Form.Label>Title <span className="text-danger">*</span></Form.Label>
                  <Form.Control 
                    type="text" 
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter section title"
                    size="lg"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Subtitle</Form.Label>
                  <Form.Control 
                    type="text" 
                    value={subtitle}
                    onChange={(e) => setSubtitle(e.target.value)}
                    placeholder="Enter optional subtitle"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Content <span className="text-danger">*</span></Form.Label>
                  <div className="border rounded overflow-hidden">
                    <CKEditor
                      editor={ClassicEditor}
                      data={content}
                      onChange={(event, editor) => {
                        const data = editor.getData();
                        setContent(data);
                      }}
                      config={{
                        toolbar: ['heading', '|', 'bold', 'italic', 'link', 'bulletedList', 'numberedList', 'blockQuote', 'undo', 'redo']
                      }}
                    />
                  </div>
                </Form.Group>
              </Form>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer className="bg-light">
          <Button variant="outline-secondary" onClick={() => { setShowModal(false); resetForm(); }} disabled={isLoading}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave} disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Save Section'}
          </Button>
        </Modal.Footer>
      </Modal>

     
      <Modal show={viewModal} onHide={() => setViewModal(false)} size="lg" centered>
        <Modal.Header closeButton className="bg-light">
          <Modal.Title>Section Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedSection && (
            <div>
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div>
                  <h4>{selectedSection.title}</h4>
                  {selectedSection.subtitle && <h6 className="text-muted">{selectedSection.subtitle}</h6>}
                </div>
                <div>
                  {getTypeBadge(selectedSection.type)}
                </div>
              </div>
              
              <div className="border-top pt-3">
                <div dangerouslySetInnerHTML={{ __html: selectedSection.content }} />
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer className="bg-light">
          <Button variant="outline-secondary" onClick={() => setViewModal(false)} disabled={isLoading}>
            Close
          </Button>
          {selectedSection && !staticSections.some(s => s.id === selectedSection.id) && (
            <>
              <Button variant="outline-danger" onClick={() => handleDelete(selectedSection.id)} disabled={isLoading}>
                <FaTrash className="me-1" /> Delete
              </Button>
              <Button variant="primary" disabled={isLoading}>
                <FaEdit className="me-1" /> Edit
              </Button>
            </>
          )}
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
                {[...staticSections, ...tableData].map((section, index) => (
                  <tr key={section.id || index}>
                    <td className="text-center">{index + 1}</td>
                    <td>{getTypeBadge(section.type)}</td>
                    <td>
                      <div className="fw-semibold">{section.title}</div>
                      <div className="text-muted small" style={{ maxHeight: '40px', overflow: 'hidden' }}>
                        {section.subtitle || 'No subtitle'}
                      </div>
                    </td>
                    <td>
                      <div 
                        className="text-muted small" 
                        style={{ maxHeight: '40px', overflow: 'hidden' }}
                        dangerouslySetInnerHTML={{ __html: section.content.substring(0, 100) + (section.content.length > 100 ? '...' : '') }}
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
                      {!staticSections.some(s => s.id === section.id) && (
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
                ))}
                {tableData.length === 0 && (
                  <tr>
                    <td colSpan="5" className="text-center py-4 text-muted">
                      No custom sections added yet. Click "Add Section" to create one.
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