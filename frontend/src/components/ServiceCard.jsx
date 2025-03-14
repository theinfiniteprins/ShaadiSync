import React from "react";
import { useNavigate } from "react-router-dom";

export default function ServiceCard({ service, onClick }) {
  const navigate = useNavigate();

  return (
    <div 
      className="w-full max-w-xs bg-white-20 border border-gray-100 shadow-xs rounded-2xl overflow-hidden"
    >
      {/* Image Section */}
      <div className="relative w-full h-48 p-2">
        <img
          src={service.photos?.[0] || "https://via.placeholder.com/300x200"}
          alt={service.name}
          className="w-full h-full object-cover transition-opacity duration-300 rounded-lg"
          loading="lazy"
        />
      </div>

      {/* Card Content */}
      <div className="p-4">
        {/* Service Name */}
        <h3 className="text-lg font-bold text-gray-800 mb-3 truncate">{service.name}</h3>

        {/* Price */}
        <div className="mb-4 flex items-center gap-2">
          <span className="text-sm text-gray-600">Service Price:</span>
          <span className="text-lg font-semibold text-gray-900">₹{service.price}</span>
        </div>

        {/* View Service Button */}
        <button 
           onClick={() => navigate(`/services/${service._id}`)}
          className="w-full bg-pink-500 text-white py-2 rounded-lg text-sm hover:bg-pink-600 transition-colors"
        >
          View Service
        </button>
      </div>
    </div>
  );
}
