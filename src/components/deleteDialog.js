import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { Drawer, AppBar, Button } from "@mui/material";
import Slide from "@mui/material/Slide";
import { FaEdit, FaTrash } from "react-icons/fa";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
export default function DialogBox({ open, onClose, onDelete }) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      slots={{
        transition: Transition,
      }}
      maxWidth="xs"
      keepMounted
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title" className="text-center">
        {" "}
        <FaTrash size={40} color="white" className="delete-icon-custom" />
      </DialogTitle>
      <DialogContent>
        <DialogContentText
          id="alert-dialog-description"
          className="text-center"
        >
          Do you really want to delete this item?
        </DialogContentText>
      </DialogContent>
      <DialogActions className="d-flex justify-content-center gap-3 align-items-center px-4">
        <Button
          onClick={onClose}
          variant="outlined"
          color="error"
          autoFocus
          className="w-100"
        >
          No
        </Button>
        <Button
          onClick={onDelete}
          style={{
            background: "linear-gradient(to right, #3f87a6, #ebf8e1)",
            color: "black",
          }}
          color="success"
          className="w-100"
        >
          Yes
        </Button>
      </DialogActions>
    </Dialog>
  );
}
