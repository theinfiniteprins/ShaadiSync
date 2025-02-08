import { useState } from "react";
import { FiArrowRight, FiMapPin } from "react-icons/fi"; // Import location icon
import Dropdown from "./Dropdown"; // Import the reusable dropdown component

const SearchBar = () => {
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);

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

  return (
    <div className="flex bg-white p-4 rounded-sm shadow-lg w-full max-w-3xl mx-auto">
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

      <button className="bg-pink-500 text-white px-6 py-3 rounded-sm flex items-center gap-2 hover:bg-pink-600 transition">
        Find vendors <FiArrowRight />
      </button>
    </div>
  );
};

export default SearchBar;
