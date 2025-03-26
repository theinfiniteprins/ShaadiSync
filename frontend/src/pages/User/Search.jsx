import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaSearch } from "react-icons/fa";
import config from "../../configs/config";
import ServiceCard from "../../components/ServiceCard";
import Loading from "../error/loader.jsx";

const Search = () => {
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [artistTypes, setArtistTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState(null);

  // Fetch all services and artist types on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const headers = token ? { Authorization: `Bearer ${token}` } : {};

        // Fetch services
        const servicesResponse = await axios.get(
          `${config.baseUrl}/api/services/live`,
          { headers }
        );
        
        // Fetch artist types
        const artistTypesResponse = await axios.get(
          `${config.baseUrl}/api/artist-types`,
          { headers }
        );

        setServices(servicesResponse.data);
        setArtistTypes(artistTypesResponse.data);
        setFilteredServices([]); // Initialize with empty array
      } catch (err) {
        setError("Failed to fetch data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    if (!value.trim()) {
      setFilteredServices([]);
    } else {
      const term = value.toLowerCase();
      const filtered = services.filter(service => {
        const artist = service.artistId;
        if (!artist) return false;

        const cityMatch = artist.address?.toLowerCase().includes(term);
        const artistType = artistTypes.find(type => type._id === artist.artistType);
        const typeMatch = artistType?.type?.toLowerCase().includes(term);
        
        return cityMatch || typeMatch;
      });
      
      setFilteredServices(filtered);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      {/* Search Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Search Services
          </h2>
          
          <div className="max-w-2xl mx-auto">
            {/* Combined Search Input */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                onKeyPress={(e) => e.key === 'Enter' && handleSearchChange(e)}
                placeholder="Search by city or artist type..."
                className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-pink-500 focus:border-pink-500 text-lg"
              />
            </div>
          </div>
        </div>

        {/* Results Section */}
        {searchTerm && (
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              {filteredServices.length} Services Found
            </h3>
            
            {error ? (
              <div className="text-center text-red-500 py-8">{error}</div>
            ) : filteredServices.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                No services found matching your criteria
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredServices.map((service) => (
                  <ServiceCard key={service._id} service={service} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
