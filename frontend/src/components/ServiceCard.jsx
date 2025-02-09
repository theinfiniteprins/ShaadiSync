import React from 'react';

export default function ServiceCard({ service, onClick }) {
  return (
    <div 
      className="w-full max-w-sm bg-white border border-gray-300 shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-105"
      onClick={onClick}
    >
      {/* Image Section */}
      <div className="relative w-full h-56">
        <img
          src={service.photos?.[0] || 'https://via.placeholder.com/300x200'}
          alt={service.name}
          className="w-full h-full object-cover transition-opacity duration-300"
          loading="lazy"
        />
        {service.isPreferred && (
          <span className="absolute top-2 left-2 bg-green-600 text-white text-xs font-semibold px-2 py-1 rounded-md">
            Most Preferred
          </span>
        )}
      </div>

      {/* Card Content */}
      <div className="p-4">
        {/* Service Name */}
        <h3 className="text-xl font-bold text-gray-800 mb-2">{service.name}</h3>

        {/* Artist Info */}
        <div className="flex items-center mb-3">
          <img
            src={service.artistId?.profilePic || 'https://via.placeholder.com/40x40'}
            alt={service.artistId?.name}
            className="w-10 h-10 rounded-full mr-3"
          />
          <div>
            <p className="font-medium text-sm">{service.artistId?.name}</p>
            <p className="text-xs text-gray-500">{service.location}</p>
          </div>
        </div>

        {/* Ratings & Price */}
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center">
            <span className="text-yellow-500 text-lg">★</span>
            <span className="ml-1 text-gray-700">{service.rating || 'No Rating'}</span>
          </div>
          <span className="text-lg font-semibold text-pink-600">₹{service.price}</span>
        </div>

        {/* Buttons */}
        <div className="flex justify-between mt-4">
          <button className="bg-gray-100 text-gray-800 px-4 py-2 rounded-full text-sm hover:bg-gray-200">
            Send Enquiry
          </button>
          <button className="bg-pink-600 text-white px-4 py-2 rounded-full text-sm hover:bg-pink-700">
            View Contact
          </button>
        </div>
      </div>
    </div>
  );
}
