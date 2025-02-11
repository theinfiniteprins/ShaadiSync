import React from "react";
import { FaStar, FaRegHeart, FaCamera, FaVideo } from "react-icons/fa";

export default function ServiceCard({ service, onClick }) {
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

        {/* Most Preferred Badge */}
        {service.isPreferred && (
          <span className="absolute top-2 left-2 bg-green-600 text-white text-xs font-semibold px-2 py-1 rounded-md">
            Most Preferred
          </span>
        )}

        {/* Shortlist Button */}
        <button className="absolute top-2 right-2 bg-white p-2 rounded-full shadow-md hover:bg-gray-100">
          <FaRegHeart className="text-red-500 text-lg" />
        </button>

        {/* Photo & Video Count */}
        <div className="absolute bottom-2 left-2 flex space-x-2 text-white text-xs font-semibold bg-black bg-opacity-50 px-2 py-1 rounded-md">
          <div className="flex items-center space-x-1">
            <FaCamera className="text-white" />
            <span>75+</span>
          </div>
          <div className="flex items-center space-x-1">
            <FaVideo className="text-white" />
            <span>10+</span>
          </div>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4">
        {/* Service Name */}
        <h3 className="text-lg font-bold text-gray-800 mb-1 truncate">{service.name}</h3>
        <p className="text-sm text-gray-600">{service.location}</p>
        <p className="text-sm text-gray-500">{service.artistType}</p>

        {/* Ratings & Price */}
        <div className="flex justify-between items-center my-3">
          <div className="flex items-center">
            <FaStar className="text-yellow-500 text-lg" />
            <span className="ml-1 text-gray-700 font-medium">{service.rating || "No Rating"}</span>
            <span className="ml-1 text-sm text-gray-500">({service.reviews} Reviews)</span>
          </div>
          <span className="text-lg font-semibold text-gray-900">₹{service.price}</span>
        </div>

        {/* Buttons */}
        <div className="flex justify-between items-center mt-4">
          <button className="bg-gray-100 text-gray-800 px-4 py-2 rounded-lg text-sm hover:bg-gray-200">
            Send Enquiry
          </button>
          <button className="bg-pink-500 text-white px-4 py-2 rounded-lg text-sm">
            View Contact
          </button>
        </div>
      </div>
    </div>
  );
}
