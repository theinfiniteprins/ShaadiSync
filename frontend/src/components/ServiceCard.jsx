import React from 'react';

export default function ServiceCard({ service, onClick }) {
  return (
    <div 
      className="w-full max-w-sm bg-white border border-gray-300 shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer"
      onClick={onClick}
    >
      <div className="relative w-full h-48">
        <img
          src={service.photos[0] || 'https://via.placeholder.com/300x200'} // Use first photo or fallback
          alt={service.name}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="p-4">
        {/* Service Name */}
        <h3 className="text-xl font-bold text-gray-800 mb-2">
          {service.name}
        </h3>

        {/* Artist Info */}
        <div className="flex items-center mb-3">
          <img
            src={service.artistId.profilePic || 'https://via.placeholder.com/40x40'}
            alt={service.artistId.name}
            className="w-10 h-10 rounded-full mr-2"
          />
          <div>
            <p className="font-medium text-sm">{service.artistId.name}</p>
          </div>
        </div>

        {/* Price */}
        <div className="flex justify-between items-center">
          <span className="text-lg font-semibold text-pink-600">₹{service.price}</span>
          <button className="bg-pink-600 text-white px-4 py-1 rounded-full text-sm hover:bg-pink-700">
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
}
