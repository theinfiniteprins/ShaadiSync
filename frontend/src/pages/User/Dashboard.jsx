import React, { useEffect, useState } from "react";
import dashboard_img from "../../assets/delhi_bg.webp";
import SearchBar from "../../components/SearchBar";
import CategorywiseArtist from "../../components/CategorywiseArtist";
import Footer from "../../components/Footer";
import config from "../../configs/config";
import Loading from "../error/loader.jsx"; // Import Loading component
import Error from "../error/Error"; // Import Error component
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Cookies from 'js-cookie'; // Add js-cookie import

const Dashboard = () => {
  const [artistTypes, setArtistTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const {user} = useAuth();

  useEffect(() => {
      if (user && user.isAdmin) 
        navigate('/admin');
      else 
        navigate('/');
    }, [user]);

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

  useEffect(() => {
    // Get user's location
    const getUserLocation = () => {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            
            // Store coordinates in cookies for 7 days
            Cookies.set('userLat', latitude, { expires: 7 });
            Cookies.set('userLng', longitude, { expires: 7 });
          },
          (error) => {
            console.error("Error getting location:", error);
            // // Set default coordinates (you can set your city's coordinates)
            // Cookies.set('userLat', '23.0225', { expires: 7 }); // Default latitude
            // Cookies.set('userLng', '72.5714', { expires: 7 }); // Default longitude
          },
          {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
          }
        );
      }
    };

    getUserLocation();
  }, []);

  const userLat = Cookies.get('userLat');
  const userLng = Cookies.get('userLng');

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Error message={error} onRetry={() => window.location.reload()} />;
  }

  return (
    <div className="bg-pink-50 shadow-md flex">
      <div className="relative w-full h-[72vh]">
        {/* Background Image */}
        <img src={dashboard_img} alt="Wedding" className="w-full h-full object-cover" />

        {/* Gradient Overlay */}
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black to-transparent"></div>

        {/* Overlay Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 mt-64">
          <h1 className="text-white text-5xl font-bold mb-4">Plan Your Dream Wedding</h1>
          <p className="text-white text-lg mb-6">Find the best vendors & artists for your special day.</p>

          {/* Search Bar */}
          <div className="w-full max-w-3xl">
            <SearchBar artistTypes={artistTypes} />
          </div>
        </div>
        {/* Category-wise Artists Section */}
        <CategorywiseArtist artistTypes={artistTypes} />
          <Footer />

      </div>
    </div>
  );
};

export default Dashboard;
