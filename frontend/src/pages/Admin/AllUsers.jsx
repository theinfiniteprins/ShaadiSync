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
  Snackbar,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { FaSearch, FaUsers, FaMapMarkerAlt, FaPhoneAlt, FaTrash } from 'react-icons/fa';
import axios from 'axios';
import config from "../../configs/config";

// Helper function to highlight search matches
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

export default function AllUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    userId: null
  });
  const [blockFilter, setBlockFilter] = useState('all');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token'); // Assuming the token is stored in localStorage
      const response = await fetch(`${config.baseUrl}/api/users/`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
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
  
        // Update the specific user's isBlocked status in the state
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user._id === userId ? { ...user, isBlocked: !currentStatus } : user
          )
        );
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

  const handleDeleteClick = (userId) => {
    setDeleteDialog({
      open: true,
      userId: userId
    });
  };

  const handleDeleteCancel = () => {
    setDeleteDialog({
      open: false,
      userId: null
    });
  };

  const handleDeleteConfirm = async () => {
    if (deleteDialog.userId) {
      await handleDeleteUser(deleteDialog.userId);
      handleDeleteCancel(); // Close the dialog
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      const response = await axios.delete(`${config.baseUrl}/api/users/${userId}`);
      
      if (response.status === 200) {
        setSnackbar({
          open: true,
          message: 'User successfully deleted',
          severity: 'success'
        });

        // Remove the deleted user from the state
        setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userId));
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      setSnackbar({
        open: true,
        message: error.response?.data?.message || 'Failed to delete user',
        severity: 'error'
      });
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = (
      (user?.name?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
      (user?.email?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
      (user?.mobileNumber?.toString() || '').includes(searchQuery) ||
      (user?.address?.toLowerCase() || '').includes(searchQuery.toLowerCase())
    );

    const matchesBlockStatus = 
      blockFilter === 'all' ? true :
      blockFilter === 'blocked' ? user.isBlocked :
      blockFilter === 'active' ? !user.isBlocked :
      true;

    return matchesSearch && matchesBlockStatus;
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

  const handleBlockFilterChange = (event) => {
    setBlockFilter(event.target.value);
    setPage(0);
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
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={8}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search by name, email, mobile number or address..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FaSearch color="#666" />
                  </InputAdornment>
                ),
              }}
              sx={{ backgroundColor: 'white' }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth variant="outlined" sx={{ backgroundColor: 'white' }}>
              <InputLabel>User Status</InputLabel>
              <Select
                value={blockFilter}
                onChange={handleBlockFilterChange}
                label="User Status"
              >
                <MenuItem value="all">All Status</MenuItem>
                <MenuItem value="active">Active Users</MenuItem>
                <MenuItem value="blocked">Blocked Users</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Card>

      {/* Users Table */}
      <Card sx={{ boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f8f9fa' }}>
                <TableCell sx={{ fontWeight: 'bold', width: '25%' }}>User Details</TableCell>
                <TableCell sx={{ fontWeight: 'bold', width: '20%' }}>Mobile Number</TableCell>
                <TableCell sx={{ fontWeight: 'bold', width: '25%' }}>Address</TableCell>
                <TableCell sx={{ fontWeight: 'bold', width: '15%' }}>is Blocked</TableCell>
                <TableCell sx={{ fontWeight: 'bold', width: '15%' }}>Actions</TableCell>
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
                              {highlightText(user.name || '', searchQuery)}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                              {highlightText(user.email || '', searchQuery)}
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
                            {highlightText(user.mobileNumber.toString(), searchQuery)}
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
                            {highlightText(user.address || 'No address provided', searchQuery)}
                          </Typography>
                        </Box>
                      </TableCell>

                      {/* Block/Unblock Toggle */}
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Switch
                            checked={user.isBlocked}
                            onChange={() => handleBlockToggle(user._id, user.isBlocked)}
                            color="primary"
                          />
                          <Typography color={user.isBlocked ? "error" : "success"}>
                            {user.isBlocked ? "Blocked" : "Unblocked"}
                          </Typography>
                        </Box>
                      </TableCell>

                      {/* Delete Button */}
                      <TableCell>
                        <IconButton
                          onClick={() => handleDeleteClick(user._id)}
                          color="error"
                          size="small"
                          title="Delete User"
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

      {/* Add the confirmation dialog */}
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
            Are you sure you want to delete this user? This action cannot be undone.
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