import React, { useState,useEffect } from "react";
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
import { getQA } from "../api/test"

const TestDashboard = () => {
  const rowsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(0);
  const [filters, setFilters] = useState({});
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
  const token = localStorage.getItem("token");

    const fetchQA = async () => {
      const offset = currentPage * rowsPerPage;
      const limit = rowsPerPage;
      try {
        const response = await getQA(
          token,
          offset,
          limit,
          filters
        );
        console.log(response);
        
      } catch (error) {
        console.error("Error fetching videos:", error);
      } finally {
      }
    };

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
  ].filter((opt) => opt);

 useEffect(() => {
    fetchQA();
  }, [currentPage]);
  return (
    <Box p={4}>
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
              <MenuItem value={1}>easy</MenuItem>
              <MenuItem value={2}>medium</MenuItem>
              <MenuItem value={3}>hard</MenuItem>
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
            {value && (
              <div className="col-lg-6 me-auto">
                <FormControl size="small" className="w-100">
                  <InputLabel id="demo-simple-select-label">
                    Select Level
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={age}
                    label="Select Level"
                    onChange={handleChange}
                  >
                    <MenuItem value={"1"}>Level 1</MenuItem>
                    <MenuItem value={"2"}>Level 2</MenuItem>
                    <MenuItem value={"3"}>Level 3</MenuItem>
                  </Select>
                </FormControl>
              </div>
            )}

            {age && (
              <div className="col-lg-12">
                <TextField
                  id="standard-basic"
                  label="Add Your Question Here"
                  variant="standard"
                  className="w-100"
                />
              </div>
            )}

            {age && (
              <>
                <div className="col-lg-6">
                  <TextField
                    id="option1"
                    label="Option 1"
                    variant="standard"
                    className="w-100"
                    value={options.option1}
                    onChange={handleOptionChange}
                  />
                </div>
                <div className="col-lg-6">
                  <TextField
                    id="option2"
                    label="Option 2"
                    variant="standard"
                    className="w-100"
                    value={options.option2}
                    onChange={handleOptionChange}
                  />
                </div>

                <div className="col-lg-6">
                  <TextField
                    id="option3"
                    label="Option 3"
                    variant="standard"
                    className="w-100"
                    value={options.option3}
                    onChange={handleOptionChange}
                  />
                </div>
                <div className="col-lg-6">
                  <TextField
                    id="option4"
                    label="Option 4"
                    variant="standard"
                    className="w-100"
                    value={options.option4}
                    onChange={handleOptionChange}
                  />
                </div>
              </>
            )}

            {age && (
              <div className="col-lg-12">
                <Autocomplete
                  id="answer-select"
                  value={answerValue}
                  options={answerOptions}
                  disabled={!allOptionsFilled()}
                  onChange={(event, newValue) => {
                    setAnswerValue(newValue);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Add Your Answer"
                      variant="standard"
                    />
                  )}
                />
              </div>
            )}
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
