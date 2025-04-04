import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { MapPin, Award } from 'lucide-react';
import axios from 'axios';
import config from '../../configs/config';
import Loading from '../error/loader';
import Error from '../error/Error';
import ServiceCard from '../../components/ServiceCard';

const ArtistDetails = () => {
  const { artistId } = useParams();
  const [artist, setArtist] = useState(null);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [artistRes, servicesRes] = await Promise.all([
          axios.get(`${config.baseUrl}/api/artists/artist/${artistId}`),
          axios.get(`${config.baseUrl}/api/services/artist/${artistId}`)
        ]);
        console.log(artistRes.data, servicesRes.data.services);
        setArtist(artistRes.data);
        setServices(servicesRes.data.services);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.response?.data?.message || 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [artistId]);

  if (loading) return <Loading />;
  if (error) return <Error message={error} />;
  if (!artist) return <Error message="Artist not found" />;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Artist Header Section */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Profile Image */}
            <div className="w-40 h-40 rounded-full overflow-hidden shadow-lg flex-shrink-0">
              <img
                src={artist.profilePic || 'https://via.placeholder.com/160?text=Artist'}
                alt={artist.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Artist Info */}
            <div className="text-center md:text-left flex-grow">
              <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                <h1 className="text-3xl font-bold text-gray-900">{artist.name}</h1>
                {artist.isVerified && (
                  <Award className="h-6 w-6 text-blue-500" />
                )}
              </div>
              
              <span className="inline-block bg-pink-100 text-pink-800 text-sm px-3 py-1 rounded-full mb-4">
                {artist.artistType?.type}
              </span>
              
              {artist.description && (
                <p className="text-gray-600 max-w-2xl">
                  {artist.description}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-2">
          Services Offered
          {services.length > 0 && (
            <span className="text-sm font-normal text-gray-500">
              ({services.length} services)
            </span>
          )}
        </h2>
        
        {services.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-500 text-lg">No services available at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <ServiceCard 
                key={service._id}
                service={service}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ArtistDetails;