import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  Alert,
  Snackbar,
  CircularProgress,
  Chip,
  TextField,
  InputAdornment,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider
} from '@mui/material';
import { FaSearch, FaTools } from 'react-icons/fa';
import axios from 'axios';
import config from '../../configs/config';

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

const AllServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [artistTypes, setArtistTypes] = useState([]);
  const [selectedArtistType, setSelectedArtistType] = useState('all');
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [maxPrice, setMaxPrice] = useState(100000);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info'
  });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Get token from localStorage
  const token = localStorage.getItem('token');

  // Configure axios headers with token
  const axiosConfig = {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  };

  // Fetch artist types
  const fetchArtistTypes = async () => {
    try {
      const response = await axios.get(
        `${config.baseUrl}/api/artist-types`,
        axiosConfig
      );
      setArtistTypes(response.data);
    } catch (error) {
      console.error('Error fetching artist types:', error);
    }
  };

  // Filter services based on search and filters
  const filteredServices = services.filter(service => {
    const matchesSearch = 
      service.artistName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.name.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesArtistType = 
      selectedArtistType === 'all' || 
      service.artistType === selectedArtistType;

    const matchesPriceRange = 
      service.price >= priceRange[0] && 
      service.price <= priceRange[1];

    return matchesSearch && matchesArtistType && matchesPriceRange;
  });

  // Fetch service details including artist name and type
  const fetchServiceDetails = async (service) => {
    try {
      if (!service || !service.artistId) {
        throw new Error('Artist ID is missing');
      }

      // Add token to requests
      const artistResponse = await axios.get(
        `${config.baseUrl}/api/artists/${service.artistId._id}`,
        axiosConfig
      );
      const artist = artistResponse.data;

      if (!artist || !artist.artistType) {
        throw new Error('Invalid artist data received');
      }

      const artistTypeResponse = await axios.get(
        `${config.baseUrl}/api/artist-types/${artist.artistType._id}`,
        axiosConfig
      );
      const artistTypeData = artistTypeResponse.data;

      if (!artistTypeData || !artistTypeData.type) {
        throw new Error('Invalid artist type data received');
      }

      return {
        ...service,
        artistName: artist.name || 'N/A',
        artistType: artistTypeData.type || 'N/A'
      };
    } catch (error) {
      console.error(`Error fetching details for service ${service._id}:`, error);
      if (error.response?.status === 401) {
        // Handle unauthorized access
        window.location.href = '/login'; // Redirect to login page
        return;
      }
      return {
        ...service,
        artistName: 'Error loading name',
        artistType: 'Error loading type'
      };
    }
  };

  const fetchAllServices = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get(
        `${config.baseUrl}/api/services`,
        axiosConfig
      );
      
      if (!response.data || !Array.isArray(response.data)) {
        throw new Error('Invalid services data received');
      }

      const servicesWithDetails = await Promise.all(
        response.data.map(service => 
          fetchServiceDetails(service)
        )
      );

      setServices(servicesWithDetails);
    } catch (error) {
      console.error('Error fetching services:', error);
      if (error.response?.status === 401) {
        window.location.href = '/login';
        return;
      }
      setError(error.message || 'Failed to fetch services');
      setSnackbar({
        open: true,
        message: 'Failed to load services',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  useEffect(() => {
    if (!token) {
      window.location.href = '/login';
      return;
    }
    fetchAllServices();
    fetchArtistTypes();
  }, []);

  // Update max price when services are loaded
  useEffect(() => {
    if (services.length > 0) {
      const highestPrice = Math.max(...services.map(service => service.price));
      setMaxPrice(highestPrice);
      setPriceRange([0, highestPrice]);
    }
  }, [services]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Box sx={{ p: 3, backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      {/* Header Card */}
      <Card sx={{ 
        mb: 3, 
        p: 2,
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        backgroundColor: '#fff'
      }}>
        <Grid container alignItems="center" justifyContent="space-between">
          {/* Left side - Title */}
          <Grid item>
            <Typography variant="h4" sx={{ 
              fontWeight: 700, 
              color: '#2C3E50',
              letterSpacing: '0.5px'
            }}>
              Service Management
            </Typography>
          </Grid>

          {/* Right side - Icon and Count */}
          <Grid item>
            <Box sx={{ 
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#3498db',
              borderRadius: '10px',
              padding: '15px 20px',
              color: 'white'
            }}>
              <FaTools size={28} style={{ marginRight: '12px' }} />
              <Box>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Total Services
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                  {filteredServices.length}
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Card>

      {/* Filters Card */}
      <Card sx={{ mb: 3, p: 2, boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
        <Grid container spacing={2}>
          {/* Search Field */}
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              placeholder="Search by artist or service name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FaSearch />
                  </InputAdornment>
                ),
              }}
              variant="outlined"
              size="small"
            />
          </Grid>

          {/* Artist Type Filter */}
          <Grid item xs={12} md={4}>
            <FormControl fullWidth size="small">
              <InputLabel>Artist Type</InputLabel>
              <Select
                value={selectedArtistType}
                onChange={(e) => setSelectedArtistType(e.target.value)}
                label="Artist Type"
              >
                <MenuItem value="all">All Types</MenuItem>
                {artistTypes.map((type) => (
                  <MenuItem key={type._id} value={type.type}>
                    {type.type}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Price Range Filter */}
          <Grid item xs={12} md={4}>
            <Typography variant="body2" color="textSecondary" gutterBottom>
              Price Range: ₹{priceRange[0]} - ₹{priceRange[1]}
            </Typography>
            <Slider
              value={priceRange}
              onChange={(e, newValue) => setPriceRange(newValue)}
              valueLabelDisplay="auto"
              min={0}
              max={maxPrice}
              sx={{ mt: 1 }}
            />
          </Grid>
        </Grid>
      </Card>

      {/* Table Card */}
      <Card sx={{ boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#f8f9fa' }}>
                    <TableCell sx={{ fontWeight: 600 }}>Artist Name</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Service Name</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Artist Type</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Price (₹)</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredServices
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((service) => (
                      <TableRow 
                        key={service._id}
                        sx={{ '&:hover': { backgroundColor: '#f5f5f5' } }}
                      >
                        {/* Artist Name */}
                        <TableCell>
                          {highlightText(service.artistName || 'N/A', searchQuery)}
                        </TableCell>

                        {/* Service Name */}
                        <TableCell>
                          {highlightText(service.name || 'N/A', searchQuery)}
                        </TableCell>

                        {/* Artist Type */}
                        <TableCell>
                          <Chip
                            label={highlightText(service.artistType || 'N/A', searchQuery)}
                            size="small"
                            sx={{ backgroundColor: '#e1f5fe', color: '#0288d1' }}
                          />
                        </TableCell>

                        {/* Price */}
                        <TableCell>
                          ₹{service.price.toLocaleString('en-IN')}
                        </TableCell>

                        {/* Status */}
                        <TableCell>
                          <Chip
                            label={service.isLive ? 'Live' : 'Not Live'}
                            color={service.isLive ? 'success' : 'error'}
                            size="small"
                            sx={{
                              fontWeight: 500,
                              minWidth: 90,
                              '& .MuiChip-label': {
                                color: 'white',
                              },
                            }}
                          />
                        </TableCell>
                      </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={filteredServices.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              sx={{
                borderTop: '1px solid #eee',
                backgroundColor: '#fff'
              }}
            />
          </>
        )}
      </Card>

      {/* Error Handling */}
      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AllServices;
