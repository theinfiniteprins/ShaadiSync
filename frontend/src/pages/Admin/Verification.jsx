import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Typography,
  Paper,
  Avatar,
  CircularProgress,
  Alert,
  Snackbar,
  Chip,
  Collapse,
  Button,
  Grid,
  Divider
} from '@mui/material';
import { 
  FaPaintBrush, 
  FaPhoneAlt, 
  FaMapMarkerAlt, 
  FaChevronDown, 
  FaChevronUp,
  FaCheckCircle,
  FaTimesCircle,
  FaIdCard,
  FaUniversity
} from 'react-icons/fa';
import axios from 'axios';
import config from "../../configs/config";

export default function Verification() {
  const [pendingArtists, setPendingArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [expandedRow, setExpandedRow] = useState(null);

  // Fetch pending verification artists
  const fetchPendingArtists = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token'); // Get admin token

      const response = await axios.get(
        `${config.baseUrl}/api/artists/pending-verifications`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      setPendingArtists(response.data.artists);
      setError(null);
    } catch (error) {
      console.error('Error fetching pending artists:', error);
      setError('Failed to load pending verifications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingArtists();
  }, []);

  const handleVerificationAction = async (artistId, action) => {
    try {
      const token = localStorage.getItem('token'); // Get admin token

      const response = await axios.put(
        `${config.baseUrl}/api/artists/verify/${artistId}`,
        { status: action },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.status === 200) {
        setSnackbar({
          open: true,
          message: `Artist successfully ${action === 'approved' ? 'verified' : 'rejected'}`,
          severity: 'success'
        });
        fetchPendingArtists(); // Refresh the list
        setExpandedRow(null); // Close the expanded row
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.response?.data?.error || `Failed to ${action} artist verification`,
        severity: 'error'
      });
    }
  };

  const handleRowClick = (artistId) => {
    setExpandedRow(expandedRow === artistId ? null : artistId);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1, p: 3, backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 600, color: '#2C3E50' }}>
          Pending Verifications
        </Typography>
        <Card sx={{ 
          p: 2, 
          display: 'flex', 
          alignItems: 'center', 
          gap: 2,
          backgroundColor: '#3498db',
          color: 'white'
        }}>
          <FaPaintBrush size={24} />
          <Typography variant="h6">
            Pending: {pendingArtists.length}
          </Typography>
        </Card>
      </Box>

      <Card sx={{ boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f8f9fa' }}>
                <TableCell sx={{ fontWeight: 'bold' }}>Artist Details</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Artist Type</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Contact Info</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Address</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {pendingArtists
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((artist) => (
                  <React.Fragment key={artist._id}>
                    <TableRow 
                      onClick={() => handleRowClick(artist._id)}
                      sx={{ cursor: 'pointer', '&:hover': { backgroundColor: '#f5f5f5' } }}
                    >
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Avatar src={artist.profilePic} sx={{ width: 50, height: 50, mr: 2 }}>
                            {artist.name?.charAt(0)}
                          </Avatar>
                          <Box>
                            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                              {artist.name}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                              {artist.email}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={artist.artistType?.type || 'Not Specified'}
                          color="primary"
                        />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <FaPhoneAlt />
                          <Typography>{artist.mobileNumber}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <FaMapMarkerAlt />
                          <Typography>{artist.address || 'Not provided'}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          {expandedRow === artist._id ? <FaChevronUp /> : <FaChevronDown />}
                          <Chip 
                            label="Pending"
                            color="warning"
                          />
                        </Box>
                      </TableCell>
                    </TableRow>
                    
                    {/* Expanded Details */}
                    <TableRow>
                      <TableCell colSpan={5} style={{ paddingBottom: 0, paddingTop: 0 }}>
                        <Collapse in={expandedRow === artist._id} timeout="auto" unmountOnExit>
                          <Box sx={{ margin: 2 }}>
                            <Typography variant="h6" gutterBottom component="div">
                              Verification Details
                            </Typography>
                            <Grid container spacing={3}>
                              {/* Aadhar Details */}
                              <Grid item xs={12} md={6}>
                                <Card sx={{ p: 2 }}>
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                    <FaIdCard />
                                    <Typography variant="subtitle1">Aadhar Information</Typography>
                                  </Box>
                                  <Typography variant="body2">
                                    Number: {artist.aadharCardNumber}
                                  </Typography>
                                  <Box sx={{ mt: 2 }}>
                                    <Typography variant="body2" color="textSecondary">
                                      Document:
                                    </Typography>
                                    <a 
                                      href={artist.verificationDocuments?.aadharCardFile} 
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-blue-600 hover:underline"
                                    >
                                      View Document
                                    </a>
                                  </Box>
                                </Card>
                              </Grid>

                              {/* Bank Details */}
                              <Grid item xs={12} md={6}>
                                <Card sx={{ p: 2 }}>
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                    <FaUniversity />
                                    <Typography variant="subtitle1">Bank Information</Typography>
                                  </Box>
                                  <Typography variant="body2">
                                    Account: {artist.bankDetails?.accountNumber}
                                  </Typography>
                                  <Typography variant="body2">
                                    IFSC: {artist.bankDetails?.ifscCode}
                                  </Typography>
                                  <Box sx={{ mt: 2 }}>
                                    <Typography variant="body2" color="textSecondary">
                                      Document:
                                    </Typography>
                                    <a 
                                      href={artist.verificationDocuments?.bankDocument} 
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-blue-600 hover:underline"
                                    >
                                      View Document
                                    </a>
                                  </Box>
                                </Card>
                              </Grid>
                            </Grid>

                            <Divider sx={{ my: 2 }} />

                            {/* Action Buttons */}
                            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                              <Button
                                variant="contained"
                                color="error"
                                startIcon={<FaTimesCircle />}
                                onClick={() => handleVerificationAction(artist._id, 'rejected')}
                              >
                                Reject
                              </Button>
                              <Button
                                variant="contained"
                                color="success"
                                startIcon={<FaCheckCircle />}
                                onClick={() => handleVerificationAction(artist._id, 'approved')}
                              >
                                Approve
                              </Button>
                            </Box>
                          </Box>
                        </Collapse>
                      </TableCell>
                    </TableRow>
                  </React.Fragment>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={pendingArtists.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(event, newPage) => setPage(newPage)}
          onRowsPerPageChange={(event) => {
            setRowsPerPage(parseInt(event.target.value, 10));
            setPage(0);
          }}
        />
      </Card>
    </Box>
  );
}
