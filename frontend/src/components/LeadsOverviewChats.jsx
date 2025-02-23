import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid,
  ResponsiveContainer 
} from 'recharts';
import { TrendingUp } from 'lucide-react';
const LeadsOverviewChart = ({ data }) => {
  // Enhanced month conversion function
  const getMonthName = (monthStr) => {
    // First check if it's a number (1-12)
    const monthNumber = parseInt(monthStr);
    if (!isNaN(monthNumber) && monthNumber >= 1 && monthNumber <= 12) {
      return new Date(2000, monthNumber - 1, 1).toLocaleString('default', { month: 'long' });
    }

    // If it's a short month name, convert to number then to full name
    const monthMap = {
      'jan': 0, 'january': 0,
      'feb': 1, 'february': 1,
      'mar': 2, 'march': 2,
      'apr': 3, 'april': 3,
      'may': 4,
      'jun': 5, 'june': 5,
      'jul': 6, 'july': 6,
      'aug': 7, 'august': 7,
      'sep': 8, 'september': 8,
      'oct': 9, 'october': 9,
      'nov': 10, 'november': 10,
      'dec': 11, 'december': 11
    };

    const monthKey = monthStr.toLowerCase();
    const monthIndex = monthMap[monthKey];
    
    if (monthIndex !== undefined) {
      return new Date(2000, monthIndex, 1).toLocaleString('default', { month: 'long' });
    }

    // If all else fails, return the original string
    return monthStr;
  };

  // Transform data to include full month names
  const transformedData = data.map(item => ({
    ...item,
    fullMonth: getMonthName(item.month),
    // Keep original month for sorting if needed
    originalMonth: item.month
  }));
  

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 shadow-lg rounded-lg border border-gray-100">
          <p className="font-semibold text-gray-900">{label}</p>
          <p className="text-blue-600 font-medium">
            {payload[0].value} Leads
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="bg-blue-100 p-2 rounded-lg">
              <TrendingUp className="w-5 h-5 text-blue-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 ml-3">Leads Overview</h2>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-600 rounded-full mr-2"></div>
              <span className="text-sm text-gray-600">Total Leads</span>
            </div>
          </div>
        </div>
        <p className="text-gray-500 mt-2">Track your monthly lead generation performance</p>
      </div>

      {/* Chart */}
      <div className="h-[400px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={transformedData} margin={{ top: 20, right: 30, left: 20, bottom: 30 }}>
            <CartesianGrid 
              strokeDasharray="3 3" 
              vertical={false} 
              stroke="#E5E7EB"
            />
            <XAxis 
              dataKey="fullMonth" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#6B7280', fontSize: 12 }}
              dy={10}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#6B7280', fontSize: 12 }}
              dx={-10}
            />
            <Tooltip 
              content={<CustomTooltip />}
              cursor={{ fill: '#F3F4F6' }}
            />
            <Bar 
              dataKey="leads" 
              fill="#3B82F6"
              radius={[4, 4, 0, 0]}
              maxBarSize={60}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-100">
        <div className="text-center">
          <p className="text-2xl font-bold text-gray-900">
            {transformedData.reduce((sum, item) => sum + item.leads, 0)}
          </p>
          <p className="text-sm text-gray-600">Total Leads</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-gray-900">
            {Math.max(...transformedData.map(item => item.leads))}
          </p>
          <p className="text-sm text-gray-600">Highest Monthly Leads</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-gray-900">
            {Math.round(transformedData.reduce((sum, item) => sum + item.leads, 0) / transformedData.length)}
          </p>
          <p className="text-sm text-gray-600">Average Monthly Leads</p>
        </div>
      </div>
    </div>
  );
};

export default LeadsOverviewChart;