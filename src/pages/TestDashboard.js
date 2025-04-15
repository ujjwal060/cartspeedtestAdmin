import React, { useState } from "react";
import { Box, Typography, Paper } from "@mui/material";
import Offcanvas from "react-bootstrap/Offcanvas";
import Table from "react-bootstrap/Table";
import Pagination from "react-bootstrap/Pagination";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import { Button } from "@mui/material";
import Chip from "@mui/material/Chip";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";

import Accordion from "react-bootstrap/Accordion";
const dummyVideos = [
  {
    id: 1,
    title: "Video 1",
    url: "https://www.w3schools.com/html/mov_bbb.mp4",
    views: 0.1,
  },
  {
    id: 2,
    title: "Video 2",
    url: "https://www.w3schools.com/html/movie.mp4",
    views: 1.0,
  },
  {
    id: 3,
    title: "Video 3",
    url: "https://www.w3schools.com/html/mov_bbb.mp4",
    views: 0.2,
  },
];

const TestDashboard = () => {
  const [selectedVideo, setSelectedVideo] = useState(dummyVideos[0]);
  const [show, setShow] = useState(false);
  const [addAnswer, setAddAnswer] = useState(false);
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [optionsList, setOptionsList] = useState([]);
  const [showOptionInput, setShowOptionInput] = useState(false);
  const [newOption, setNewOption] = useState("");
  const [value, setValue] = React.useState(null);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleAddOption = () => {
    setShowOptionInput(true);
  };

  const handleSaveOption = () => {
    if (newOption.trim()) {
      setOptionsList((prev) => [...prev, newOption.trim()]);
      setNewOption("");
      setShowOptionInput(false);
    }
  };

  const handleAddAnswer = () => {
    setAddAnswer(true);
  };

  return (
    <Box p={4}>
      {/* Table */}
      <Box>
        <div className="d-flex justify-content-end">
          <Button
            variant="contained"
            color="primary"
            className="mb-3 "
            onClick={handleShow}
          >
            Add Your Test
          </Button>
        </div>

        <Accordion
          className="d-flex flex-column gap-3"
          defaultActiveKey="0"
          flush
        >
          <Accordion.Item eventKey="0">
            <Accordion.Header>#1 Lorem Ipsum</Accordion.Header>
            <Accordion.Body>
              <div className="row align-items-start">
                <div className="col-lg-3">
                  <Typography className="text-start" variant="h6">
                    Your Options
                  </Typography>
                </div>
                <div className="col-lg-9">
                  <Typography className="text-end" variant="h6">
                    Selected Location: Uttar Pradesh , India
                  </Typography>
                </div>

                <div className="col-lg-6">
                  <div className="row gy-3 align-items-center ps-1 pt-3">
                    <div className="col-lg-6">
                      <Typography>A. Lorem Ipsum</Typography>
                    </div>
                    <div className="col-lg-6">
                      <Typography>B. Lorem Ipsum</Typography>
                    </div>
                    <div className="col-lg-6">
                      <Typography>C. Lorem Ipsum</Typography>
                    </div>
                    <div className="col-lg-6">
                      <Typography>D. Lorem Ipsum</Typography>
                    </div>
                  </div>
                </div>
                <div className="col-lg-6">
                  <div className="mt-5 d-flex justify-content-end">
                    <Chip label=" D. Lorem Ipsum" color="success" />
                  </div>
                </div>
              </div>
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="1">
            <Accordion.Header>#2 Lorem Ipsum</Accordion.Header>
            <Accordion.Body>
              <div className="row align-items-start">
                <div className="col-lg-3">
                  <Typography className="text-start" variant="h6">
                    Your Options
                  </Typography>
                </div>
                <div className="col-lg-9">
                  <Typography className="text-end" variant="h6">
                    Selected Location: Uttar Pradesh , India
                  </Typography>
                </div>

                <div className="col-lg-6">
                  <div className="row gy-3 align-items-center ps-1 pt-3">
                    <div className="col-lg-6">
                      <Typography>A. Lorem Ipsum</Typography>
                    </div>
                    <div className="col-lg-6">
                      <Typography>B. Lorem Ipsum</Typography>
                    </div>
                    <div className="col-lg-6">
                      <Typography>C. Lorem Ipsum</Typography>
                    </div>
                    <div className="col-lg-6">
                      <Typography>D. Lorem Ipsum</Typography>
                    </div>
                  </div>
                </div>
                <div className="col-lg-6">
                  <div className="mt-5 d-flex justify-content-end">
                    <Chip label=" D. Lorem Ipsum" color="success" />
                  </div>
                </div>
              </div>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </Box>
      <Offcanvas show={show} onHide={handleClose} placement={"end"}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Add Your Test</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Autocomplete
            id="controlled-demo"
            value={value}
            options={[
              "Option A",
              "Option B",
              "Option C",
              "Option D",
              "Option E",
            ]}
            onChange={(event, newValue) => {
              setValue(newValue);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Add Your State"
                variant="standard"
              />
            )}
          />
          <div className="row gy-4 mt-4">
            <div className="col-lg-12">
              <TextField
                id="standard-basic"
                label="Add Your Question Here"
                variant="standard"
                className="w-100"
              />
              {showOptionInput && (
                <div className="mt-3">
                  <TextField
                    label="New Option"
                    variant="standard"
                    value={newOption}
                    onChange={(e) => setNewOption(e.target.value)}
                    className="flex-grow-1"
                  />
                  <Button
                    variant="contained"
                    onClick={handleSaveOption}
                    color="success"
                  >
                    Save
                  </Button>
                </div>
              )}

              <Button
                variant="contained"
                color="success"
                className="mt-3 "
                onClick={handleAddOption}
              >
                Add Your options +
              </Button>
              {optionsList.length > 0 && (
                <ul className="mt-4">
                  {optionsList.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              )}
              {optionsList.length > 0 && (
                <Button
                  variant="contained"
                  color="info"
                  className="mt-3 "
                  onClick={handleAddAnswer}
                >
                  Add Your Correct Answer
                </Button>
              )}
              {addAnswer && (
                <Autocomplete
                  id="controlled-demo"
                  className="mt-4"
                  value={correctAnswer}
                  options={optionsList}
                  onChange={(event, newValue) => {
                    setCorrectAnswer(newValue);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Add Your Correct Answer"
                      variant="standard"
                    />
                  )}
                />
              )}
            </div>
          </div>
          <div className="row gy-4 mt-2">
            <div className="col-lg-6">
              <Button variant="contained" className="w-100" color="error">
                Reset
              </Button>
            </div>
            <div className="col-lg-6">
              <Button variant="contained" className="w-100" color="success">
                Save
              </Button>
            </div>
          </div>
        </Offcanvas.Body>
      </Offcanvas>
    </Box>
  );
};

export default TestDashboard;
