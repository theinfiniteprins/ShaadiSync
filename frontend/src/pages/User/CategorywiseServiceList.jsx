import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import ServiceCard from '../../components/ServiceCard';

export default function CategorywiseServiceList() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { categoryId } = useParams();

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `http://localhost:5000/api/services/category/${categoryId}`
        );
        console.log("categoryId",categoryId);
        // The API returns an array directly, so we can use it as is
        console.log('API Response:', response.data); // For debugging
        setServices(Array.isArray(response.data) ? response.data : []);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching services:', err);
        setError('Failed to load services. Please try again later.');
        setLoading(false);
      }
    };

    fetchServices();
  }, [categoryId]);

  const handleServiceClick = (serviceId) => {
    // Handle service click - you can add navigation here
    console.log('Service clicked:', serviceId);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="text-red-500 text-center">
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 bg-pink-600 text-white px-4 py-2 rounded hover:bg-pink-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Available Services</h2>
      
      {services.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No services available in this category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.isArray(services) && services.map((service) => (
            <ServiceCard
              key={service._id}
              service={service}
              onClick={() => handleServiceClick(service._id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
