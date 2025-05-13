import React, { useState } from "react";
import Offcanvas from "react-bootstrap/Offcanvas";
import { Button } from "@mui/material";
import TextField from "@mui/material/TextField";
import { registerUser } from "../api/auth";
import { toast } from "react-toastify";

export default function AddAdminForm({ open, setOpen, handleClose }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [state, setState] = useState("");
  const [password, setPassword] = useState("");
  const [mobile, setMobile] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true); 
    if (!name || !email || !state || !password || !mobile) {
      toast.error("Please fill all the fields");
      setIsSubmitting(false); 
      return;
    }
    const token = localStorage.getItem("token");
    const data = {
      name,
      email,
      locationName: state,
      latitude: 0,
      longitude: 0,
      role: "admin",
      password,
      mobile,
    };
    try {
      const response = await registerUser(data, token);
      if (response.status === 201) {
        handleClose();
        setName("");
        setEmail("");
        setState("");
        setPassword("");
        setMobile("");
        toast.success("User registered successfully");
        setIsSubmitting(false);
        setOpen(false) 
      }
    } catch (error) {
      toast.error(error?.response?.data?.message[0]);
      console.error("Error registering user:", error?.response?.data?.message[0]);
      setIsSubmitting(false);
    }
  };
  return (
    <Offcanvas show={open} onHide={handleClose} placement={"end"}>
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>Add Your Admin</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        <div className="row gy-4">
          <div className="col-lg-12 me-auto">
            <TextField
              id="outlined-basic"
              label="Enter Admin State"
              variant="standard"
              size="small"
              className="w-100"
              value={state}
              onChange={(e) => setState(e.target.value)}
              required
            />
          </div>
          {state && (
            <>
              <div className="col-lg-12 me-auto">
                <TextField
                  id="outlined-basic"
                  label="Enter Admin Name"
                  variant="standard"
                  size="small"
                  className="w-100"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="col-lg-12 me-auto">
                <TextField
                  id="outlined-basic"
                  label="Enter Admin Email"
                  variant="standard"
                  size="small"
                  className="w-100"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="col-lg-12 me-auto">
                <TextField
                  id="outlined-basic"
                  label="Enter Mobile"
                  variant="standard"
                  size="small"
                  className="w-100"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  required
                />
              </div>
              <div className="col-lg-12 me-auto">
                <TextField
                  id="outlined-basic"
                  label="Enter Password"
                  variant="standard"
                  size="small"
                  className="w-100"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </>
          )}
        </div>
        <div className="kb-buttons-box d-flex justify-content-end gap-2 mt-3">
          <Button
            variant="contained"
            color="error"
            className="rounded-4"
            onClick={() => handleClose()}
          >
            Reset
          </Button>

          <Button
            variant="contained"
            color="success"
            className="rounded-4"
            onClick={handleSubmit}
            disabled={isSubmitting === true}
          >
            Save
          </Button>
        </div>
      </Offcanvas.Body>
    </Offcanvas>
  );
}
