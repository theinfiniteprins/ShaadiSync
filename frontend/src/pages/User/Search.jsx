import React from "react";
import { useSearchParams } from "react-router-dom";

const Search = () => {
  const [searchParams] = useSearchParams();

  // Extracting values from URL parameters
  const vendor = searchParams.get("vendor") || "Not specified";
  const location = searchParams.get("location") || "Not specified";

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">Search Results</h2>

      <div className="bg-white shadow-md rounded-md p-4">
        <p className="text-lg">
          <strong>Vendor:</strong> {vendor}
        </p>
        <p className="text-lg">
          <strong>Location:</strong> {location}
        </p>
      </div>
    </div>
  );
};

export default Search;
