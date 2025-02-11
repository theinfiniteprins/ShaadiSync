import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import ServiceCard from "../../components/ServiceCard";
import config from "../../configs/config";
import Loading from "../error/loading";
import Error from "../error/Error";
import FilterSection from "../../components/FilterSection";

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
  const [filteredServices, setFilteredServices] = useState([]); // State for filtered services
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { categoryId, location } = useParams();
  const navigate = useNavigate();
  const [filters, setFilters] = useState({ budget: "", rating: "", shortlisted: false });
  console.log(services);
  

  useEffect(() => {
    window.scrollTo(0, 0);
    
    const fetchServices = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${config.baseUrl}/api/services/category/${categoryId}`);
        setArtistType(response.data.artistType?.type || "");
        const filtered = location
          ? response.data.services.filter(service => service.artistId?.address?.toLowerCase().includes(location.toLowerCase()))
          : response.data.services;
        setServices(Array.isArray(filtered) ? filtered : []);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching services:", err);
        setError("Failed to load services. Please try again later.");
        setLoading(false);
      }
    };

    const fetchAllServices = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${config.baseUrl}/api/services/live`);
        setArtistType("All Services");
        const filtered = location
          ? response.data.services.filter(service => service.artistId?.address?.toLowerCase().includes(location.toLowerCase()))
          : response.data.services;
        setServices(Array.isArray(filtered) ? filtered : []);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching services:", err);
        setError("Failed to load services. Please try again later.");
        setLoading(false);
      }
    };

    if (categoryId === "all") {
      fetchAllServices();
    } else {
      fetchServices();
    }
  }, [categoryId, location]);

  // Apply filters whenever filters or services change
  useEffect(() => {
    let filtered = [...services];
    
    if (filters.budget) {
      filtered = filtered.filter(service => service.price <= parseInt(filters.budget));
    }
    if (filters.rating) {
      filtered = filtered.filter(service => Math.round(service.rating) === parseInt(filters.rating));
    }
    if (filters.shortlisted) {
      filtered = filtered.filter(service => service.isShortlisted);
    }


  const handleServiceClick = (serviceId) => {
    navigate(`/service/${serviceId}`);
  };

    setFilteredServices(filtered);
  }, [filters, services]);


  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Error message={error} onRetry={() => window.location.reload()} />;
  }

  return (
    <div className="py-4 px-45">
      <nav className="text-gray-600 text-sm mb-4 text-left">
        <span className="cursor-pointer text-pink-500" onClick={() => navigate("/")}>Home</span> /
        <span className="capitalize cursor-pointer text-pink-500" onClick={() => navigate(`/${categoryId}`)}>{artistType}</span>
        {location && ` / ${location}`}
      </nav>

      <CategoryInfo artistType={artistType} totalServices={filteredServices.length} />

      {/* Pass filter state update function */}
      <FilterSection onFilterChange={(filterType, value) => setFilters(prev => ({ ...prev, [filterType]: value }))} />

      {filteredServices.length === 0 ? (
        <div className="text-left py-12">
          <p className="text-gray-500">No services available in this category{location ? ` for ${location}` : ""}.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-12 mt-20 px-6 mr-6">
          {filteredServices.map(service => (
            <ServiceCard key={service._id} service={service} />
          ))}
        </div>
      )}
    </div>
  );
}
