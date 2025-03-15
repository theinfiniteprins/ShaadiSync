import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaUser, FaCalendar, FaEnvelope, FaPhone, FaArrowLeft, FaUsers } from 'react-icons/fa';
import config from '../../configs/config';
import Loading from '../error/loader.jsx';

const LeadsByService = () => {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const [serviceData, setServiceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchServiceLeads = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('artistToken');
        
        const response = await axios.get(
          `${config.baseUrl}/api/user-unlock-service/service-users/${serviceId}`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );

        setServiceData(response.data);
      } catch (err) {
        setError('Failed to fetch service leads');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchServiceLeads();
  }, [serviceId]);

  if (loading) return <Loading />;
  if (error) return <div className="text-center text-red-500 py-8">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-8 overflow-auto" style={{
      msOverflowStyle: 'none',
      scrollbarWidth: 'none'
    }}>
      <style>
        {`
          ::-webkit-scrollbar {
            display: none;
          }
          * {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}
      </style>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate('/artist/leads')}
          className="flex items-center text-[#155dfc] hover:text-[#1550e0] mb-6 transition-colors duration-200"
        >
          <FaArrowLeft className="mr-2" /> Back to Services
        </button>

        {/* Service Header Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {serviceData?.serviceId?.title ?? "Service Details"}
              </h1>
              <p className="text-gray-600 max-w-2xl">
                {serviceData?.serviceId?.description ?? "No description available"}
              </p>
            </div>
            <div className="bg-gradient-to-r from-[#155dfc]/10 to-[#155dfc]/5 p-4 rounded-2xl">
              <div className="flex items-center space-x-3">
                <FaUsers className="text-[#155dfc] text-2xl" />
                <div>
                  <p className="text-sm text-gray-600">Total Unlocks</p>
                  <p className="text-2xl font-bold text-[#155dfc]">
                    {serviceData?.unlockedBy ? serviceData.unlockedBy.length : 0}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Users List Section */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            User Details
          </h2>
        </div>

        {!serviceData?.unlockedBy?.length ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaUser className="text-4xl text-gray-300" />
            </div>
            <h2 className="text-xl font-medium text-gray-900 mb-2">No Leads Yet</h2>
            <p className="text-gray-600 max-w-md mx-auto">
              When users unlock this service, their details will appear here.
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {serviceData.unlockedBy.map((unlock) => (
              <div 
                key={unlock?._id ?? Math.random()} // Fallback key
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-200 border border-gray-100"
              >
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center space-x-4">
                    <div className="bg-gradient-to-r from-[#155dfc]/10 to-[#155dfc]/5 p-4 rounded-xl">
                      <FaUser className="text-[#155dfc] text-xl" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {unlock?.userId?.name ?? "Unknown User"}
                      </h3>
                      <div className="flex flex-wrap items-center gap-4 text-gray-600">
                        <span className="flex items-center bg-gray-50 px-3 py-1 rounded-full">
                          <FaEnvelope className="mr-2 text-[#155dfc]" />
                          {unlock?.userId?.email ?? "No Email"}
                        </span>
                        {unlock?.userId?.phone && (
                          <span className="flex items-center bg-gray-50 px-3 py-1 rounded-full">
                            <FaPhone className="mr-2 text-[#155dfc]" />
                            {unlock.userId.phone}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500 bg-gray-50 px-3 py-1 rounded-full flex items-center">
                    <FaCalendar className="mr-2 text-[#155dfc]" />
                    {unlock?.createdAt
                      ? new Date(unlock.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })
                      : "Unknown Date"}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LeadsByService;
