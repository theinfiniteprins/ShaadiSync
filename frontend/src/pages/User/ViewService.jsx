import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Slider from "react-slick";
import config from "../../configs/config";
import Loading from "../error/loader.jsx";
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
  FaStar,
  FaMinus,
  FaPlus,
} from "react-icons/fa";

// Import slick carousel CSS
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ReviewList from "../../components/ReviewList";
import ReviewForm from "../../components/ReviewForm";

export default function ViewService() {
  const [service, setService] = useState(null);
  const [artist, setArtist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [quantity, setQuantity] = useState(1);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [insufficientCoins, setInsufficientCoins] = useState(false);
  console.log(service);


  useEffect(() => {
    const fetchServiceAndUnlockStatus = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const headers = token ? { Authorization: `Bearer ${token}` } : {};

        // Fetch service details
        const serviceResponse = await axios.get(
          `${config.baseUrl}/api/services/${id}`,
          { headers }
        );
        setService(serviceResponse.data);

        // Only check unlock status if user is logged in
        if (user?._id) {
          try {
            await axios.get(
              `${config.baseUrl}/api/user-unlock-service/is-unlocked/${user._id}/${id}`,
              { headers }
            );
            setIsUnlocked(true);

            // Only fetch artist details if service is unlocked
            const artistResponse = await axios.get(
              `${config.baseUrl}/api/artists/${serviceResponse.data.artistId._id}`,
              { headers }
            );
            setArtist(artistResponse.data);
          } catch (unlockError) {
            // If 404, service is not unlocked - this is an expected case
            if (unlockError.response?.status === 404) {
              setIsUnlocked(false);
              setArtist(null); // Clear any existing artist data
            }
          }
        } else {
          // Not logged in, so service is not unlocked
          setIsUnlocked(false);
          setArtist(null);
        }

      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load service details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchServiceAndUnlockStatus();
  }, [id, user?._id]);


  useEffect(() => {
    const fetchArtistRating = async () => {
      try {

        const response = await axios.get(`${config.baseUrl}/api/reviews/get-rating/${service.artistId._id}`);
        
        setAverageRating(response.data.averageRating);
        setTotalReviews(response.data.totalReviews);
      } catch (err) {
        setError("Failed to fetch rating");
      } finally {
        setLoading(false);
      }
    };

    if (service) {
      fetchArtistRating();
    }

  }, [service]);

  const handleUnlock = async () => {
    const loadingToast = toast.loading('Unlocking service...', toastConfig.loading);
    try {
      if (!user) {
        navigate('/login', {
          state: {
            redirectTo: `/service/${id}`,
            message: "Please login to unlock artist details"
          }
        });
        return;
      }
  
      // Check if user has enough SyncCoins
      if (user.SyncCoin <= 0) {
        setInsufficientCoins(true);
        setTimeout(() => setInsufficientCoins(false), 3000); // Hide after 3 seconds
        return;
      }
  
      try {
        const token = localStorage.getItem("token");
        await axios.post(
          `${config.baseUrl}/api/user-unlock-service/unlock`,
          { serviceId: id },
          { headers: { Authorization: `Bearer ${token}` } }
        );
  
        // After successful unlock, fetch artist details
        const artistResponse = await axios.get(
          `${config.baseUrl}/api/artists/${service.artistId._id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setArtist(artistResponse.data);
        setIsUnlocked(true);
      } catch (err) {
        console.error('Error unlocking service:', err);
      }
      toast.success('Service unlocked successfully', {
        id: loadingToast,
        ...toastConfig.success
      });
    } catch (error) {
      toast.error('Failed to unlock service', {
        id: loadingToast,
        ...toastConfig.error
      });
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
                  src={artist?.profilePic || 'https://via.placeholder.com/150'}
                  alt={artist?.name || 'Unknown Artist'}
                  className="w-32 h-32 rounded-2xl object-cover shadow-lg transform transition-all duration-300 hover:scale-105"
                />
                <div className="absolute -bottom-2 -right-2 bg-pink-500 text-white p-2 rounded-lg">
                  <FaUser className="text-xl" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">{artist?.name || 'N/A'}</h3>
                <div className="space-y-4">
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all duration-200">
                    <FaPhone className="text-xl text-pink-500 mr-4" />
                    <div>
                      <p className="text-sm text-gray-500">Phone Number</p>
                      <p className="text-lg font-medium text-gray-800">{artist?.mobileNumber || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all duration-200">
                    <FaEnvelope className="text-xl text-pink-500 mr-4" />
                    <div>
                      <p className="text-sm text-gray-500">Email Address</p>
                      <p className="text-lg font-medium text-gray-800">{artist?.email || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all duration-200">
                    <FaMapMarkerAlt className="text-xl text-pink-500 mr-4" />
                    <div>
                      <p className="text-sm text-gray-500">Location</p>
                      <p className="text-lg font-medium text-gray-800">{artist?.address || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <ReviewForm artistId={service?.artistId._id || ''} />
          </div>
        ) : (
          <div className="mt-8 p-8 bg-white rounded-2xl shadow-lg relative overflow-hidden">
            <div className="absolute inset-0 bg-gray-100/50 backdrop-blur-sm z-10 flex items-center justify-center">
              <div className="text-center transform transition-all duration-300 hover:scale-105">
                <div className="bg-white p-6 rounded-2xl shadow-lg">
                  <FaLock className="text-4xl text-pink-500 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    {insufficientCoins ? "Insufficient SyncCoins" : "Unlock Artist Details"}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {insufficientCoins 
                      ? "You need SyncCoins to unlock artist details. Please recharge your wallet."
                      : "Get access to contact information and more"}
                  </p>
                  {insufficientCoins ? (
                    <button
                      onClick={() => navigate('/wallet')}
                      className="bg-pink-500 text-white px-8 py-3 rounded-xl font-semibold 
                               hover:bg-pink-600 transform transition-all duration-300 
                               hover:shadow-lg active:scale-95"
                    >
                      Recharge Wallet
                    </button>
                  ) : (
                    <button
                      onClick={handleUnlock}
                      className="bg-pink-500 text-white px-8 py-3 rounded-xl font-semibold 
                               hover:bg-pink-600 transform transition-all duration-300 
                               hover:shadow-lg active:scale-95"
                    >
                      Unlock Now
                    </button>
                  )}
                  {user && (
                    <div className="mt-2 text-sm text-gray-500">
                      Your Balance: {user.SyncCoin} SyncCoins
                    </div>
                  )}
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
        <ReviewList artistId={service?.artistId._id || ''} />
      </div>

    );
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={() => window.location.reload()} />;
  if (!service) return null;

  // Check if service is not live
  if (!service.isLive) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-lg text-center max-w-md">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Service Unavailable</h1>
          <p className="text-gray-600 mb-6">
            This service is currently not available. Please check back later or explore other services.
          </p>
          <button
            onClick={() => navigate('/')}
            className="bg-pink-500 text-white px-6 py-2 rounded-lg hover:bg-pink-600 transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  // If service is live, show the normal content
  return (
    <div className="min-h-screen bg-gray-50 py-8">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
        {/* Left side - Image Slider */}
        <div>
          <div className="relative h-[500px] mb-4">
            <Slider {...sliderSettings}>
              {service?.photos?.map((image, index) => (
                image ? (
                  <div key={index} className="h-[500px]">
                    <img
                      src={image}
                      alt={`${service?.name || "Service"} - ${index + 1}`}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                ) : null
              ))}
            </Slider>
          </div>

          {/* Thumbnails */}
          <div className="grid grid-cols-5 gap-2 mt-4">
            {service?.photos?.map((image, index) => (
              image ? (
                <div
                  key={index}
                  className={`cursor-pointer h-24 overflow-hidden rounded-lg border-2 
                    ${currentSlide === index ? 'border-pink-500' : 'border-transparent'}`}
                  onClick={() => setCurrentSlide(index)}
                >
                  <img
                    src={image}
                    alt={`thumbnail ${index + 1}`}
                    className="w-full h-full object-cover hover:opacity-75 transition-opacity"
                  />
                </div>
              ) : null
            ))}
          </div>
        </div>

        {/* Right side - Service Details */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {service?.name || "No name available"}
          </h1>

          {/* Rating */}
          <div className="flex items-center mb-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <FaStar
                key={star}
                className={`w-5 h-5 ${star <= (averageRating ?? 0) ? 'text-yellow-400' : 'text-gray-300'}`}
              />
            ))}
            <span className="ml-2 text-gray-600">({totalReviews ?? 0})</span>
          </div>

          {/* Price */}
          <div className="mb-6">
            <span className="text-3xl font-bold text-pink-600">
              ₹{service?.price ?? "N/A"}
            </span>
            {service?.originalPrice && (
              <span className="ml-2 text-gray-500 line-through">₹{service.originalPrice}</span>
            )}
          </div>

          {/* Description */}
          <p className="text-gray-600">{service?.description || "No description available"}</p>
        </div>
      </div>

      {/* Artist Details Section - Clear separation */}
      <div className="mt-8">{renderArtistDetails?.()}</div>
    </div>
  </div>
</div>
  );
}
