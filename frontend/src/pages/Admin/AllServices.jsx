import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Switch,
  Alert,
  Snackbar,
  CircularProgress
} from '@mui/material';
import axios from 'axios';
import config from '../../configs/config';

const AllServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info'
  });

  // Fetch service details including artist name and type
  const fetchServiceDetails = async (service) => {
    try {
      if (!service || !service.artist) {
        throw new Error('Artist ID is missing');
      }

      // Fetch artist details
      const artistResponse = await axios.get(`${config.baseUrl}/api/artists/${service.artistId}`);
      const artist = artistResponse.data;

      if (!artist || !artist.artistType) {
        throw new Error('Invalid artist data received');
      }

      // Fetch artist type details
      const artistTypeResponse = await axios.get(`${config.baseUrl}/api/artist-types/${artist.artistType}`);
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

      // Fetch all services
      const response = await axios.get(`${config.baseUrl}/api/services`);
      
      if (!response.data || !Array.isArray(response.data)) {
        throw new Error('Invalid services data received');
      }

      // Log the first service to check its structure
      if (response.data.length > 0) {
        console.log('First service data:', response.data[0]);
      }

      // Fetch additional details for each service
      const servicesWithDetails = await Promise.all(
        response.data.map(service => 
          fetchServiceDetails(service).catch(error => {
            console.error(`Failed to fetch details for service: ${service._id}`, error);
            return {
              ...service,
              artistName: 'Error loading name',
              artistType: 'Error loading type'
            };
          })
        )
      );

      setServices(servicesWithDetails);
      
      setSnackbar({
        open: true,
        message: 'Services loaded successfully',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error fetching services:', error);
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

  useEffect(() => {
    fetchAllServices();
  }, []);

  const handleLiveToggle = async (serviceId, currentStatus) => {
    try {
      if (!serviceId) {
        throw new Error('Service ID is missing');
      }

      await axios.patch(`${config.baseUrl}/api/services/${serviceId}`, {
        isLive: !currentStatus
      });

      // Update local state
      setServices(prevServices =>
        prevServices.map(service =>
          service._id === serviceId
            ? { ...service, isLive: !currentStatus }
            : service
        )
      );

      setSnackbar({
        open: true,
        message: `Service ${!currentStatus ? 'activated' : 'deactivated'} successfully`,
        severity: 'success'
      });
    } catch (error) {
      console.error('Error updating service status:', error);
      setSnackbar({
        open: true,
        message: error.message || 'Failed to update service status',
        severity: 'error'
      });
    }
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 600, color: '#2C3E50' }}>
        All Services
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
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

      <TableContainer component={Paper} sx={{ boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f8f9fa' }}>
              <TableCell sx={{ fontWeight: 'bold' }}>Artist Name</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Service Name</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Artist Type</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Price (₹)</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {services.map((service) => (
              <TableRow key={service._id}>
                <TableCell>{service.artistName}</TableCell>
                <TableCell>{service.name}</TableCell>
                <TableCell>{service.artistType}</TableCell>
                <TableCell>₹{service.price}</TableCell>
                <TableCell>
                  <Switch
                    checked={service.isLive}
                    onChange={() => handleLiveToggle(service._id, service.isLive)}
                    color="primary"
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default AllServices;
