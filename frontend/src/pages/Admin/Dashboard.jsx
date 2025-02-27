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

  const [artistTypeData, setArtistTypeData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info'
  });

  // Get token from localStorage
  const token = localStorage.getItem('token');

  // Configure axios headers with token
  const axiosConfig = {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  };

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all data in parallel with proper error handling and token
      const [
        usersResponse, 
        artistsResponse, 
        servicesResponse, 
        userTransactionsResponse,
        artistTransactionsResponse
      ] = await Promise.all([
        axios.get(`${config.baseUrl}/api/users`, axiosConfig),
        axios.get(`${config.baseUrl}/api/artists`, axiosConfig),
        axios.get(`${config.baseUrl}/api/services`, axiosConfig),
        axios.get(`${config.baseUrl}/api/user-transaction-history/AllTransactions`, axiosConfig),
        axios.get(`${config.baseUrl}/api/artist-transactions`, axiosConfig)
      ]);

      // Get user Debited amount (updated validation)
      const userDebitedAmount = userTransactionsResponse.data
        .filter(transaction => transaction && transaction.transactionType === 'debit')
        .reduce((sum, transaction) => {
          const amount = parseFloat(transaction.amount);
          return sum + (isNaN(amount) ? 0 : amount);
        }, 0);

      // Get artist debited amount
      const artistDebitedAmount = artistTransactionsResponse.data
        .filter(transaction => transaction && transaction.type === 'debit')
        .reduce((sum, transaction) => {
          const amount = parseFloat(transaction.amount);
          return sum + (isNaN(amount) ? 0 : amount);
        }, 0);

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

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  // Get artist distribution by type
  const fetchArtistDistribution = async () => {
    try {
      // Fetch artist types with token
      const artistTypesResponse = await axios.get(`${config.baseUrl}/api/artist-types`, axiosConfig);
      console.log('Artist Types Response:', artistTypesResponse.data);
      
      // Create an object to store counts for each artist type
      const artistTypeCounts = {};
      
      // Initialize counts for each artist type to 0
      artistTypesResponse.data.forEach(type => {
        artistTypeCounts[type._id] = {
          name: type.type,
          count: 0
        };
      });

      // Fetch all artists with token
      const artistsResponse = await axios.get(`${config.baseUrl}/api/artists`, axiosConfig);
      console.log('Artists Response:', artistsResponse.data);

      // Count artists for each type
      artistsResponse.data.forEach(artist => {
        if (artist && artist.artistType && artistTypeCounts[artist.artistType._id]) {
          artistTypeCounts[artist.artistType._id].count += 1;
        }
      });

      // Convert to format needed for pie chart
      const chartData = Object.values(artistTypeCounts)
        .filter(type => type.count > 0)
        .map(type => ({
          name: type.name,
          value: type.count
        }));

      console.log('Chart Data:', chartData);
      setArtistTypeData(chartData);

    } catch (error) {
      console.error('Error fetching artist distribution:', error);
      handleError(error);
    }
  };

  // Enhanced error handling function
  const handleError = (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
      return;
    }
    
    setError(error.message || 'An error occurred');
    setSnackbar({
      open: true,
      message: error.response?.data?.message || error.message || 'An error occurred',
      severity: 'error'
    });
  };

  // Handle snackbar close
  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  useEffect(() => {
    if (!token) {
      window.location.href = '/login';
      return;
    }
    fetchDashboardData();
    fetchArtistDistribution();
  }, []);

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>Loading dashboard data...</Typography>
      </Box>
    );
  }

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
        {/* Line Chart */}
        <Grid item xs={12} md={8}>
          <Card sx={{ boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#2C3E50' }}>
                User Growth Over Time
              </Typography>
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={statsData.userGrowthData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="users" 
                    stroke="#3498db" 
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Pie Chart */}
        <Grid item xs={12} md={4}>
          <Card sx={{ 
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            height: '100%' 
          }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#2C3E50' }}>
                Artists by Category
              </Typography>
              <ResponsiveContainer width="100%" height={350}>
                <PieChart>
                  <Pie
                    data={artistTypeData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {artistTypeData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value, name) => [`${value} Artists`, name]}
                    contentStyle={{ 
                      backgroundColor: '#fff',
                      border: 'none',
                      borderRadius: '8px',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}
                  />
                  <Legend />
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
