import React, { useState } from "react";
import { FaTimes } from "react-icons/fa";

export default function FilterSection({ onFilterChange }) {
  const [filters, setFilters] = useState({
    budget: "",
    rating: "",
    shortlisted: false,
  });

  const handleChange = (filterType, value) => {
    const updatedFilters = { ...filters, [filterType]: value };
    setFilters(updatedFilters);
    onFilterChange(filterType, value);
  };

  const handleClearFilters = () => {
    setFilters({ budget: "", rating: "", shortlisted: false });
    onFilterChange("budget", "");
    onFilterChange("rating", "");
    onFilterChange("shortlisted", false);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md flex flex-wrap items-center justify-between mb-6 border border-gray-200">
      
      {/* Left Side - Filters */}
      <div className="flex flex-wrap items-center gap-6">
        {/* Budget Filter */}
        <select
          className="border p-2 rounded-md focus:outline-none focus:ring-2"
          value={filters.budget}
          onChange={(e) => handleChange("budget", e.target.value)}
        >
          <option value="">Select Budget</option>
          <option value="2000">Up to ₹2,000</option>
          <option value="5000">Up to ₹5,000</option>
          <option value="10000">Up to ₹10,000</option>
          <option value="50000">Up to ₹50,000</option>
        </select>

        {/* Rating Filter */}
        <select
          className="border p-2 rounded-md focus:outline-none focus:ring-2"
          value={filters.rating}
          onChange={(e) => handleChange("rating", e.target.value)}
        >
          <option value="">Select Rating</option>
          <option value="1">⭐ 1 Star</option>
          <option value="2">⭐⭐ 2 Stars</option>
          <option value="3">⭐⭐⭐ 3 Stars</option>
          <option value="4">⭐⭐⭐⭐ 4 Stars</option>
          <option value="5">⭐⭐⭐⭐⭐ 5 Stars</option>
        </select>

        {/* Shortlisted Filter */}
        <button
          className={`px-4 py-2 rounded-md transition ${
            filters.shortlisted ? "bg-pink-400 text-white" : "bg-gray-300 text-gray-700"
          }`}
          onClick={() => handleChange("shortlisted", !filters.shortlisted)}
        >
          {filters.shortlisted ? "Shortlisted ✔" : "Shortlisted"}
        </button>
      </div>

      {/* Right Side - Clear Filters Button */}
      <button
        className="flex items-center px-4 py-2 text-sm bg-red-500 text-white rounded-md hover:bg-red-600 transition"
        onClick={handleClearFilters}
      >
        <FaTimes className="mr-2" /> Clear Filters
      </button>

    </div>
  );
}
