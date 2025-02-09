import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { FiArrowRight, FiMapPin } from "react-icons/fi"; // Import location icon
import Dropdown from "./Dropdown"; // Import the reusable dropdown component

const SearchBar = () => {
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [error, setError] = useState(""); // State for validation message
  const navigate = useNavigate(); // Initialize navigation

  // Dropdown options
  const vendorOptions = [
    { label: "Photographers" },
    { label: "Makeup Artists" },
    { label: "Decorators" },
  ];

  const locationOptions = [
    { label: "Delhi", icon: FiMapPin },
    { label: "Mumbai", icon: FiMapPin },
    { label: "Bangalore", icon: FiMapPin },
  ];

  // Function to handle search button click
  const handleSearch = () => {
    const vendor = selectedVendor?.label || "";
    const location = selectedLocation?.label || "";

    // Validation
    if (!vendor) {
      setError("Please select vendor type .");
      return;
    }

    // Clear error and navigate to search page with URL parameters
    setError("");
    navigate(`/search?vendor=${encodeURIComponent(vendor)}&location=${encodeURIComponent(location)}`);
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="flex bg-white p-4 rounded-sm shadow-lg">
        {/* Vendor Dropdown */}
        <Dropdown
          options={vendorOptions}
          selected={selectedVendor}
          setSelected={setSelectedVendor}
          allowInput={true}
          placeholder="Search For Vendors"
          className="flex-1"
        />

        {/* Location Dropdown with Input Support and Location Icon */}
        <Dropdown
          options={locationOptions}
          selected={selectedLocation}
          setSelected={setSelectedLocation}
          placeholder="Enter Location"
          allowInput={true} // Enable text input for location
          className="flex-1 mx-4"
          icon={FiMapPin} // Pass location icon as prop
        />

        <button
          onClick={handleSearch}
          className="bg-pink-500 text-white px-6 py-3 rounded-sm flex items-center gap-2 hover:bg-pink-600 transition"
        >
          Find vendors <FiArrowRight />
        </button>
      </div>

      {/* Error Message Below Search Bar */}
      {error && <p className="text-red-500 text-sm mt-2 text-center">{error}</p>}
    </div>
  );
};

export default SearchBar;
