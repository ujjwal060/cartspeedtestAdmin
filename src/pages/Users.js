import React from 'react';
import { Typography, Paper, Box } from '@mui/material';

const Users = () => {
  return (
    <Paper elevation={3} sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Users
      </Typography>
      <Box>
        {/* Yahan aap user list ya table laga sakte ho */}
        <Typography>This is the Users page.</Typography>
      </Box>
    </Paper>
  );
};

export default Users;
