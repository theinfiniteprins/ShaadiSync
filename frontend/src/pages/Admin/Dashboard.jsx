import React, { useState, useEffect } from 'react';
import { Box, Grid, Card, CardContent, Typography, Alert, Snackbar } from '@mui/material';
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { FaUsers, FaPaintBrush, FaTools, FaRupeeSign } from 'react-icons/fa';
import axios from 'axios';
import config from '../../configs/config';

const Dashboard = () => {
  const [statsData, setStatsData] = useState({
    totalUsers: 0,
    totalArtists: 0,
    totalServices: 0,
    totalEarnings: "₹0",
    userGrowthData: []
  });

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info'
  });

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all data in parallel with proper error handling
      const [
        usersResponse, 
        artistsResponse, 
        servicesResponse, 
        userTransactionsResponse,
        artistTransactionsResponse
      ] = await Promise.all([
        axios.get(`${config.baseUrl}/api/users`).catch(error => {
          throw new Error('Failed to fetch users data');
        }),
        axios.get(`${config.baseUrl}/api/artists`).catch(error => {
          throw new Error('Failed to fetch artists data');
        }),
        axios.get(`${config.baseUrl}/api/services`).catch(error => {
          throw new Error('Failed to fetch services data');
        }),
        axios.get(`${config.baseUrl}/api/user-transaction-history/getHistory`).catch(error => {
          throw new Error('Failed to fetch user transactions');
        }),
        axios.get(`${config.baseUrl}/api/artist-transactions/total-debited-amount/amount`).catch(error => {
          throw new Error('Failed to fetch artist transactions');
        })
      ]);

      // Validate responses
      if (!userTransactionsResponse.data || !Array.isArray(userTransactionsResponse.data)) {
        throw new Error('Invalid user transactions data received');
      }

      if (!artistTransactionsResponse.data || !artistTransactionsResponse.data.totalDebitedAmount) {
        throw new Error('Invalid artist transactions data received');
      }

      // Calculate total user debited amount with validation
      const userDebitedAmount = userTransactionsResponse.data
        .filter(transaction => transaction && transaction.transactionType === 'debit')
        .reduce((sum, transaction) => {
          const amount = parseFloat(transaction.amount);
          return sum + (isNaN(amount) ? 0 : amount);
        }, 0);

      // Get artist debited amount with validation
      const artistDebitedAmount = parseFloat(artistTransactionsResponse.data.totalDebitedAmount) || 0;
      if (isNaN(artistDebitedAmount)) {
        throw new Error('Invalid artist debited amount received');
      }

      // Calculate total earnings
      const totalEarnings = userDebitedAmount + artistDebitedAmount;

      // Format earnings with error handling
      let formattedEarnings;
      try {
        formattedEarnings = new Intl.NumberFormat('en-IN', {
          style: 'currency',
          currency: 'INR',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0
        }).format(totalEarnings);
      } catch (error) {
        console.error('Error formatting earnings:', error);
        formattedEarnings = `₹${totalEarnings.toFixed(0)}`;
      }

      // Process user growth data with validation
      const users = usersResponse.data;
      if (!Array.isArray(users)) {
        throw new Error('Invalid users data received');
      }

      const usersByMonth = users.reduce((acc, user) => {
        if (!user || !user.createdAt) return acc;
        
        try {
          const date = new Date(user.createdAt);
          if (isNaN(date.getTime())) return acc; // Skip invalid dates
          
          const monthYear = `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;
          acc[monthYear] = (acc[monthYear] || 0) + 1;
        } catch (error) {
          console.warn('Error processing user date:', error);
        }
        return acc;
      }, {});

      // Convert to array format for chart with sorting
      const userGrowthData = Object.entries(usersByMonth)
        .map(([month, count]) => ({
          month,
          users: count
        }))
        .sort((a, b) => {
          const dateA = new Date(a.month);
          const dateB = new Date(b.month);
          return dateA - dateB;
        });

      // Calculate cumulative users
      let cumulativeUsers = 0;
      const cumulativeGrowthData = userGrowthData.map(data => ({
        month: data.month,
        users: (cumulativeUsers += data.users)
      }));

      setStatsData({
        totalUsers: usersResponse.data.length || 0,
        totalArtists: artistsResponse.data.length || 0,
        totalServices: servicesResponse.data.length || 0,
        totalEarnings: formattedEarnings,
        userGrowthData: cumulativeGrowthData
      });

      setSnackbar({
        open: true,
        message: 'Dashboard data updated successfully',
        severity: 'success'
      });

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError(error.message || 'An error occurred while fetching dashboard data');
      setSnackbar({
        open: true,
        message: error.message || 'Failed to fetch dashboard data',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Handle snackbar close
  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>Loading dashboard data...</Typography>
      </Box>
    );
  }

  const serviceCategoryData = [
    { name: 'Photographer', value: 35 },
    { name: 'Mahendi', value: 25 },
    { name: 'DJ', value: 20 },
    { name: 'Pandit', value: 15 },
    { name: 'Decorator', value: 30 },
    { name: 'Makeup', value: 25 },
  ];

  const COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD', '#D4A5A5'];

  return (
    <Box sx={{ flexGrow: 1, p: 2, backgroundColor: '#f5f5f5' }}>
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

      <Typography variant="h4" sx={{ mb: 3, fontWeight: 600, color: '#2C3E50' }}>
        Dashboard Overview
      </Typography>

      {/* Stats Cards */}
      <Grid container spacing={2} mb={2}>
        {/* Users Card */}
        <Grid item xs={12} md={3}>
          <Card sx={{ 
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            transition: 'transform 0.2s',
            '&:hover': { transform: 'translateY(-5px)' }
          }}>
            <CardContent sx={{ p: 2.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box sx={{ 
                  backgroundColor: '#3498db',
                  borderRadius: '12px',
                  p: 1.5,
                  mr: 2 
                }}>
                  <FaUsers size={24} color="white" />
                </Box>
                <Typography variant="h6" color="textSecondary">
                  Total Users
                </Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 600 }}>
                {statsData.totalUsers}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Artists Card */}
        <Grid item xs={12} md={3}>
          <Card sx={{ 
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            transition: 'transform 0.2s',
            '&:hover': { transform: 'translateY(-5px)' }
          }}>
            <CardContent sx={{ p: 2.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box sx={{ 
                  backgroundColor: '#e74c3c',
                  borderRadius: '12px',
                  p: 1.5,
                  mr: 2 
                }}>
                  <FaPaintBrush size={24} color="white" />
                </Box>
                <Typography variant="h6" color="textSecondary">
                  Total Artists
                </Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 600 }}>
                {statsData.totalArtists}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Services Card */}
        <Grid item xs={12} md={3}>
          <Card sx={{ 
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            transition: 'transform 0.2s',
            '&:hover': { transform: 'translateY(-5px)' }
          }}>
            <CardContent sx={{ p: 2.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box sx={{ 
                  backgroundColor: '#2ecc71',
                  borderRadius: '12px',
                  p: 1.5,
                  mr: 2 
                }}>
                  <FaTools size={24} color="white" />
                </Box>
                <Typography variant="h6" color="textSecondary">
                  Total Services
                </Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 600 }}>
                {statsData.totalServices}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Earnings Card */}
        <Grid item xs={12} md={3}>
          <Card sx={{ 
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            transition: 'transform 0.2s',
            '&:hover': { transform: 'translateY(-5px)' }
          }}>
            <CardContent sx={{ p: 2.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box sx={{ 
                  backgroundColor: '#f1c40f',
                  borderRadius: '12px',
                  p: 1.5,
                  mr: 2 
                }}>
                  <FaRupeeSign size={24} color="white" />
                </Box>
                <Typography variant="h6" color="textSecondary">
                  Total Earnings
                </Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 600 }}>
                {statsData.totalEarnings}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts */}
      <Grid container spacing={2}>
        <Grid item xs={12} md={8}>
          <Card sx={{ 
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            height: '100%' 
          }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#2C3E50' }}>
                User Growth
              </Typography>
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={statsData.userGrowthData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                  <XAxis dataKey="month" stroke="#666" />
                  <YAxis stroke="#666" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#fff',
                      border: 'none',
                      borderRadius: '8px',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="users" 
                    stroke="#3498db" 
                    strokeWidth={3}
                    dot={{ stroke: '#3498db', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ 
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            height: '100%' 
          }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#2C3E50' }}>
                Services by Category
              </Typography>
              <ResponsiveContainer width="100%" height={350}>
                <PieChart>
                  <Pie
                    data={serviceCategoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, value }) => `${name} (${value})`}
                  >
                    {serviceCategoryData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#fff',
                      border: 'none',
                      borderRadius: '8px',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
