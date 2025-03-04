import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Slider from "react-slick";
import config from "../../configs/config";
import Loading from "../error/loading";
import Error from "../error/Error";
import {
  FaMapMarkerAlt,
  FaRupeeSign,
  FaChevronLeft,
  FaChevronRight,
  FaStar,
  FaArrowLeft,
  FaEdit,
  FaSave,
  FaTimes,
  FaExclamationTriangle
} from "react-icons/fa";

// Import slick carousel CSS
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function ViewService() {
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedService, setEditedService] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);

  useEffect(() => {
    fetchService();
  }, [id]);

  const fetchService = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("artistToken");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const serviceResponse = await axios.get(
        `${config.baseUrl}/api/services/${id}`,
        { headers }
      );
      setService(serviceResponse.data);
      setEditedService(serviceResponse.data);

      const ratingResponse = await axios.get(
        `${config.baseUrl}/api/reviews/get-rating/${serviceResponse.data.artistId._id}`
      );
      setAverageRating(ratingResponse.data.averageRating);
      setTotalReviews(ratingResponse.data.totalReviews);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load service details. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("artistToken");
      await axios.put(
        `${config.baseUrl}/api/services/${id}`,
        editedService,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setService(editedService);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating service:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedService(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const deleteImages = async (images) => {
    try {
      const token = localStorage.getItem("artistToken");
      
      // Delete each image
      for (const imageUrl of images) {
        if (imageUrl) {
          // Extract public_id from the URL
          const publicId = imageUrl.split('/').slice(-1)[0].split('.')[0];
          
          await axios.post(
            `${config.baseUrl}/api/users/delete-image`,
            { public_id: publicId },
            {
              headers: { Authorization: `Bearer ${token}` }
            }
          );
        }
      }
    } catch (error) {
      console.error('Error deleting images:', error);
      throw new Error('Failed to delete images');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      try {
        setLoading(true);
        const token = localStorage.getItem("artistToken");

        // First delete all images
        await deleteImages(service.photos);

        // Then delete the service
        await axios.delete(
          `${config.baseUrl}/api/services/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        
        navigate('/artist/services');
      } catch (error) {
        console.error('Error deleting service:', error);
        setError(error.message || 'Failed to delete service. Please try again later.');
      } finally {
        setLoading(false);
      }
    }
  };

  // Custom arrows for slider
  const NextArrow = ({ onClick }) => (
    <button className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/80 p-2 rounded-full shadow-lg hover:bg-white transition-all" onClick={onClick}>
      <FaChevronRight className="text-gray-800 text-xl" />
    </button>
  );

  const PrevArrow = ({ onClick }) => (
    <button className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/80 p-2 rounded-full shadow-lg hover:bg-white transition-all" onClick={onClick}>
      <FaChevronLeft className="text-gray-800 text-xl" />
    </button>
  );

  // Slider settings
  const sliderSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    beforeChange: (current, next) => setCurrentSlide(next),
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />
  };

  const renderEditButtons = () => {
    if (isEditing) {
      return (
        <div className="flex gap-2">
          <button
            onClick={handleSave}
            className="flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            <FaSave className="mr-2" />
            Save Changes
          </button>
          <button
            onClick={() => {
              setIsEditing(false);
              setEditedService(service);
            }}
            className="flex items-center px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            <FaTimes className="mr-2" />
            Cancel
          </button>
        </div>
      );
    }
  
    return (
      <>
        <button
          onClick={() => service.isLive ? null : setIsEditing(true)}
          className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
            service.isLive 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-blue-500 hover:bg-blue-600 text-white'
          }`}
          disabled={service.isLive}
          title={service.isLive ? "Turn off live status to edit" : "Edit service"}
        >
          <FaEdit className="mr-2" />
          Edit Service
        </button>
        <button
          onClick={handleDelete}
          className="flex items-center px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
        >
          <FaTimes className="mr-2" />
          Delete Service
        </button>
      </>
    );
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={() => window.location.reload()} />;
  if (!service) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-4 overflow-hidden">
      <style>
        {`
          ::-webkit-scrollbar {
            display: none;
          }
          * {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}
      </style>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-gray-900 group"
          >
            <FaArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Services
          </button>

          <div className="flex gap-2">
            {renderEditButtons()}
          </div>
        </div>

        {service?.isLive && (
          <div className="mb-4 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded">
            <div className="flex items-center">
              <FaExclamationTriangle className="text-yellow-400 mr-2" />
              <p className="text-sm text-yellow-700">
                This service is currently live. To make edits, please turn off the live status first.
              </p>
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
            {/* Left side - Image Slider */}
            <div className="space-y-4">
              <div className="relative h-[300px] rounded-xl overflow-hidden shadow-lg">
                <Slider {...sliderSettings}>
                  {service?.photos?.map((image, index) => (
                    image ? (
                      <div key={index} className="h-[300px]">
                        <img
                          src={image}
                          alt={`${service?.name || "Service"} - ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : null
                  ))}
                </Slider>
              </div>

              <div className="grid grid-cols-5 gap-2">
                {service?.photos?.map((image, index) => (
                  image ? (
                    <div
                      key={index}
                      className={`
                        cursor-pointer h-14 overflow-hidden rounded-lg 
                        transition-all duration-200 ease-in-out
                        ${currentSlide === index 
                          ? 'ring-2 ring-blue-500 ring-offset-2' 
                          : 'hover:opacity-75'
                        }
                      `}
                      onClick={() => setCurrentSlide(index)}
                    >
                      <img
                        src={image}
                        alt={`thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : null
                ))}
              </div>
            </div>

            {/* Right side - Service Details */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                {isEditing ? (
                  <input
                    type="text"
                    name="name"
                    value={editedService.name}
                    onChange={handleInputChange}
                    className="text-2xl font-bold text-gray-900 w-full border-b border-gray-300 focus:border-blue-500 outline-none"
                  />
                ) : (
                  <h1 className="text-2xl font-bold text-gray-900">
                    {service?.name}
                  </h1>
                )}
                <span className={`
                  ml-3 px-3 py-1 rounded-full text-sm font-medium
                  ${service?.isLive 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                  }
                `}>
                  {service?.isLive ? 'Active' : 'Inactive'}
                </span>
              </div>

              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <FaStar
                    key={star}
                    className={`w-4 h-4 ${
                      star <= (averageRating ?? 0) 
                        ? 'text-yellow-400' 
                        : 'text-gray-300'
                    }`}
                  />
                ))}
                <span className="ml-2 text-sm text-gray-600">
                  ({totalReviews ?? 0} reviews)
                </span>
              </div>

              <div className="flex items-center">
                <FaRupeeSign className="text-2xl text-gray-700" />
                {isEditing ? (
                  <input
                    type="number"
                    name="price"
                    value={editedService.price}
                    onChange={handleInputChange}
                    className="text-2xl font-bold text-gray-900 w-32 border-b border-gray-300 focus:border-blue-500 outline-none"
                  />
                ) : (
                  <span className="text-2xl font-bold text-gray-900">
                    {service?.price}
                  </span>
                )}
              </div>

              {isEditing ? (
                <textarea
                  name="description"
                  value={editedService.description}
                  onChange={handleInputChange}
                  className="w-full h-24 p-2 border border-gray-300 rounded-lg focus:border-blue-500 outline-none text-sm"
                />
              ) : (
                <p className="text-sm text-gray-600 leading-relaxed">
                  {service?.description}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
