import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import ServiceCard from "../../components/ServiceCard";
import config from "../../configs/config";
import Loading from "../error/loading";
import Error from "../error/Error";

const CategoryInfo = ({ artistType, totalServices }) => {
  return (
    <div className="text-left mb-6">
      <h2 className="text-2xl font-bold text-gray-800">
        {artistType} ({totalServices.toLocaleString()})
      </h2>
      <p className="text-gray-600 text-sm mt-2">
        See list of Best {artistType} in all Indian cities. Find and compare prices of premium and budget services. Get full quotations, see portfolios, latest reviews, and photos on ShaadiSync.
      </p>
    </div>
  );
};

export default function CategorywiseServiceList() {
  const [artistType, setArtistType] = useState("");
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { categoryId, location } = useParams(); // Get categoryId and location from URL
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchServices = async () => {
      try {
        setLoading(true);

        // Fetch all services for the category
        const response = await axios.get(`${config.baseUrl}/api/services/category/${categoryId}`);
        console.log("API Response:", response.data);

        setArtistType(response.data.artistType?.type || "");

        // Filter services based on location if it exists
        const filteredServices = location
          ? response.data.services.filter(service => 
              service.artistId?.address?.toLowerCase().includes(location.toLowerCase())
            )
          : response.data.services;

        setServices(Array.isArray(filteredServices) ? filteredServices : []);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching services:", err);
        setError("Failed to load services. Please try again later.");
        setLoading(false);
      }
    };

    fetchServices();
  }, [categoryId, location]);

  useEffect(() => {
    console.log("Filtered Services Updated:", services);
  }, [services]);

  const handleServiceClick = (serviceId) => {
    console.log("Service clicked:", serviceId);
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Error message={error} onRetry={() => window.location.reload()} />;
  }

  return (
    <div className="py-4 px-45">
      <nav className="text-gray-600 text-sm mb-4 text-left">
        <span className="cursor-pointer text-pink-500" onClick={() => navigate("/")}>
          Home
        </span>{" "}
        /{" "}
        <span className="capitalize cursor-pointer text-pink-500" onClick={() => navigate(`/${categoryId}`)}>
          {artistType}
        </span>
        {location && ` / ${location}`}
      </nav>

      <CategoryInfo artistType={artistType} totalServices={services.length} />

      {services.length === 0 ? (
        <div className="text-left py-12">
          <p className="text-gray-500">No services available in this category{location ? ` for ${location}` : ""}.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-20">
          {services.map((service) => (
            <ServiceCard key={service._id} service={service} onClick={() => handleServiceClick(service._id)} />
          ))}
        </div>
      )}
    </div>
  );
}
