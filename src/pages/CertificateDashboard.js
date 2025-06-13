import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  InputAdornment,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  CircularProgress,
  Chip,
  IconButton,
} from "@mui/material";
import {
  Search as SearchIcon,
  Visibility as VisibilityIcon,
  Block as BlockIcon,
  Refresh as RefreshIcon,
} from "@mui/icons-material";
import axios from "../api/axios";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
export default function CertificateDashboard() {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const navigate = useNavigate();
  const userRole = localStorage.getItem("role");
  const [open, setOpen] = React.useState(false);
  const [selectedCertificate, setSelectedCertificate] = useState(null);

  const handleClickOpen = (certificate) => {
    setSelectedCertificate(certificate);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedCertificate(null);
  };
  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/admin/cert/getAllCertificate", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      const mockData = [
        {
          id: 1,
          name: "Web Development Fundamentals",
          recipient: "John Doe",
          issueDate: "2023-05-15",
          expiryDate: "2024-05-15",
          status: "active",
          certificateId: "CERT-001",
        },
        {
          id: 2,
          name: "Advanced JavaScript",
          recipient: "Jane Smith",
          issueDate: "2023-06-20",
          expiryDate: "2024-06-20",
          status: "active",
          certificateId: "CERT-002",
        },
        {
          id: 3,
          name: "React Masterclass",
          recipient: "Alice Johnson",
          issueDate: "2023-03-10",
          expiryDate: "2023-09-10",
          status: "expired",
          certificateId: "CERT-003",
        },
        {
          id: 4,
          name: "Node.js Backend Development",
          recipient: "Bob Williams",
          issueDate: "2023-07-01",
          expiryDate: "2024-07-01",
          status: "active",
          certificateId: "CERT-004",
        },
        {
          id: 5,
          name: "UI/UX Design Principles",
          recipient: "Charlie Brown",
          issueDate: "2023-01-15",
          expiryDate: "2023-07-15",
          status: "expired",
          certificateId: "CERT-005",
        },
      ];
      setCertificates(response?.data?.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching certificates:", error);
      setLoading(false);
    }
  };

  const handleViewCertificate = (id) => {
    navigate(`/certificate/${id}`);
  };

  const handleRevokeCertificate = (id) => {
    alert(`Certificate ${id} would be revoked in a real application`);
  };

  const handleRefresh = () => {
    fetchCertificates();
  };

  return (
    <>
      <Container maxWidth="xxl">
        <div className="row gy-3 mb-4">
          <div className="col-md-4">
            <Card sx={{ bgcolor: "#e3f2fd" }}>
              <CardContent>
                <Typography color="text.secondary" gutterBottom>
                  Total Certificates
                </Typography>
                <Typography variant="h4" color="primary">
                  {certificates.length}
                </Typography>
              </CardContent>
            </Card>
          </div>

          <div className="col-md-4">
            <Card sx={{ bgcolor: "#e8f5e9" }}>
              <CardContent>
                <Typography color="text.secondary" gutterBottom>
                  Active Certificates
                </Typography>
                <Typography variant="h4" color="success.main">
                  {certificates.filter((c) => c.status === "active").length}
                </Typography>
              </CardContent>
            </Card>
          </div>

          <div className="col-md-4">
            <Card sx={{ bgcolor: "#ffebee" }}>
              <CardContent>
                <Typography color="text.secondary" gutterBottom>
                  Expired Certificates
                </Typography>
                <Typography variant="h4" color="error.main">
                  {certificates.filter((c) => c.status === "expired").length}
                </Typography>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Search and Filter */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              gap: 2,
              mb: 3,
            }}
          >
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search certificates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                minWidth: 200,
              }}
            >
              <Typography variant="body1">Filter:</Typography>
              <Select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                size="small"
                fullWidth
              >
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="expired">Expired</MenuItem>
              </Select>
            </Box>
            <IconButton onClick={handleRefresh}>
              <RefreshIcon />
            </IconButton>
          </Box>

          {/* Table */}
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Certificate ID</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Recipient</TableCell>
                    {userRole === "superAdmin" && (
                      <TableCell>Recipient Location</TableCell>
                    )}
                    <TableCell>Issue Date</TableCell>
                    <TableCell>Expiry Date</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {certificates.length > 0 ? (
                    certificates.map((cert) => (
                      <TableRow key={cert.id} hover>
                        <TableCell>{cert?.certificateNumber}</TableCell>
                        <TableCell>{cert?.certificateName}</TableCell>
                        <TableCell>{cert?.email}</TableCell>
                        {userRole === "superAdmin" && (
                          <TableCell>{cert?.locationName}</TableCell>
                        )}
                        <TableCell>
                          {new Date(cert?.issueDate).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          {new Date(cert?.validUntil).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          {/* <Chip
                          label={
                            cert.status.charAt(0).toUpperCase() +
                            cert.status.slice(1)
                          }
                          color={cert.status === "active" ? "success" : "error"}
                          size="small"
                        /> */}
                        </TableCell>
                        <TableCell align="right">
                          <IconButton
                            onClick={() => handleClickOpen(cert)}
                            color="primary"
                            aria-label="view"
                          >
                            <VisibilityIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} align="center">
                        <Typography
                          variant="body1"
                          color="text.secondary"
                          py={2}
                        >
                          No certificates found matching your criteria
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>
      </Container>

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <img
              src={selectedCertificate?.certificateUrl}
              alt="Certificate"
              style={{
                maxWidth: "100%",
                height: "auto",
                border: "1px solid #ddd",
                borderRadius: "4px",
              }}
            />
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleClose}
            autoFocus
            variant="contained"
            color="error"
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
