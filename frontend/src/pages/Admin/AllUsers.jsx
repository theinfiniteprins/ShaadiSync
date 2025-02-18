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
  Grid,
  Alert,
  Snackbar
} from '@mui/material';
import { FaSearch, FaUsers, FaMapMarkerAlt, FaPhoneAlt } from 'react-icons/fa';
import axios from 'axios';
import config from "../../configs/config";

export default function AllUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${config.baseUrl}/api/users/`);
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      const data = await response.json();
      setUsers(data);
      setError(null);
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Failed to load users. Please try again later.');
      setSnackbar({
        open: true,
        message: 'Failed to load users',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBlockToggle = async (userId, currentStatus) => {
    try {
      const endpoint = currentStatus ? 'unblock' : 'block';
      const response = await axios.put(`${config.baseUrl}/api/users/${userId}/${endpoint}`);
      
      if (response.status === 200) {
        setSnackbar({
          open: true,
          message: `User successfully ${currentStatus ? 'unblocked' : 'blocked'}`,
          severity: 'success'
        });
        fetchUsers(); // Refresh the list
      }
    } catch (error) {
      console.error(`Error ${currentStatus ? 'unblocking' : 'blocking'} user:`, error);
      setSnackbar({
        open: true,
        message: `Failed to ${currentStatus ? 'unblock' : 'block'} user`,
        severity: 'error'
      });
    }
  };

  // Safe filter function with null checks
  const filteredUsers = users.filter(user =>
    (user?.name?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
    (user?.email?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
    (user?.mobileNumber?.toString() || '').includes(searchQuery) ||
    (user?.address?.toLowerCase() || '').includes(searchQuery.toLowerCase())
  );

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

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1, p: 3, backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Snackbar for notifications */}
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

      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 600, color: '#2C3E50' }}>
          Users Management
        </Typography>
        <Card sx={{ 
          p: 2, 
          display: 'flex', 
          alignItems: 'center', 
          gap: 2,
          backgroundColor: '#3498db',
          color: 'white'
        }}>
          <FaUsers size={24} />
          <Typography variant="h6">
            Total Users: {users.length}
          </Typography>
        </Card>
      </Box>

      {/* Updated Search Bar with helper text */}
      <Card sx={{ mb: 3, p: 2, boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search by name, email, mobile number or address..."
          helperText="You can search by any user detail including mobile number and address"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <FaSearch color="#666" />
              </InputAdornment>
            ),
          }}
          sx={{ 
            backgroundColor: 'white',
            '& .MuiFormHelperText-root': {
              margin: '4px 0 0 0',
              fontSize: '0.75rem',
              color: '#666'
            }
          }}
        />
      </Card>

      {/* Users Table */}
      <Card sx={{ boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f8f9fa' }}>
                <TableCell sx={{ fontWeight: 'bold', width: '30%' }}>
                  User Details
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold', width: '20%' }}>
                  Mobile Number
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold', width: '30%' }}>
                  Address
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold', width: '20%' }}>
                  Status
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ py: 3 }}>
                    <Typography variant="subtitle1" color="textSecondary">
                      {searchQuery ? `No users found matching "${searchQuery}"` : 'No users available'}
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((user) => (
                    <TableRow 
                      key={user._id}
                      sx={{ 
                        '&:hover': { 
                          backgroundColor: '#f8f9fa',
                          transition: 'background-color 0.2s'
                        }
                      }}
                    >
                      {/* User Profile */}
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Avatar 
                            src={user.profilePic} 
                            sx={{ 
                              width: 50, 
                              height: 50, 
                              mr: 2,
                              bgcolor: '#3498db'
                            }}
                          >
                            {user.name?.charAt(0)}
                          </Avatar>
                          <Box>
                            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                              {user.name}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                              {user.email}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>

                      {/* Mobile Number - Highlighted if it matches search */}
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <FaPhoneAlt color="#666" />
                          <Typography sx={{
                            backgroundColor: searchQuery && user.mobileNumber?.toString().includes(searchQuery) 
                              ? '#fff3cd' 
                              : 'transparent',
                            padding: '2px 4px',
                            borderRadius: '4px'
                          }}>
                            {user.mobileNumber}
                          </Typography>
                        </Box>
                      </TableCell>

                      {/* Address - Highlighted if it matches search */}
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <FaMapMarkerAlt color="#666" />
                          <Typography sx={{
                            backgroundColor: searchQuery && user.address?.toLowerCase().includes(searchQuery.toLowerCase()) 
                              ? '#fff3cd' 
                              : 'transparent',
                            padding: '2px 4px',
                            borderRadius: '4px'
                          }}>
                            {user.address || 'No address provided'}
                          </Typography>
                        </Box>
                      </TableCell>

                      {/* Block/Unblock Toggle */}
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Switch
                            checked={!user.isBlocked}
                            onChange={() => handleBlockToggle(user._id, user.isBlocked)}
                            color="primary"
                          />
                          <Typography color={user.isBlocked ? "error" : "success"}>
                            {user.isBlocked ? "Blocked" : "Active"}
                          </Typography>
                        </Box>
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
          count={filteredUsers.length}
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
    </Box>
  );
}