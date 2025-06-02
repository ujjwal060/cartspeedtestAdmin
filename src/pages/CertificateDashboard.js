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

export default function CertificateDashboard() {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const navigate = useNavigate();

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    try {
      setLoading(true);
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
      setCertificates(mockData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching certificates:", error);
      setLoading(false);
    }
  };

  const filteredCertificates = certificates.filter((cert) => {
    const matchesSearch =
      cert.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cert.recipient.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cert.certificateId.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter = filter === "all" || cert.status === filter;

    return matchesSearch && matchesFilter;
  });

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
    <Container maxWidth="xl" sx={{ py: 4 }}>
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
                  <TableCell>Issue Date</TableCell>
                  <TableCell>Expiry Date</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredCertificates.length > 0 ? (
                  filteredCertificates.map((cert) => (
                    <TableRow key={cert.id} hover>
                      <TableCell>{cert.certificateId}</TableCell>
                      <TableCell>{cert.name}</TableCell>
                      <TableCell>{cert.recipient}</TableCell>
                      <TableCell>{cert.issueDate}</TableCell>
                      <TableCell>{cert.expiryDate}</TableCell>
                      <TableCell>
                        <Chip
                          label={
                            cert.status.charAt(0).toUpperCase() +
                            cert.status.slice(1)
                          }
                          color={cert.status === "active" ? "success" : "error"}
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="right">
                        <IconButton
                          onClick={() => handleViewCertificate(cert.id)}
                          color="primary"
                          aria-label="view"
                        >
                          <VisibilityIcon />
                        </IconButton>
                        <IconButton
                          onClick={() => handleRevokeCertificate(cert.id)}
                          color="error"
                          aria-label="revoke"
                        >
                          <BlockIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      <Typography variant="body1" color="text.secondary" py={2}>
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
  );
}
