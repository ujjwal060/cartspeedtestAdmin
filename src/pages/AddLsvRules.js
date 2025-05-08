// import React, { useState } from 'react';
// import { Button, Modal, Table, Container } from 'react-bootstrap';
// import { CKEditor } from '@ckeditor/ckeditor5-react';
// import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

// const AddLsvRules = () => {
//   const [showModal, setShowModal] = useState(false);
//   const [editorData, setEditorData] = useState('');
//   const [tableData, setTableData] = useState([]);

//   const handleSave = () => {
//     if (editorData.trim() !== '') {
//       setTableData([...tableData, editorData]);
//       setEditorData('');
//       setShowModal(false);
//     }
//   };

//   return (
//     <Container className="mt-5">
//       <div className="d-flex justify-content-between align-items-center mb-3">
//         <h3>Add LSV Rules</h3>
//         <Button onClick={() => setShowModal(true)}>Add</Button>
//       </div>

//       {/* Modal with CKEditor */}
//       <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
//         <Modal.Header closeButton>
//           <Modal.Title>Add Content</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <CKEditor
//             editor={ClassicEditor}
//             data={editorData}
//             onChange={(event, editor) => {
//               const data = editor.getData();
//               setEditorData(data);
//             }}
//           />
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
//           <Button variant="primary" onClick={handleSave}>Save</Button>
//         </Modal.Footer>
//       </Modal>

//       {/* Table to show data */}
//       <Table bordered hover>
//         <thead>
//           <tr>
//             <th>#</th>
//             <th>Content</th>
//           </tr>
//         </thead>
//         <tbody>
//           {tableData.map((content, index) => (
//             <tr key={index}>
//               <td>{index + 1}</td>
//               <td dangerouslySetInnerHTML={{ __html: content }} />
//             </tr>
//           ))}
//         </tbody>
//       </Table>
//     </Container>
//   );
// };

// export default AddLsvRules;


// import React, { useState } from 'react';
// import { Button, Modal, Table, Container } from 'react-bootstrap';
// import { CKEditor } from '@ckeditor/ckeditor5-react';
// import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
// import { useNavigate } from 'react-router-dom'; // 👈 Step 1

// const AddLsvRules = () => {
//   const [showModal, setShowModal] = useState(false);
//   const [editorData, setEditorData] = useState('');
//   const [tableData, setTableData] = useState([]);
//   const navigate = useNavigate(); // 👈 Step 2

//   // const handleSave = () => {
//   //   if (editorData.trim() !== '') {
//   //     setTableData([...tableData, editorData]);
//   //     setEditorData('');
//   //     setShowModal(false);
//   //     navigate('/lsv-rules'); // 👈 Step 3
//   //   }
//   // };


//   const handleSave = () => {
//     if (editorData.trim() !== '') {
//       setTableData([...tableData, editorData]);
//       setEditorData('');
//       setShowModal(false);
  
//       // Navigate after 10 seconds
//       setTimeout(() => {
//         navigate('/lsv-rules');
//       }, 3000); // 10,000 milliseconds = 10 seconds
//     }
//   };
  
//   return (
//     <Container className="mt-5">
//       <div className="d-flex justify-content-between align-items-center mb-3">
//         <h3>Add LSV Rules</h3>
//         <Button onClick={() => setShowModal(true)}>Add</Button>
//       </div>

//       {/* Modal with CKEditor */}
//       <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
//         <Modal.Header closeButton>
//           <Modal.Title>Add Content</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <CKEditor
//             editor={ClassicEditor}
//             data={editorData}
//             onChange={(event, editor) => {
//               const data = editor.getData();
//               setEditorData(data);
//             }}
//           />
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
//           <Button variant="primary" onClick={handleSave}>Save</Button>
//         </Modal.Footer>
//       </Modal>

//       {/* Table to show data */}
//       <Table bordered hover>
//         <thead>
//           <tr>
//             <th>#</th>
//             <th>Content</th>
//           </tr>
//         </thead>
//         <tbody>
//           {tableData.map((content, index) => (
//             <tr key={index}>
//               <td>{index + 1}</td>
//               <td dangerouslySetInnerHTML={{ __html: content }} />
//             </tr>
//           ))}
//         </tbody>
//       </Table>
//     </Container>
//   );
// };

// export default AddLsvRules;


import React, { useState } from 'react';
import { Button, Modal, Table, Container } from 'react-bootstrap';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddLsvRules = () => {
  const [showModal, setShowModal] = useState(false);
  const [editorData, setEditorData] = useState('');
  const [tableData, setTableData] = useState([]);
  const navigate = useNavigate();

  const handleSave = () => {
    if (editorData.trim() !== '') {
      setTableData([...tableData, editorData]);
      setEditorData('');
      setShowModal(false);

      // Show toast
      toast.success('Content added successfully!', {
        position: 'top-right',
        autoClose: 2000,
      });

      // Navigate after 10 seconds
      setTimeout(() => {
        navigate('/lsv-rules');
      }, 4000);
    }
  };

  return (
    <Container className="mt-5">
      <ToastContainer />

      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Add LSV Rules</h3>
        <Button onClick={() => setShowModal(true)}>Add</Button>
      </div>

      {/* Modal with CKEditor */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Add Content</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <CKEditor
            editor={ClassicEditor}
            data={editorData}
            onChange={(event, editor) => {
              const data = editor.getData();
              setEditorData(data);
            }}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
          <Button variant="primary" onClick={handleSave}>Save</Button>
        </Modal.Footer>
      </Modal>

      {/* Table to show data */}
      <Table bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Content</th>
          </tr>
        </thead>
        <tbody>
          {tableData.map((content, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td dangerouslySetInnerHTML={{ __html: content }} />
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default AddLsvRules;
