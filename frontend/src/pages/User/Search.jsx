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

  // Add getMatchScore as a component function
  const getMatchScore = (service, searchWords) => {
    const artist = service.artistId;
    if (!artist) return 0;

    const artistType = artistTypes.find(type => type._id === artist.artistType);
    const artistTypeName = artistType?.type?.toLowerCase() || '';
    const artistCity = artist.address?.toLowerCase() || '';

    let typeMatchCount = 0;
    let cityMatchCount = 0;

    searchWords.forEach(word => {
      if (artistTypeName.includes(word)) typeMatchCount++;
      if (artistCity.includes(word)) cityMatchCount++;
    });

    // Return score based on matches:
    // 3 - Both type and city match
    // 2 - Only type matches
    // 1 - Only city matches
    // 0 - No matches
    if (typeMatchCount > 0 && cityMatchCount > 0) return 3;
    if (typeMatchCount > 0) return 2;
    if (cityMatchCount > 0) return 1;
    return 0;
  };

  // Update handleSearchChange to use the moved function
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    if (!value.trim()) {
      setFilteredServices([]);
      return;
    }

    const searchWords = value.toLowerCase().split(' ').filter(word => 
      !['in', 'at', 'the', 'for', 'of', 'and', 'or'].includes(word)
    );

    const filtered = services
      .map(service => ({
        service,
        score: getMatchScore(service, searchWords)
      }))
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .map(item => item.service);

    setFilteredServices(filtered);
  };

  // if (loading) return <Loading />;
  if (loading) return Loading

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
            {/* Add search examples */}
            <p className="mt-2 text-sm text-gray-500 text-center">
              Try searching like "Mehendi artist in Nadiad" or "Photographer Mumbai"
            </p>
          </div>
        </div>

        {/* Results Section with categories */}
        {searchTerm && filteredServices.length > 0 && (
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              {filteredServices.length} Services Found
            </h3>
            
            {/* Group results by match type */}
            <div className="space-y-8">
              {/* Exact matches (both city and type) */}
              {searchTerm && filteredServices.filter(service => 
                getMatchScore(service, searchTerm.toLowerCase().split(' ').filter(word => 
                  !['in', 'at', 'the', 'for', 'of', 'and', 'or'].includes(word)
                )) === 3
              ).length > 0 && (
                <div>
                  <h4 className="text-lg font-medium text-gray-700 mb-4">
                    Exact Matches
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredServices
                      .filter(service => getMatchScore(service, searchTerm.toLowerCase().split(' ').filter(word => 
                        !['in', 'at', 'the', 'for', 'of', 'and', 'or'].includes(word)
                      )) === 3)
                      .map(service => (
                        <ServiceCard key={service._id} service={service} />
                      ))}
                  </div>
                </div>
              )}

              {/* Type matches */}
              {searchTerm && filteredServices.filter(service => 
                getMatchScore(service, searchTerm.toLowerCase().split(' ').filter(word => 
                  !['in', 'at', 'the', 'for', 'of', 'and', 'or'].includes(word)
                )) === 2
              ).length > 0 && (
                <div>
                  <h4 className="text-lg font-medium text-gray-700 mb-4">
                    Artist Type Matches
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredServices
                      .filter(service => getMatchScore(service, searchTerm.toLowerCase().split(' ').filter(word => 
                        !['in', 'at', 'the', 'for', 'of', 'and', 'or'].includes(word)
                      )) === 2)
                      .map(service => (
                        <ServiceCard key={service._id} service={service} />
                      ))}
                  </div>
                </div>
              )}

              {/* City matches */}
              {searchTerm && filteredServices.filter(service => 
                getMatchScore(service, searchTerm.toLowerCase().split(' ').filter(word => 
                  !['in', 'at', 'the', 'for', 'of', 'and', 'or'].includes(word)
                )) === 1
              ).length > 0 && (
                <div>
                  <h4 className="text-lg font-medium text-gray-700 mb-4">
                    Location Matches
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredServices
                      .filter(service => getMatchScore(service, searchTerm.toLowerCase().split(' ').filter(word => 
                        !['in', 'at', 'the', 'for', 'of', 'and', 'or'].includes(word)
                      )) === 1)
                      .map(service => (
                        <ServiceCard key={service._id} service={service} />
                      ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* No results message */}
        {searchTerm && filteredServices.length === 0 && (
          <div className="text-center text-gray-500 py-8">
            No services found matching your criteria
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
