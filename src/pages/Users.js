import React from "react";
import { Typography, Paper, Box } from "@mui/material";
import DataTable from "../components/datatable";

const Users = () => {
  return (
    <Paper elevation={3} sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Users
      </Typography>
      <Box>
        <Paper className="w-100 table-responsive">
          <DataTable />
        </Paper>
      </Box>
    </Paper>
  );
};

export default Users;
