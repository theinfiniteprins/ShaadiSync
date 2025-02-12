import React, { useEffect, useState } from "react";
import SearchBar from "../../components/SearchBar";
import config from "../../configs/config"; // ✅ Import config

const Search = () => {
  const [artistTypes, setArtistTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArtistTypes = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${config.baseUrl}/api/artist-types/`);

        if (!response.ok) {
          throw new Error("Failed to fetch artist types");
        }

        const data = await response.json();
        setArtistTypes(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchArtistTypes();
  }, []);

  return (
    <div className="px-60 py-6 text-center">
      {/* Title and Description */}
      <h1 className="text-4xl font-bold text-gray-800 mb-4">
        Find the Perfect Artist for Your Event
      </h1>
      <p className="text-gray-600 text-lg mb-6 max-w-3xl mx-auto">
        Discover talented artists for weddings, events, and special occasions. 
        Explore different artist types and connect with the best professionals in the industry.
      </p>

      {/* Search Bar */}
      <div className="flex justify-center">
        <SearchBar artistTypes={artistTypes} />
      </div>

      {/* Loading State */}
      {loading && <p className="text-blue-600 text-lg mt-4">Fetching artists...</p>}

      {/* Error State */}
      {error && <p className="text-red-500 text-lg mt-4">{error}</p>}

      {/* Artist Type Grid */}
      {!loading && !error && artistTypes.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6 justify-center">
          {artistTypes.map((type) => (
            <div
              key={type._id}
              className="border border-gray-200 rounded-lg shadow-md p-5 flex flex-col items-center hover:shadow-lg transition-all bg-white"
            >
              <img
                src={type.typeimg || "https://via.placeholder.com/100"}
                alt={type.type}
                className="w-24 h-24 rounded-full mb-4 object-cover"
              />
              <p className="text-gray-700 font-semibold text-xl">{type.type}</p>
              <p className="text-gray-500 text-sm mt-2 max-w-xs">
                Top-rated artists offering the best services for your special day.
              </p>
            </div>
          ))}
        </div>
      )}

      {/* No Data Message */}
      {!loading && artistTypes.length === 0 && (
        <p className="text-gray-500 text-lg mt-6">No artist types available. Please check back later.</p>
      )}
    </div>
  );
};

export default Search;
