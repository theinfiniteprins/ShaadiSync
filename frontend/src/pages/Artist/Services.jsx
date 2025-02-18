import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaUser } from 'react-icons/fa';
import config from '../../configs/config';
import Loading from '../error/loading';
import ArtistServiceCard from '../../components/ArtistServiceCard';

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);

  useEffect(() => {
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

    fetchServices();
  }, []);
  useEffect(() => {
    const fetchArtistRating = async () => {
      try {
        const response = await axios.get(`${config.baseUrl}/api/reviews/get-rating/${services[0].artistId}`);
        console.log(response.data);
  
        if (response.data.totalReviews === 0) {
          setAverageRating(0);
          setTotalReviews(0);
        } else {
          setAverageRating(response.data.averageRating);
          setTotalReviews(response.data.totalReviews);
        }
        
      } catch (err) {
        console.error(err);
        setError("Failed to fetch rating");
      } finally {
        setLoading(false);
      }
    };
  
    if (services.length !== 0) {
      fetchArtistRating();
    }
  
  }, [services]);
  

  if (loading) return <Loading />;
  if (error) return <div className="text-center text-red-500 py-8">{error}</div>;

  return (
    <div className="min-h-screen py-8 overflow-auto" style={{
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
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Services</h1>
          <button
            onClick={() => navigate('/artist/add-service')}
            className="bg-[#155dfc] text-white px-4 py-2 rounded-lg hover:bg-[#1550e0] transition-colors duration-200"
          >
            Add New Service
          </button>
        </div>

        {services.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <FaUser className="text-5xl text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-medium text-gray-900 mb-2">No Services Yet</h2>
            <p className="text-gray-600 mb-6">
              Start by adding your first service
            </p>
            <button
              onClick={() => navigate('/artist/add-service')}
              className="bg-[#155dfc] text-white px-6 py-3 rounded-lg hover:bg-[#1550e0] transition-colors duration-200"
            >
              Add Service   
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <ArtistServiceCard key={service._id} service={service} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Services;
