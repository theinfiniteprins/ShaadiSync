import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Slider from 'react-slick';
import config from '../../configs/config';
import Loading from '../error/loading';
import Error from '../error/Error';
import { FaMapMarkerAlt, FaRupeeSign, FaStar, FaUser, FaPhone, FaEnvelope, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

// Import slick carousel CSS
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function ViewService() {
  const [service, setService] = useState(null);
  const [artist, setArtist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchServiceAndArtist = async () => {
      try {
        setLoading(true);
        // Fetch service details
        const serviceResponse = await axios.get(`${config.baseUrl}/api/services/${id}`);
        setService(serviceResponse.data);
        console.log('Service Data:', serviceResponse.data.artistId);
        
        // Fetch artist details using artistId from service
        const artistResponse = await axios.get(`${config.baseUrl}/api/artists/${serviceResponse.data.artistId._id}`);
        setArtist(artistResponse.data);
        
        console.log('Service Data:', serviceResponse.data);
        console.log('Artist Data:', artistResponse.data);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load service details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchServiceAndArtist();
  }, [id]);

  // Custom arrows for slider
  const NextArrow = ({ onClick }) => (
    <button
      className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/80 p-2 rounded-full shadow-lg hover:bg-white transition-all"
      onClick={onClick}
    >
      <FaChevronRight className="text-gray-800 text-xl" />
    </button>
  );

  const PrevArrow = ({ onClick }) => (
    <button
      className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/80 p-2 rounded-full shadow-lg hover:bg-white transition-all"
      onClick={onClick}
    >
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

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={() => window.location.reload()} />;
  if (!service || !artist) return null;

  // Debug log to check service object
  console.log('Current Service State:', service);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        {/* <nav className="text-gray-600 text-sm mb-6">
          <span className="cursor-pointer hover:text-pink-500" onClick={() => navigate("/")}>
            Home
          </span>{" "}
          /{" "}
          <span className="cursor-pointer hover:text-pink-500" onClick={() => navigate(`/category/${service.categoryId?._id}`)}>
            {service.categoryId?.type}
          </span>{" "}
          / {service.title}
        </nav> */}

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Image Slider */}
          <div className="relative h-[500px]">
            <Slider {...sliderSettings}>
              {service.photos?.map((image, index) => (
                <div key={index} className="h-[500px]">
                  <img
                    src={image}
                    alt={`${service.name} - ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
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
              <p className="text-gray-600 whitespace-pre-line leading-relaxed">
                {service.description}
              </p>
            </div>

            {/* Artist Details */}
            <div className="mt-8 p-6 bg-gray-50 rounded-lg">
              <h2 className="text-2xl font-semibold mb-6">Artist Information</h2>
              <div className="flex items-start space-x-6">
                <img
                  src={artist.profilePic || 'https://via.placeholder.com/150'}
                  alt={artist.name}
                  className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                />
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-3">{artist.name}</h3>
                  <div className="space-y-2">
                    <p className="text-gray-600 flex items-center">
                      <FaPhone className="mr-3 text-pink-500" />
                      {artist.mobileNumber}
                    </p>
                    <p className="text-gray-600 flex items-center">
                      <FaEnvelope className="mr-3 text-pink-500" />
                      {artist.email}
                    </p>
                    <p className="text-gray-600 flex items-center">
                      <FaMapMarkerAlt className="mr-3 text-pink-500" />
                      {artist.address}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Videos Section (if available)
            {service.videos && service.videos.length > 0 && (
              <div className="mt-8">
                <h2 className="text-2xl font-semibold mb-4">Service Videos</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {service.videos.map((video, index) => (
                    <div key={index} className="aspect-video">
                      <video
                        src={video}
                        controls
                        className="w-full h-full rounded-lg"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )} */}

            {/* Booking Button */}
            <div className="mt-8 flex justify-end">
              <button
                onClick={() => navigate(`/book/${id}`)}
                className="bg-pink-500 text-white px-8 py-3 rounded-lg hover:bg-pink-600 transition-colors duration-200 font-semibold"
              >
                Book Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
