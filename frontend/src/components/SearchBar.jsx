import React from "react";
import { FiArrowRight } from "react-icons/fi";

const SearchBar = () => {
    return (
        <div className="flex bg-white p-4 rounded-sm shadow-lg w-full max-w-3xl mx-auto">
            {/* Vendor Dropdown */}
            {/* Vendor Dropdown */}
            <select className="flex-1 p-3 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-400 bg-white shadow-md cursor-pointer">
                <option className="text-gray-500 bg-gray-100">Search For Vendors</option>
                <option className="text-gray-700 hover:bg-pink-100">Photographers</option>
                <option className="text-gray-700 hover:bg-pink-100">Makeup Artists</option>
                <option className="text-gray-700 hover:bg-pink-100">Decorators</option>
            </select>

            {/* Location Dropdown */}
            <select className="flex-1 p-3 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-400 bg-white shadow-md cursor-pointer mx-4">
                <option className="text-gray-500 bg-gray-100">Search for location</option>
                <option className="text-gray-700 hover:bg-pink-100">Delhi</option>
                <option className="text-gray-700 hover:bg-pink-100">Mumbai</option>
                <option className="text-gray-700 hover:bg-pink-100">Bangalore</option>
            </select>


            {/* Search Button */}
            <button className="bg-pink-500 text-white px-6 py-3 rounded-sm flex items-center gap-2 hover:bg-pink-600 transition">
                Find vendors <FiArrowRight />
            </button>
        </div>
    );
};

export default SearchBar;
