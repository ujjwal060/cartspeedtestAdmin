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
import AddTestForm from "./AddTestForm";

export default function AddTestFormFile({ handleClose, show }) {
  const [value, setValue] = React.useState(null);
  const [answerValue, setAnswerValue] = React.useState(null);
  const [filterLevel, setFilterLevel] = React.useState(null);
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
    <>
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
          <div className="kb-buttons-box d-flex justify-content-end gap-2">
            <Button variant="contained" color="error" className="rounded-4">
              Reset
            </Button>

            <Button variant="contained" color="success" className="rounded-4">
              Save
            </Button>
          </div>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}
