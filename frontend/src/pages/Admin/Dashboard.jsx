import React from 'react';
import { Box, Grid, Card, CardContent, Typography } from '@mui/material';
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { FaUsers, FaPaintBrush, FaTools, FaRupeeSign } from 'react-icons/fa';

const Dashboard = () => {
  // Sample data - replace with actual data from your backend
  const statsData = {
    totalUsers: 1250,
    totalArtists: 85,
    totalServices: 120,
    totalEarnings: "₹125,000"
  };

  // Sample user growth data - replace with actual data
  const userGrowthData = [
    { month: 'Jan', users: 500 },
    { month: 'Feb', users: 650 },
    { month: 'Mar', users: 800 },
    { month: 'Apr', users: 950 },
    { month: 'May', users: 1100 },
    { month: 'Jun', users: 1250 },
  ];

  // Updated service category data with actual numbers
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
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 600, color: '#2C3E50' }}>
        Dashboard Overview
      </Typography>

      {/* Stats Cards */}
      <Grid container spacing={2} mb={2}>
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
                <LineChart data={userGrowthData}>
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
