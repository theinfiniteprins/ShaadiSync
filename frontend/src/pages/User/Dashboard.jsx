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
import { Dialog, DialogContent, DialogActions, Button } from '@mui/material';
import { MapPin } from 'lucide-react';
import NearbyArtists from '../../components/NearbyArtists';

const Dashboard = () => {
  const [artistTypes, setArtistTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showLocationDialog, setShowLocationDialog] = useState(false); // Change to false initially
  const [locationError, setLocationError] = useState(null);
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
    // Check if user has dismissed the dialog recently
    const dialogDismissed = Cookies.get('locationDialogDismissed');
    
    // Check if coordinates exist in cookies
    const userLat = Cookies.get('userLat');
    const userLng = Cookies.get('userLng');

    // Only show dialog if coordinates are not present AND dialog wasn't dismissed recently
    if ((!userLat || !userLng) && !dialogDismissed) {
      setShowLocationDialog(true);
    }
  }, []); // Empty dependency array - runs once on mount

  const handleLocationRequest = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          Cookies.set('userLat', latitude, { expires: 7 });
          Cookies.set('userLng', longitude, { expires: 7 });
          setShowLocationDialog(false);
          // You can add logic here to fetch nearby artists
        },
        (error) => {
          console.error("Error getting location:", error);
          setLocationError("Could not get your location. Please try again.");
        }
      );
    } else {
      setLocationError("Location services are not supported by your browser.");
    }
  };

  const handleMaybeLater = () => {
    // Set a cookie that expires in 24 hours
    Cookies.set('locationDialogDismissed', 'true', { expires: 1 });
    setShowLocationDialog(false);
  };

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
        {/* Nearby Artists Section */}
        
        {/* Category-wise Artists Section */}
        <CategorywiseArtist artistTypes={artistTypes} />



        <NearbyArtists />
        <Footer />

        {/* Location Permission Dialog */}
        <Dialog 
          open={showLocationDialog} 
          onClose={() => setShowLocationDialog(false)}
          PaperProps={{
            className: "rounded-lg p-4"
          }}
        >
          <div className="text-center p-4">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-pink-100 mb-4">
              <MapPin className="h-6 w-6 text-pink-600" />
            </div>
            <DialogContent>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Find Artists Near You
              </h3>
              <p className="text-sm text-gray-500">
                Allow us to access your location to find the best wedding artists in your area.
              </p>
              {locationError && (
                <p className="text-sm text-red-500 mt-2">{locationError}</p>
              )}
            </DialogContent>
            <DialogActions className="flex justify-center gap-2 mt-4">
              <Button
                onClick={handleMaybeLater} // Changed from setShowLocationDialog(false)
                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
              >
                Maybe Later
              </Button>
              <Button
                onClick={handleLocationRequest}
                className="px-4 py-2 text-white bg-pink-600 hover:bg-pink-700 rounded-md"
                variant="contained"
              >
                Allow Location
              </Button>
            </DialogActions>
          </div>
        </Dialog>
      </div>
    </div>
  );
};

export default Dashboard;
