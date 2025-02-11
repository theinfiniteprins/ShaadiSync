import React, { useState } from "react";
import { FaFilter, FaTimes } from "react-icons/fa";

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
      <div className="flex flex-wrap items-center gap-10">
        {/* Budget Filter */}
        <select
          className="border p-2 rounded-md focus:outline-none focus:ring-2"
          value={filters.budget}
          onChange={(e) => handleChange("budget", e.target.value)}
        >
          <option value="">Sort by Budget</option>
          <option value="low">Low to High</option>
          <option value="high">High to Low</option>
        </select>

        {/* Rating Filter */}
        <select
          className="border p-2 rounded-md focus:outline-none focus:ring-2"
          value={filters.rating}
          onChange={(e) => handleChange("rating", e.target.value)}
        >
          <option value="">Sort by Ratings</option>
          <option value="high">Highest First</option>
          <option value="low">Lowest First</option>
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
        className="flex items-center px-4 py-2 text-sm bg-white text-black rounded-md border"
        onClick={handleClearFilters}
      >
        <FaTimes className="mr-2" /> Clear Filters
      </button>

    </div>
  );
}
