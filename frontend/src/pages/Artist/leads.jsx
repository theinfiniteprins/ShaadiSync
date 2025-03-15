import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { FaUser, FaCalendar, FaUsers } from 'react-icons/fa';
import config from '../../configs/config';
import Loading from '../error/loader.jsx';

// Add CSS for hiding scrollbar
const scrollbarHiddenStyle = {
  scrollbarWidth: 'none',  /* Firefox */
  msOverflowStyle: 'none',  /* IE and Edge */
  '&::-webkit-scrollbar': {
    display: 'none'  /* Chrome, Safari and Opera */
  }
};

const Leads = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
    const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Reload the page once when component mounts or when coming back
    if (!location.state?.reloaded || location.state?.from === 'service') {
      window.location.reload();
      navigate(location.pathname, { state: { reloaded: true } });
      return;
    }

    const fetchServices = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('artistToken');
        
        const response = await axios.get(
          `${config.baseUrl}/api/services/artist/getbyid`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );

        setServices(response.data);
      } catch (err) {
        setError('Failed to fetch services');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    console.log("services");

    fetchServices();
  }, [location.pathname, navigate]);

  const handleServiceClick = (serviceId) => {
    navigate(`/artist/leads/${serviceId}`, { state: { from: 'service' } });
  };

  if (loading) return <Loading />;
  if (error) return <div className="text-center text-red-500 py-8">{error}</div>;

  return (
    <div className="min-h-screen py-8 overflow-auto" style={{
      msOverflowStyle: 'none',
      scrollbarWidth: 'none'
    }}>
      <style>
        {`
          /* Hide scrollbar for Chrome, Safari and Opera */
          ::-webkit-scrollbar {
            display: none;
          }

          /* Hide scrollbar for IE, Edge and Firefox */
          * {
            -ms-overflow-style: none;  /* IE and Edge */
            scrollbar-width: none;  /* Firefox */
          }
        `}
      </style>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Services Leads</h1>

        {services.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <FaUser className="text-5xl text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-medium text-gray-900 mb-2">No Services Yet</h2>
            <p className="text-gray-600">
              Create services to start getting leads
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <div 
                key={service._id} 
                className="bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer hover:shadow-xl transition-shadow"
                onClick={() => handleServiceClick(service._id)}
              >
                {/* Service Image */}
                <div className="aspect-w-16 aspect-h-9 relative">
                  <img
                    src={service.photos[0] || '/default-service.jpg'} // Fallback to default image
                    alt={service.name}
                    className="w-full h-32 object-cover"
                    onError={(e) => {
                      e.target.src = '/default-service.jpg'; // Fallback if image fails to load
                    }}
                  />
                  <div className="absolute top-4 right-4 bg-[#155dfc]/10 p-2 rounded-full">
                    <FaUsers className="text-[#155dfc] text-xl" />
                  </div>
                </div>

                {/* Service Details */}
                <div className="p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1">
                    {service.name}
                  </h2>
                  
                  <div className="flex items-center justify-between text-sm mt-4">
                    <span className="text-gray-500 flex items-center">
                      <FaCalendar className="mr-2" />
                      {new Date(service.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>
                    <button 
                      className="text-[#155dfc] hover:text-[#1550e0] font-medium flex items-center"
                      onClick={() => handleServiceClick(service._id)}
                    >
                      View Leads →
                    </button>
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

export default Leads;
