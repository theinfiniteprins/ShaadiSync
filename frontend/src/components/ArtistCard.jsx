import React from 'react';
import { MapPin, Phone, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ArtistCard = ({ artist }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/artist-page/${artist._id}`);
  };

  return (
    <div 
      onClick={handleClick}
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer"
    >
      <div className="relative">
        <img 
          src={artist.profilePic || 'https://via.placeholder.com/300x200?text=No+Image'} 
          alt={artist.name}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-2 right-2 bg-white px-3 py-1.5 rounded-full shadow-md flex items-center gap-1.5">
          <MapPin className="h-4 w-4 text-pink-600" />
          <span className="text-sm font-medium text-gray-700">
            {artist.distance < 1 
              ? 'Less than 1 km' 
              : `${artist.distance.toFixed(1)} km`}
          </span>
        </div>
      </div>

      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{artist.name}</h3>
            <span className="inline-block bg-pink-100 text-pink-800 text-xs px-2 py-1 rounded-full">
              {artist.artistType.type}
            </span>
          </div>
          {artist.isVerified && (
            <svg 
              className="h-5 w-5 text-blue-500" 
              fill="none" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="2" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
        </div>

        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {artist.description || 'No description available'}
        </p>
      </div>
    </div>
  );
};

export default ArtistCard;