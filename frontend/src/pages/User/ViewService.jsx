import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Slider from "react-slick";
import config from "../../configs/config";
import Loading from "../error/loading";
import Error from "../error/Error";
import { useAuth } from "../../context/AuthContext";
import {
  FaMapMarkerAlt,
  FaRupeeSign,
  FaPhone,
  FaEnvelope,
  FaChevronLeft,
  FaChevronRight,
  FaLock,
  FaUser,
} from "react-icons/fa";

// Import slick carousel CSS
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function ViewService() {
  const [service, setService] = useState(null);
  const [artist, setArtist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const fetchServiceAndUnlockStatus = async () => {
      try {
        setLoading(true);
        
        // Fetch service details
        const serviceResponse = await axios.get(`${config.baseUrl}/api/services/${id}`);
        setService(serviceResponse.data);

        // Fetch artist details
        const artistResponse = await axios.get(`${config.baseUrl}/api/artists/${serviceResponse.data.artistId._id}`);
        setArtist(artistResponse.data);

        // Check if service is unlocked for the user
        if (user?._id) {
          try {
            await axios.get(`${config.baseUrl}/api/user-unlock-service/is-unlocked/${user._id}/${id}`);
            setIsUnlocked(true); // If request succeeds, service is unlocked
            console.log("Service is unlocked");
          } catch (unlockError) {
            if (unlockError.response?.status === 404) {
              setIsUnlocked(false); // 404 means service is not unlocked
            }
          }
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load service details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchServiceAndUnlockStatus();
  }, [id, user?._id]);

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
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  // Render artist details based on unlock status
  const renderArtistDetails = () => {
    return (
      <div className="relative">
        {isUnlocked ? (
          <div className="mt-8 p-8 bg-white rounded-2xl shadow-lg transform transition-all duration-300 hover:shadow-xl">
            <div className="flex items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Artist Information</h2>
              <div className="ml-4 px-3 py-1 bg-green-100 rounded-full">
                <span className="text-sm text-green-600 font-medium flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  Unlocked
                </span>
              </div>
            </div>
            <div className="flex items-start space-x-8">
              <div className="relative">
                <img
                  src={artist.profilePic || 'https://via.placeholder.com/150'}
                  alt={artist.name}
                  className="w-32 h-32 rounded-2xl object-cover shadow-lg transform transition-all duration-300 hover:scale-105"
                />
                <div className="absolute -bottom-2 -right-2 bg-pink-500 text-white p-2 rounded-lg">
                  <FaUser className="text-xl" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">{artist.name}</h3>
                <div className="space-y-4">
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all duration-200">
                    <FaPhone className="text-xl text-pink-500 mr-4" />
                    <div>
                      <p className="text-sm text-gray-500">Phone Number</p>
                      <p className="text-lg font-medium text-gray-800">{artist.mobileNumber}</p>
                    </div>
                  </div>
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all duration-200">
                    <FaEnvelope className="text-xl text-pink-500 mr-4" />
                    <div>
                      <p className="text-sm text-gray-500">Email Address</p>
                      <p className="text-lg font-medium text-gray-800">{artist.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all duration-200">
                    <FaMapMarkerAlt className="text-xl text-pink-500 mr-4" />
                    <div>
                      <p className="text-sm text-gray-500">Location</p>
                      <p className="text-lg font-medium text-gray-800">{artist.address}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-8 p-8 bg-white rounded-2xl shadow-lg relative overflow-hidden">
            <div className="absolute inset-0 bg-gray-100/50 backdrop-blur-sm z-10 flex items-center justify-center">
              <div className="text-center transform transition-all duration-300 hover:scale-105">
                <div className="bg-white p-6 rounded-2xl shadow-lg">
                  <FaLock className="text-4xl text-pink-500 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-800 mb-2">Unlock Artist Details</h3>
                  <p className="text-gray-600 mb-4">Get access to contact information and more</p>
                  <button
                    onClick={() => navigate(`/unlock/${id}`)}
                    className="bg-pink-500 text-white px-8 py-3 rounded-xl font-semibold 
                             hover:bg-pink-600 transform transition-all duration-300 
                             hover:shadow-lg active:scale-95"
                  >
                    Unlock Now
                  </button>
                </div>
              </div>
            </div>
            <div className="filter blur-[8px]">
              <div className="flex items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Artist Information</h2>
                <div className="ml-4 px-3 py-1 bg-gray-100 rounded-full">
                  <span className="text-sm text-gray-600 font-medium flex items-center">
                    <span className="w-2 h-2 bg-gray-500 rounded-full mr-2"></span>
                    Locked
                  </span>
                </div>
              </div>
              <div className="flex items-start space-x-8">
                <div className="w-32 h-32 bg-gray-200 rounded-2xl"></div>
                <div className="flex-1 space-y-4">
                  <div className="h-8 bg-gray-200 w-1/3 rounded-lg"></div>
                  <div className="space-y-4">
                    <div className="h-16 bg-gray-200 rounded-lg"></div>
                    <div className="h-16 bg-gray-200 rounded-lg"></div>
                    <div className="h-16 bg-gray-200 rounded-lg"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={() => window.location.reload()} />;
  if (!service || !artist) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Image Slider */}
          <div className="relative h-[500px]">
            <Slider {...sliderSettings}>
              {service.photos?.map((image, index) => (
                <div key={index} className="h-[500px]">
                  <img src={image} alt={`${service.name} - ${index + 1}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </Slider>
          </div>

          {/* Service Details */}
          <div className="p-8">
            <div className="flex flex-col md:flex-row justify-between items-start gap-4">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">{service.name}</h1>
                <div className="flex items-center gap-4 text-gray-600 mb-4">
                  <span className="flex items-center">
                    <FaMapMarkerAlt className="mr-2" />
                    {artist.address}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-pink-500 flex items-center justify-end">
                  <FaRupeeSign className="mr-1" />
                  {service.price?.toLocaleString()}
                </p>
              </div>
            </div>

            {/* Description */}
            <div className="mt-8">
              <h2 className="text-2xl font-semibold mb-4">About This Service</h2>
              <p className="text-gray-600 whitespace-pre-line leading-relaxed">{service.description}</p>
            </div>

            {/* Artist Details */}
            {renderArtistDetails()}

            {/* Booking Button */}
            <div className="mt-8 flex justify-end">
              <button onClick={() => navigate(`/book/${id}`)} className="bg-pink-500 text-white px-8 py-3 rounded-lg hover:bg-pink-600 transition">
                Book Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
