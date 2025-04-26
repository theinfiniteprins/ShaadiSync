import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import config from '../../configs/config';
import { useAuth } from '../../context/AuthContext';
import Loading from '../error/loader.jsx';
import Error from '../error/Error';
import ServiceCard from '../../components/ServiceCard';

export default function UnlockedServices() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const fetchUnlockedServices = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${config.baseUrl}/api/user-unlock-service/unlocked-service/${user?._id}`
        );
        // Access the service data from the unlocked service objects
        const unlockedServices = response.data.map(item => item.serviceId);
        // console.log('Unlocked Services:', unlockedServices); // Debug log
        setServices(unlockedServices);
      } catch (err) {
        console.error('Error fetching unlocked services:', err);
        setError('Failed to load unlocked services. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (user?._id) {
      fetchUnlockedServices();
    }
  }, [user?._id]);

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={() => window.location.reload()} />;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Unlocked Services</h1>
          <p className="mt-2 text-gray-600">
            View all the services you have unlocked
          </p>
        </div>

        {services.length === 0 ? (
          // Empty state
          <div className="text-center py-12 bg-white rounded-xl shadow-sm">
            <div className="text-gray-400 text-6xl mb-4">🔓</div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">No Unlocked Services</h3>
            <p className="text-gray-600 mb-6">
              You haven't unlocked any services yet.
            </p>
            <button
              onClick={() => navigate('/')}
              className="bg-pink-500 text-white px-6 py-2 rounded-lg hover:bg-pink-600 transition-colors"
            >
              Explore Services
            </button>
          </div>
        ) : (
          // Grid of unlocked services
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <div 
                key={service._id}
                onClick={() => navigate(`/services/${service._id}`)}
                className="cursor-pointer transform transition-transform hover:scale-105"
              >
                <ServiceCard 
                  service={service}
                  key={service._id}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}