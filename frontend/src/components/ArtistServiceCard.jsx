import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCalendar, FaPowerOff } from 'react-icons/fa';
import axios from 'axios';
import config from '../configs/config';

const ArtistServiceCard = ({ service }) => {
  const navigate = useNavigate();
  const [isLive, setIsLive] = useState(Boolean(service.isLive));
  const [isToggling, setIsToggling] = useState(false);

  const toggleService = async (e) => {
    e.stopPropagation();
    if (isToggling) return;
    
    try {
      setIsToggling(true);
      const token = localStorage.getItem('artistToken');
      await axios.put(
        `${config.baseUrl}/api/services/toggle/${service._id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setIsLive(prevState => !prevState);
    } catch (error) {
      console.error('Failed to toggle service:', error);
    } finally {
      setTimeout(() => {
        setIsToggling(false);
      }, 500);
    }
  };

  return (
    <div 
      onClick={() => navigate(`/artist/service/${service._id}`)}
      className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 ease-in-out"
    >
      <div className="relative h-28">
        <img
          src={service.photos[0] || '/default-service.jpg'}
          alt={service.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = '/default-service.jpg';
          }}
        />
        <div className="absolute top-2 right-2">
          <button 
            onClick={toggleService}
            disabled={isToggling}
            className={`
              group relative flex items-center justify-center
              w-8 h-8 rounded-full 
              transition-all duration-500 ease-in-out
              transform hover:scale-110
              ${isLive 
                ? 'bg-green-500 hover:bg-green-600' 
                : 'bg-red-500 hover:bg-red-600'
              }
              ${isToggling ? 'cursor-not-allowed' : 'cursor-pointer'}
              shadow-lg hover:shadow-xl
            `}
          >
            <FaPowerOff 
              className={`
                text-white text-sm
                transition-transform duration-500 ease-in-out
                transform
                ${isToggling ? 'rotate-180' : isLive ? 'rotate-0' : 'rotate-180'}
              `}
            />
            
            <span className="
              absolute top-10 right-0
              bg-gray-900 text-white text-xs
              px-2 py-1 rounded
              transition-all duration-300 ease-in-out
              opacity-0 group-hover:opacity-100 
              transform group-hover:translate-y-0 translate-y-1
              whitespace-nowrap
              pointer-events-none
              z-10
            ">
              {isLive ? 'Turn Off Service' : 'Turn On Service'}
            </span>
          </button>
        </div>
      </div>

      <div className="p-3">
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-mm font-semibold text-gray-900 line-clamp-1">
            {service.name}
          </h2>
          <span className={`
            text-[10px] px-1.5 py-0.5 rounded-full
            transition-all duration-500 ease-in-out
            ${isLive 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
            }
          `}>
            {isLive ? 'Active' : 'Inactive'}
          </span>
        </div>
        <p className="text-xs text-gray-600 mb-2 line-clamp-1">
          {service.description}
        </p>
        
        <div className="flex items-center justify-between text-[10px]">
          <span className="text-gray-500 flex items-center">
            <FaCalendar className="mr-1 text-[10px]" />
            {new Date(service.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            })}
          </span>
          <button 
            onClick={() => navigate(`/artist/service/${service._id}`)}
            className="text-[#155dfc] hover:text-[#1550e0] font-medium transition-colors duration-300"
          >
            View Details →
          </button>
        </div>
      </div>
    </div>
  );
};

export default ArtistServiceCard;
