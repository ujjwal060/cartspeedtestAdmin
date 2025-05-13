import React, { useState, useEffect } from "react";
import Offcanvas from "react-bootstrap/Offcanvas";
import { Button } from "@mui/material";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { addQA, getVideos } from "../api/test";
import { toast } from "react-toastify";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import SystemUpdateAltIcon from "@mui/icons-material/SystemUpdateAlt";

export default function AddAssesmentFormFile({
  handleClose,
  show,
  onVideoUploaded,
}) {
  const [answerValue, setAnswerValue] = React.useState(null);
  const [age, setAge] = React.useState("");
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState({
    option1: "",
    option2: "",
    option3: "",
    option4: "",
  });
  const [videoOptions, setVideoOptions] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [questionsList, setQuestionsList] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const token = localStorage.getItem("token");


  useEffect(() => {
    if (age) {
      const fetchVideos = async () => {
        try {
          const response = await getVideos(token, age);
          setVideoOptions(response.data);
        } catch (error) {
          toast.error("Failed to fetch videos");
        }
      };
      fetchVideos();
    }
  }, [age]);

  const handleChange = (event) => {
    setAge(event.target.value);
    setSelectedVideo(null);
    setVideoOptions([]);
    setQuestionsList([]);
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

  const addQuestionToList = () => {
    if (!question || !answerValue || !allOptionsFilled()) {
      toast.error("Please fill all fields before adding question");
      return;
    }

    const newQuestion = {
      question,
      options: [
        options.option1,
        options.option2,
        options.option3,
        options.option4,
      ],
      answer: answerValue,
    };

    if (editingIndex !== null) {
      const updatedList = [...questionsList];
      updatedList[editingIndex] = newQuestion;
      setQuestionsList(updatedList);
      setEditingIndex(null);
      toast.success("Question updated", { autoClose: 2000 });
    } else {
      setQuestionsList([...questionsList, newQuestion]);
    }
    resetForm();
  };

  const editQuestion = (index) => {
    const questionToEdit = questionsList[index];
    setQuestion(questionToEdit.question);
    setOptions({
      option1: questionToEdit.options[0],
      option2: questionToEdit.options[1],
      option3: questionToEdit.options[2],
      option4: questionToEdit.options[3],
    });
    setAnswerValue(questionToEdit.answer);
    setEditingIndex(index);
  };

  const removeQuestion = (index) => {
    const updatedList = [...questionsList];
    updatedList.splice(index, 1);
    setQuestionsList(updatedList);
    if (editingIndex === index) {
      resetForm();
      setEditingIndex(null);
    } else if (editingIndex > index) {
      setEditingIndex(editingIndex - 1);
    }
  };

  const resetForm = () => {
    setQuestion("");
    setOptions({
      option1: "",
      option2: "",
      option3: "",
      option4: "",
    });
    setAnswerValue(null);
  };

const handleSubmit = async () => {
  if (questionsList.length === 0) {
    toast.error("Please add at least one question");
    return;
  }
const adminId = localStorage.getItem("userId"); 
  if (!adminId) {
    toast.error("Admin ID not found");
    return;
  }

  try {
    const promises = questionsList.map((q) =>
      addQA(
        token,
        age, 
        q.question,
        q.options,
        q.answer,
        selectedVideo.vId,
        selectedVideo.location,
        selectedVideo.sId,
        adminId
      )
    );

    await Promise.all(promises);

    handleClose();
    modalClose();
    onVideoUploaded();
    toast.success(`${questionsList.length} Questions Added Successfully`, {
      autoClose: 3000,
    });
  } catch (error) {
    toast.error(
      error?.response?.data?.message?.[0] || "Failed to add questions"
    );
  }
};



  const modalClose = () => {
    setAge("");
    resetForm();
    setSelectedVideo(null);
    setVideoOptions([]);
    setQuestionsList([]);
    setEditingIndex(null);
  };

  return (
    <Offcanvas show={show} onHide={handleClose} placement={"end"}>
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>Add Your Test</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        <div className="col-lg-12 me-auto">
          <FormControl size="small" className="w-100" variant="standard">
            <InputLabel id="demo-simple-select-label">
              Select Section
            </InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={age}
              label="Select Section"
              onChange={handleChange}
            >
              <MenuItem value={"Section1"}>Section1</MenuItem>
              <MenuItem value={"Section2"}>Section2</MenuItem>
              <MenuItem value={"Section3"}>Section3</MenuItem>
              <MenuItem value={"Section4"}>Section4</MenuItem>
              <MenuItem value={"Section5"}>Section5</MenuItem>
            </Select>
          </FormControl>
        </div>

        {age && videoOptions.length > 0 && (
          <div className="col-lg-12 mt-4">
            <Autocomplete
              id="video-select"
              value={selectedVideo}
              options={videoOptions}
              getOptionLabel={(option) => option.title}
              onChange={(event, newValue) => {
                setSelectedVideo(newValue);
                setQuestionsList([]);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Select Video"
                  variant="standard"
                />
              )}
            />
          </div>
        )}

        {selectedVideo && (
          <>
            <div className="row gy-4 mt-4">
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

            <div className="mt-3">
              <Button
                variant="contained"
                color={editingIndex !== null ? "warning" : "primary"}
                className="rounded-4"
                onClick={addQuestionToList}
                disabled={!question || !answerValue || !allOptionsFilled()}
                startIcon={
                  editingIndex !== null ? (
                    <SystemUpdateAltIcon />
                  ) : (
                    <AddCircleOutlineIcon />
                  )
                }
              >
                {editingIndex !== null ? "Update" : "Add"} (
                {questionsList.length}/10)
              </Button>

              {editingIndex !== null && (
                <Button
                  variant="outlined"
                  color="error"
                  className="rounded-4 ms-2"
                  onClick={() => {
                    resetForm();
                    setEditingIndex(null);
                  }}
                >
                  Cancel
                </Button>
              )}
            </div>
          </>
        )}

        {questionsList.length > 0 && (
          <div className="mt-3">
            <h6>Questions to be added ({questionsList.length}):</h6>
            <List dense={true} style={{ maxHeight: "200px", overflow: "auto" }}>
              {questionsList.map((q, index) => (
                <ListItem
                  key={index}
                  secondaryAction={
                    <>
                      <IconButton
                        edge="end"
                        onClick={() => editQuestion(index)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        edge="end"
                        onClick={() => removeQuestion(index)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </>
                  }
                >
                  <ListItemText
                    primary={`Q${index + 1}: ${q.question}`}
                    secondary={`Answer: ${q.answer}`}
                  />
                </ListItem>
              ))}
            </List>
          </div>
        )}

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
            onClick={handleSubmit}
            disabled={questionsList.length === 0 || editingIndex !== null}
          >
            Save
          </Button>
        </div>
      </Offcanvas.Body>
    </Offcanvas>
  );
}
