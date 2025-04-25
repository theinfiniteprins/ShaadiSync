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
  TextField,
  InputAdornment,
  CircularProgress,
  Switch,
  Alert,
  Snackbar,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button
} from '@mui/material';
import { FaSearch, FaUsers, FaMapMarkerAlt, FaPhoneAlt, FaPaintBrush, FaTrash } from 'react-icons/fa';
//import { DeleteIcon } from '@mui/icons-material';
//import IconButton from '@mui/material/IconButton';
import axios from 'axios';
import config from "../../configs/config";

export default function AllArtists() {
  const [artists, setArtists] = useState([]);
  const [artistTypes, setArtistTypes] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArtistType, setSelectedArtistType] = useState('all');
  const [selectedBlockStatus, setSelectedBlockStatus] = useState('all');
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    artistId: null
  });

  const fetchAllArtistTypes = async () => {
    try {
      const response = await axios.get(`${config.baseUrl}/api/artist-types`);
      // console.log('Artist Types API Response:', response.data);
      
      if (response.status === 200) {
        const types = response.data.reduce((acc, artistType) => ({
          ...acc,
          [artistType._id]: artistType.type
        }), {});
        
        // console.log('Processed Artist Types:', types);
        setArtistTypes(types);
      }
    } catch (error) {
      console.error('Error fetching artist types:', error);
    }
  };

  const fetchArtists = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${config.baseUrl}/api/artists`);
      // console.log('Artists API Response:', response.data);
      
      if (response.status === 200) {
        const artistsData = response.data.data || response.data;
        setArtists(artistsData);
        setError(null);
      } else {
        throw new Error('Failed to fetch artists');
      }
    } catch (error) {
      console.error('Error fetching artists:', error);
      setError(error.response?.data?.message || 'Failed to load artists. Please try again later.');
      setSnackbar({
        open: true,
        message: error.response?.data?.message || 'Failed to load artists',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const initializeData = async () => {
      await fetchAllArtistTypes();
      await fetchArtists();
    };
    initializeData();
  }, []);

  const handleBlockToggle = async (artistId, currentStatus) => {
    try {
      const endpoint = currentStatus ? 'unblock' : 'block';
      const response = await axios.put(`${config.baseUrl}/api/artists/${artistId}/${endpoint}`);
      
      if (response.status === 200) {
        setSnackbar({
          open: true,
          message: `Artist successfully ${currentStatus ? 'unblocked' : 'blocked'}`,
          severity: 'success'
        });

        // Update the specific artist's isBlocked status in the state
        setArtists((prevArtists) =>
          prevArtists.map((artist) =>
            artist._id === artistId ? { ...artist, isBlocked: !currentStatus } : artist
          )
        );
      }
    } catch (error) {
      console.error(`Error ${currentStatus ? 'unblocking' : 'blocking'} artist:`, error);
      setSnackbar({
        open: true,
        message: `Failed to ${currentStatus ? 'unblock' : 'block'} artist`,
        severity: 'error'
      });
    }
  };

  const handleDeleteArtist = async (artistId) => {
    try {
      const response = await axios.delete(`${config.baseUrl}/api/artists/${artistId}`);
      
      if (response.status === 200 || response.status === 204) {
        setSnackbar({
          open: true,
          message: 'Artist successfully deleted',
          severity: 'success'
        });

        // Remove the deleted artist from the state
        setArtists((prevArtists) => prevArtists.filter((artist) => artist._id !== artistId));
      } else {
        throw new Error('Failed to delete artist');
      }
    } catch (error) {
      console.error('Error deleting artist:', error);
      setSnackbar({
        open: true,
        message: error.response?.data?.message || 'Failed to delete artist',
        severity: 'error'
      });
    }
  };

  const handleDeleteClick = (artistId) => {
    setDeleteDialog({
      open: true,
      artistId: artistId
    });
  };

  const handleDeleteCancel = () => {
    setDeleteDialog({
      open: false,
      artistId: null
    });
  };

  const handleDeleteConfirm = async () => {
    if (deleteDialog.artistId) {
      await handleDeleteArtist(deleteDialog.artistId);
      handleDeleteCancel(); // Close the dialog
    }
  };

  const filteredArtists = artists.filter(artist => {
    const searchLower = searchQuery.toLowerCase();
    
    const nameMatch = artist.name?.toLowerCase().includes(searchLower);
    const emailMatch = artist.email?.toLowerCase().includes(searchLower);
    
    const artistTypeMatch = artist.artistType?.type?.toLowerCase().includes(searchLower);
    
    const mobileMatch = artist.mobileNumber?.toString().includes(searchQuery);
    
    const addressMatch = artist.address?.toLowerCase().includes(searchLower);

    const typeMatch = 
      selectedArtistType === 'all' || 
      artist.artistType?.type === selectedArtistType;

    const blockMatch = 
      selectedBlockStatus === 'all' || 
      (selectedBlockStatus === 'blocked' ? artist.isBlocked : !artist.isBlocked);

    return (nameMatch || emailMatch || artistTypeMatch || mobileMatch || addressMatch) 
      && typeMatch 
      && blockMatch;
  });

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const highlightText = (text, query) => {
    if (!query) return text;
  
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return parts.map((part, index) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <span
          key={index}
          style={{
            backgroundColor: '#ffeb3b', // Light yellow background
            fontWeight: 'bold',
            color: '#000', // Black text for contrast
          }}
        >
          {part}
        </span>
      ) : (
        part
      )
    );
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
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 600, color: '#2C3E50' }}>
          Artists Management
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
            Total Artists: {filteredArtists.length}
          </Typography>
        </Card>
      </Box>

      <Card sx={{ mb: 3, p: 2, boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <TextField
            sx={{ flex: 2, backgroundColor: 'white' }}
            variant="outlined"
            placeholder="Search by name, email, artist type, mobile number or address..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <FaSearch color="#666" />
                </InputAdornment>
              ),
            }}
          />

          <FormControl sx={{ minWidth: 200, flex: 1 }}>
            <InputLabel>Artist Type</InputLabel>
            <Select
              value={selectedArtistType}
              onChange={(e) => setSelectedArtistType(e.target.value)}
              label="Artist Type"
            >
              <MenuItem value="all">All Types</MenuItem>
              <MenuItem value="Nail Artist">Nail Artist</MenuItem>
              <MenuItem value="Mahendi Artist">Mahendi Artist</MenuItem>
              <MenuItem value="Photographer">Photographer</MenuItem>
              <MenuItem value="Panditji">Panditji</MenuItem>
              <MenuItem value="Makeup">Makeup</MenuItem>
              <MenuItem value="Djs">DJs</MenuItem>
              <MenuItem value="Decorators">Decorators</MenuItem>
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: 200, flex: 1 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={selectedBlockStatus}
              onChange={(e) => setSelectedBlockStatus(e.target.value)}
              label="Status"
            >
              <MenuItem value="all">All Status</MenuItem>
              <MenuItem value="active">Active Artists</MenuItem>
              <MenuItem value="blocked">Blocked Artists</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Card>

      <Card sx={{ boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f8f9fa' }}>
                <TableCell sx={{ fontWeight: 'bold' }}>Artist Details</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Artist Type</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Contact Info</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Address</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>is Blocked</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredArtists.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                    <Typography variant="subtitle1" color="textSecondary">
                      {searchQuery ? `No artists found matching "${searchQuery}"` : 'No artists available'}
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredArtists
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((artist) => (
                    <TableRow key={artist._id}>
                      {/* Artist Details */}
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Avatar
                            src={artist.profilePic}
                            sx={{
                              width: 50,
                              height: 50,
                              mr: 2,
                              bgcolor: '#3498db',
                            }}
                          >
                            {artist.name?.charAt(0)}
                          </Avatar>
                          <Box>
                            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                              {highlightText(artist.name || 'N/A', searchQuery)}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                              {highlightText(artist.email || 'No email', searchQuery)}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>

                      {/* Artist Type */}
                      <TableCell>
                        <Chip
                          label={highlightText(artist.artistType?.type || 'No Type Assigned', searchQuery)}
                          color="primary"
                          sx={{
                            backgroundColor: searchQuery && artist.artistType?.type?.toLowerCase().includes(searchQuery.toLowerCase())
                              ? '#fff3cd'
                              : '#3498db',
                            fontWeight: 500,
                          }}
                        />
                      </TableCell>

                      {/* Mobile Number */}
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <FaPhoneAlt color="#666" />
                          <Typography>
                            {highlightText(artist.mobileNumber?.toString() || 'No number', searchQuery)}
                          </Typography>
                        </Box>
                      </TableCell>

                      {/* Address */}
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <FaMapMarkerAlt color="#666" />
                          <Typography>
                            {highlightText(artist.address || 'No address provided', searchQuery)}
                          </Typography>
                        </Box>
                      </TableCell>

                      {/* Block/Unblock Toggle */}
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Switch
                            checked={artist.isBlocked}
                            onChange={() => handleBlockToggle(artist._id, artist.isBlocked)}
                            color="primary"
                          />
                          <Typography sx={{ fontWeight: 600 }}>
                            {artist.isBlocked ? 'Block' : 'Unblock'}
                          </Typography>
                        </Box>
                      </TableCell>

                      {/* Actions */}
                      <TableCell>
                        <IconButton
                          onClick={() => handleDeleteClick(artist._id)}
                          color="error"
                          size="small"
                          title="Delete Artist"
                        >
                          <FaTrash />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredArtists.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          sx={{
            borderTop: '1px solid #eee',
            backgroundColor: '#fff'
          }}
        />
      </Card>

      <Dialog
        open={deleteDialog.open}
        onClose={handleDeleteCancel}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Confirm Delete"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this artist? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}