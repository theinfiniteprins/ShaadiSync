import React, { useEffect, useState } from 'react';
import { MapPin } from 'lucide-react';
import Cookies from 'js-cookie';
import axios from 'axios';
import config from '../configs/config';
import ServiceCard from './ServiceCard';
import ArtistCard from './ArtistCard';

const NearbyArtists = () => {
  const [nearbyArtists, setNearbyArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNearbyArtists = async () => {
      const userLat = Cookies.get('userLat');
      const userLng = Cookies.get('userLng');

      if (!userLat || !userLng) {
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`${config.baseUrl}/api/artists/nearest`, {
          params: {
            latitude: userLat,
            longitude: userLng
          }
        });

        setNearbyArtists(response.data.artists);
      } catch (err) {
        console.error('Error fetching nearby artists:', err);
        setError('Failed to fetch nearby artists');
      } finally {
        setLoading(false);
      }
    };

    fetchNearbyArtists();
  }, []);

  if (!Cookies.get('userLat') || !Cookies.get('userLng')) {
    return null;
  }

  return (
    <div className="py-12 px-4 md:px-6 lg:px-8 bg-white">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <MapPin className="h-6 w-6 text-pink-600" />
            <h2 className="text-2xl font-semibold text-gray-900">Nearby Artists</h2>
          </div>
          <p className="text-gray-500">Discover talented artists in your area</p>
        </div>

        {/* Content Section */}
        <div className="flex justify-center">
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600"></div>
            </div>
          ) : error ? (
            <div className="text-center py-8 text-gray-500 max-w-lg mx-auto">
              {error}
            </div>
          ) : nearbyArtists.length === 0 ? (
            <div className="bg-gray-50 rounded-lg p-8 text-center max-w-lg mx-auto">
              <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No Artists Nearby
              </h3>
              <p className="text-gray-500">
                We couldn't find any artists in your area at the moment.
                Try expanding your search or check back later.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
              {nearbyArtists.map((artist) => (
                <ArtistCard key={artist._id} artist={artist} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NearbyArtists;