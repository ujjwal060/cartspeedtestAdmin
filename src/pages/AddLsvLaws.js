import React, { useState } from 'react';
import { Button, Modal, Table, Container, Form, Row, Col } from 'react-bootstrap';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddLsvLaws = () => {
  const [showModal, setShowModal] = useState(false);
  const [sectionType, setSectionType] = useState('driver');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [laws, setLaws] = useState([{ id: 1, content: '' }]);
  const [tableData, setTableData] = useState([]);
  const navigate = useNavigate();

  const handleAddLaw = () => {
    setLaws([...laws, { id: Date.now(), content: '' }]);
  };

  const handleLawChange = (id, content) => {
    setLaws(laws.map(law => 
      law.id === id ? { ...law, content } : law
    ));
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
        laws: validLaws.map(law => law.content)
      };

      setTableData([...tableData, newSection]);
      resetForm();
      setShowModal(false);

      toast.success('Law section added successfully! Redirecting...', {
        position: 'top-right',
        autoClose: 2000,
      });

      // Redirect after 2 seconds
      setTimeout(() => {
        navigate('/lsv-laws');
      }, 2000);
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

  const sectionTypes = [
    { value: 'driver', label: 'Driver & Passenger Laws' },
    { value: 'roadway', label: 'Roadway Laws' },
    { value: 'vehicle', label: 'Vehicle Requirements' }
  ];

  return (
    <Container className="mt-5">
      <ToastContainer />

      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Add LSV Laws</h3>
        <Button onClick={() => setShowModal(true)}>Add Law Section</Button>
      </div>

      {/* Modal for adding new law section */}
      <Modal show={showModal} onHide={() => { setShowModal(false); resetForm(); }} size="xl">
        <Modal.Header closeButton>
          <Modal.Title>Add New Law Section</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              <Col md={6}>
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
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Title*</Form.Label>
              <Form.Control 
                type="text" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Laws for All Drivers & Passengers of LSVs"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description (Optional)</Form.Label>
              <CKEditor
                editor={ClassicEditor}
                data={description}
                onChange={(event, editor) => {
                  const data = editor.getData();
                  setDescription(data);
                }}
                config={{
                  toolbar: ['heading', '|', 'bold', 'italic', 'link', 'bulletedList', 'numberedList']
                }}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Laws*</Form.Label>
              {laws.map((law) => (
                <div key={law.id} className="mb-4 p-3 border rounded">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <h6 className="mb-0">Law {laws.indexOf(law) + 1}</h6>
                    <Button 
                      variant="outline-danger" 
                      size="sm"
                      onClick={() => handleRemoveLaw(law.id)}
                      disabled={laws.length <= 1}
                    >
                      Remove
                    </Button>
                  </div>
                  <CKEditor
                    editor={ClassicEditor}
                    data={law.content}
                    onChange={(event, editor) => {
                      const data = editor.getData();
                      handleLawChange(law.id, data);
                    }}
                    config={{
                      toolbar: ['bold', 'italic', 'link', 'bulletedList', 'numberedList']
                    }}
                  />
                </div>
              ))}
              <Button 
                variant="outline-primary" 
                className="mt-2"
                onClick={handleAddLaw}
              >
                Add Another Law
              </Button>
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
            <th>Description Preview</th>
            <th>Laws Count</th>
          </tr>
        </thead>
        <tbody>
          {tableData.map((section, index) => (
            <tr key={section.id}>
              <td>{index + 1}</td>
              <td>{sectionTypes.find(t => t.value === section.type)?.label}</td>
              <td>{section.title}</td>
              <td>
                <div 
                  dangerouslySetInnerHTML={{ __html: section.description.substring(0, 100) + (section.description.length > 100 ? '...' : '') }} 
                  style={{ maxHeight: '50px', overflow: 'hidden' }}
                />
              </td>
              <td>{section.laws.length}</td>
            </tr>
          ))}
        </tbody>
      </Table>


    </Container>
  );
};

export default AddLsvLaws;