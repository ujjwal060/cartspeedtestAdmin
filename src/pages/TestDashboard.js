import React, { useState } from "react";
import { Box, Typography } from "@mui/material";
import Offcanvas from "react-bootstrap/Offcanvas";
import { Button } from "@mui/material";
import Chip from "@mui/material/Chip";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Accordion from "react-bootstrap/Accordion";
import AddTestFormFile from "./AddTestForm";

const TestDashboard = () => {
  const [show, setShow] = useState(false);

  const [value, setValue] = React.useState(null);
  const [answerValue, setAnswerValue] = React.useState(null);
  const [filterLevel, setFilterLevel] = React.useState(null);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [age, setAge] = React.useState("");
  const [options, setOptions] = useState({
    option1: "",
    option2: "",
    option3: "",
    option4: "",
  });

  const handleChange = (event) => {
    setAge(event.target.value);
  };

  const handleOptionChange = (e) => {
    const { id, value } = e.target;
    setOptions((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const allOptionsFilled = () => {
    return (
      options.option1 && options.option2 && options.option3 && options.option4
    );
  };

  const answerOptions = [
    options.option1,
    options.option2,
    options.option3,
    options.option4,
  ].filter((opt) => opt); // Filter out empty options

  return (
    <Box p={4}>
      {/* Table */}
      <Box>
        <div className="d-flex justify-content-end gap-2">
          <FormControl sx={{ width: "200px" }} size="small">
            <InputLabel id="demo-simple-select-label">
              Filter By Level
            </InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={filterLevel}
              label="Filter By Level"
              onChange={(e) => setFilterLevel(e.target.value)}
              sx={{ height: "40px" }}
            >
              <MenuItem value={1}>Level 1</MenuItem>
              <MenuItem value={2}>Level 2</MenuItem>
              <MenuItem value={3}>Level 3</MenuItem>
            </Select>
          </FormControl>
          <Button
            variant="contained"
            color="primary"
            className="mb-3 "
            onClick={handleShow}
          >
            Add Test
          </Button>
        </div>

        <Accordion
          className="d-flex flex-column gap-3"
          defaultActiveKey="0"
          flush
        >
          <Accordion.Item eventKey="0">
            <Accordion.Header>Q1 Lorem Ipsum</Accordion.Header>
            <Accordion.Body>
              <div className="row align-items-start">
                <div className="col-lg-3">
                  <Typography className="text-start" variant="h6">
                    Level: 1
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
            <Accordion.Header>Q2 Lorem Ipsum</Accordion.Header>
            <Accordion.Body>
              <div className="row align-items-start">
                <div className="col-lg-3">
                  <Typography className="text-start" variant="h6">
                    Level: 1
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
      <AddTestFormFile handleClose={handleClose} show={show} />
    </Box>
  );
};

export default TestDashboard;
