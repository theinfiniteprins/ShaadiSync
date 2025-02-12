import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { FiArrowRight, FiMapPin } from "react-icons/fi"; // Import location icon
import Dropdown from "./Dropdown"; // Import the reusable dropdown component

const SearchBar = ({ artistTypes }) => {  
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [error, setError] = useState(""); // State for validation message
  const navigate = useNavigate(); // Initialize navigation

  // Dropdown options
  // const vendorOptions = [
  //   { label: "Photographers", id: "67a72fd5b5ed844973c075a0" },
  //   { label: "Makeup Artists", id: "makeup-artists" },
  //   { label: "Decorators", id: "decorators" },
  // ];
  const vendorOptions = [{ label: "All Categories", id: "all" }];
  vendorOptions.push(...artistTypes.map(artist => ({
    id: artist._id,
      label: artist.type
  })));

  const locationOptions = [
    { label: "Delhi", icon: FiMapPin },
    { label: "Mumbai", icon: FiMapPin },
    { label: "Bangalore", icon: FiMapPin },
  ];
  
  const handleSearch = () => {
    const vendor = selectedVendor?.id;  // Use 'id' for URL path
    const location = selectedLocation?.label?.toLowerCase().replace(/\s+/g, "-") || "";

    // Validation
    if (!vendor) {
      setError("Please select a vendor type.");
      return;
    }

    // Clear error
    setError("");

    // Construct the navigation path
    let path = `/${vendor}`;
    if (location) {
      path += `/${location}`; // Append location if provided
    }
    
    // Navigate with userId as query param
    navigate(`${path}`);
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
          placeholder="Search For Artist Type"  
          className="flex-1"
        />

        {/* Location Dropdown with Input Support and Location Icon */}
        <Dropdown
          options={locationOptions}
          selected={selectedLocation}
          setSelected={setSelectedLocation}
          placeholder="Enter Location (Optional)"
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
