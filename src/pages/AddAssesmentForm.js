import React, { useState } from "react";
import Offcanvas from "react-bootstrap/Offcanvas";
import { Button } from "@mui/material";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { addQA } from "../api/test";
import { toast } from "react-toastify";

export default function AddAssesmentFormFile({ handleClose, show }) {
  const [state, setState] = React.useState(null);
  const [answerValue, setAnswerValue] = React.useState(null);
  const [age, setAge] = React.useState("");
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState({
    option1: "",
    option2: "",
    option3: "",
    option4: "",
  });
  const token = localStorage.getItem("token");

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

  const handleSubmit = async () => {
    try {
      const optionsArray = [
        options.option1,
        options.option2,
        options.option3,
        options.option4,
      ];

      const response = await addQA(
        token,
        state,
        age,
        question,
        optionsArray,
        answerValue
      );
      console.log(response);
      if (response.status === 201) {
        handleClose();
        setState("");
        setAge("");
        setQuestion("");
        setOptions({
          option1: "",
          option2: "",
          option3: "",
          option4: "",
        });
        setAnswerValue(null);
        toast.success("Test Added Successfully", {
          autoClose: 3000,
        });
      }
    } catch (error) {
      console.log(error);
      toast.error("Getting error on posting Test", {
        autoClose: 3000,
      });
    }
  };

  const modalClose = () => {
    setState("");
    setAge("");
    setQuestion("");
    setOptions({
      option1: "",
      option2: "",
      option3: "",
      option4: "",
    });
    setAnswerValue(null);
  };
  return (
    <>
      <Offcanvas show={show} onHide={handleClose} placement={"end"}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Add Your Test</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <TextField
            label="Add Your State"
            variant="standard"
            value={state}
            className="w-100"
            onChange={(e) => {
              setState(e.target.value);
            }}
          />
          <div className="row gy-4 mt-4">
            <div className="col-lg-12 me-auto">
              <FormControl size="small" className="w-100"  variant="standard" >
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
                  <MenuItem value={"Easy"}>Easy</MenuItem>
                  <MenuItem value={"Medium"}>Medium</MenuItem>
                  <MenuItem value={"Hard"}>Hard</MenuItem>
                </Select>
              </FormControl>
            </div>

            {age && (
              <div className="col-lg-12">
                <TextField
                  id="standard-basic"
                  label="Add Your Question Here"
                  variant="standard"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
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
          <div className="kb-buttons-box d-flex justify-content-end gap-2 mt-3">
            <Button
              variant="contained"
              color="error"
              className="rounded-4"
              onClick={() => modalClose()}
            >
              Reset
            </Button>

            <Button
              variant="contained"
              color="success"
              className="rounded-4"
              onClick={() => handleSubmit()}
            >
              Save
            </Button>
          </div>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}
