import React from 'react';

export default function ArtistCategoryCard({ artist, onClick }) {
  // Generate a random number between 1000 and 5000
  const randomNumber = Math.floor(Math.random() * (5000 - 1000 + 1)) + 1000;
  return (
    <div 
      className="w-full max-w-sm bg-white border border-gray-300 shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer"
      onClick={onClick}
    >
      <div className="relative w-full h-48">
        <img
          src={artist.image || 'https://via.placeholder.com/300x200'} // Fallback image if none provided
          alt={artist.name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-4">
        {/* Artist Name */}
        <h3 className="text-xl font-bold text-gray-800 mb-2 text-center">
          {artist.name || 'Artist Name'}
        </h3>
        {/* Random Number */}
        {/* <div className="flex justify-center items-center space-x-2 text-pink-600">
          <span className="text-lg font-semibold">₹{randomNumber}</span>
        </div> */}
      </div>
    </div>
  );
}