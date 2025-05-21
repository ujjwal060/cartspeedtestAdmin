import React, { useState } from 'react';
import { Button, Modal, Table, Container, Form, Accordion } from 'react-bootstrap';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { FaEye } from 'react-icons/fa';
import 'react-toastify/dist/ReactToastify.css';

const AddLsvRules = () => {
  const [showModal, setShowModal] = useState(false);
  const [viewModal, setViewModal] = useState(false);
  const [selectedSection, setSelectedSection] = useState(null);

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
      content: 'A Low-Speed Vehicle (LSV)...'
    },
    {
      id: 2,
      type: 'info',
      title: 'Importance',
      content: 'Proper regulation of LSVs...'
    },
    {
      id: 3,
      type: 'info',
      title: 'Safety',
      content: 'LSV operators must follow all traffic laws...'
    }
  ];

  const handleSave = () => {
    if (title.trim() !== '' && content.trim() !== '') {
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
    { value: 'traffic', label: 'Traffic & Parking' },
    { value: 'safety', label: 'Safety & Operation' },
    { value: 'damage', label: 'Damage Inspection' }
  ];

  return (
    <Container className="mt-5">
      <ToastContainer />
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="fw-bold">Add LSV Rules</h3>
        <Button variant="primary" onClick={() => setShowModal(true)}>Add Section</Button>
      </div>


      <Modal show={showModal} onHide={() => { setShowModal(false); resetForm(); }} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Add New Section</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Accordion defaultActiveKey="0" className="mb-4">
            {staticSections.map((section, index) => (
              <Accordion.Item eventKey={index.toString()} key={section.id}>
                <Accordion.Header>{section.title}</Accordion.Header>
                <Accordion.Body>
                  <p className="text-muted">{section.content}</p>
                </Accordion.Body>
              </Accordion.Item>
            ))}
          </Accordion>

          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Section Type</Form.Label>
              <Form.Select value={sectionType} onChange={(e) => setSectionType(e.target.value)}>
                {sectionTypes.map((type) => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Title <span className="text-danger">*</span></Form.Label>
              <Form.Control 
                type="text" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter section title"
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
              <CKEditor
                editor={ClassicEditor}
                data={content}
                onChange={(event, editor) => {
                  const data = editor.getData();
                  setContent(data);
                }}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => { setShowModal(false); resetForm(); }}>Close</Button>
          <Button variant="primary" onClick={handleSave}>Save Section</Button>
        </Modal.Footer>
      </Modal>

   
      <Modal show={viewModal} onHide={() => setViewModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>View Section Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedSection && (
            <div>
              <p><strong>Type:</strong> {sectionTypes.find(t => t.value === selectedSection.type)?.label || 'General Info'}</p>
              <p><strong>Title:</strong> {selectedSection.title}</p>
              <p><strong>Subtitle:</strong> {selectedSection.subtitle || '-'}</p>
    
              <div>
                <strong>Content:</strong>
                <div dangerouslySetInnerHTML={{ __html: selectedSection.content }} className="border p-2 rounded bg-light mt-2" />
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setViewModal(false)}>Close</Button>
        </Modal.Footer>
      </Modal>

     
      <Table bordered responsive hover className="mt-4 align-middle">
        <thead className="table-dark text-center">
          <tr>
            <th>#</th>
            <th>Type</th>
            <th>Title</th>
            <th>Subtitle</th>
            <th>Content Preview</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {[...staticSections, ...tableData].map((section, index) => (
            <tr key={section.id || index}>
              <td className="text-center">{index + 1}</td>
              <td className="text-center">{sectionTypes.find(t => t.value === section.type)?.label || 'General Info'}</td>
              <td className="fw-semibold">{section.title}</td>
              <td>{section.subtitle || '-'}</td>
              <td>
                <div 
                  className="text-break text-muted" 
                  style={{ maxHeight: '80px', overflow: 'hidden' }}
                  dangerouslySetInnerHTML={{ __html: section.content.substring(0, 150) + '...' }}
                />
              </td>
              <td className="text-center">
                <Button 
                  variant="outline-primary" 
                  size="sm" 
                  onClick={() => {
                    setSelectedSection(section);
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
    </Container>
  );
};

export default AddLsvRules;
