

import React, { useState } from 'react';
import { Button, Modal, Table, Container, Form, Row, Col } from 'react-bootstrap';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddLsvRules = () => {
  const [showModal, setShowModal] = useState(false);
  const [sectionType, setSectionType] = useState('traffic');
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState('');
  const [tableData, setTableData] = useState([]);
  const navigate = useNavigate();

  const handleSave = () => {
    if (title.trim() !== '' && content.trim() !== '') {
      const newSection = {
        id: Date.now(),
        type: sectionType,
        title,
        subtitle,
        content,
        image
      };

      setTableData([...tableData, newSection]);
      resetForm();
      setShowModal(false);

      toast.success('Section added successfully!', {
        position: 'top-right',
        autoClose: 2000,
      });

      setTimeout(() => {
        navigate('/lsv-rules');
      }, 4000);
    }
  };

  const resetForm = () => {
    setSectionType('traffic');
    setTitle('');
    setSubtitle('');
    setContent('');
    setImage('');
  };

  const sectionTypes = [
    { value: 'traffic', label: 'Traffic & Parking' },
    { value: 'safety', label: 'Safety & Operation' },
    { value: 'damage', label: 'Damage Inspection' }
  ];

  return (
    <Container className="mt-5">
      <ToastContainer />

      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Add LSV Rules</h3>
        <Button onClick={() => setShowModal(true)}>Add Section</Button>
      </div>

      {/* Modal for adding new section */}
      <Modal show={showModal} onHide={() => { setShowModal(false); resetForm(); }} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Add New Section</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Section Type</Form.Label>
              <Form.Select 
                value={sectionType} 
                onChange={(e) => setSectionType(e.target.value)}
              >
                {sectionTypes.map((type) => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control 
                type="text" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter section title"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Subtitle (Optional)</Form.Label>
              <Form.Control 
                type="text" 
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="Enter subtitle"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Image URL (Optional)</Form.Label>
              <Form.Control 
                type="text" 
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="Enter image URL"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Content</Form.Label>
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

      {/* Table to show data */}
      <Table bordered hover className="mt-4">
        <thead>
          <tr>
            <th>#</th>
            <th>Type</th>
            <th>Title</th>
            <th>Subtitle</th>
            <th>Image</th>
            <th>Content Preview</th>
          </tr>
        </thead>
        <tbody>
          {tableData.map((section, index) => (
            <tr key={section.id}>
              <td>{index + 1}</td>
              <td>{sectionTypes.find(t => t.value === section.type)?.label}</td>
              <td>{section.title}</td>
              <td>{section.subtitle || '-'}</td>
              <td>
                {section.image ? (
                  <a href={section.image} target="_blank" rel="noopener noreferrer">View Image</a>
                ) : '-'}
              </td>
              <td>
                <div 
                  dangerouslySetInnerHTML={{ __html: section.content.substring(0, 100) + '...' }} 
                  style={{ maxHeight: '50px', overflow: 'hidden' }}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default AddLsvRules;