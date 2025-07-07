import React, { useEffect, useState } from "react";
import dashboard_img from "../../assets/delhi_bg.webp";
import SearchBar from "../../components/SearchBar";
import CategorywiseArtist from "../../components/CategorywiseArtist";
import Footer from "../../components/Footer";
import config from "../../configs/config";
import Loading from "../error/loader.jsx";
import Error from "../error/Error";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Cookies from 'js-cookie';
import { Dialog, DialogContent, DialogActions, Button } from '@mui/material';
import { MapPin } from 'lucide-react';
import NearbyArtists from '../../components/NearbyArtists';
import SkeletonCategory from "../../skeletons/SkeletonCategory"; // import the skeleton
import SkeletonHero from "../../skeletons/SkeletonHero"; // import the skeleton

const Dashboard = () => {
  const [artistTypes, setArtistTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showLocationDialog, setShowLocationDialog] = useState(false);
  const [locationError, setLocationError] = useState(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user && user.isAdmin)
      navigate('/admin');
    // Don't redirect to '/' here, otherwise it will keep redirecting
  }, [user, navigate]);

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
    const dialogDismissed = Cookies.get('locationDialogDismissed');
    const userLat = Cookies.get('userLat');
    const userLng = Cookies.get('userLng');
    if ((!userLat || !userLng) && !dialogDismissed) {
      setShowLocationDialog(true);
    }
  }, []);

  const handleLocationRequest = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          Cookies.set('userLat', latitude, { expires: 7 });
          Cookies.set('userLng', longitude, { expires: 7 });
          setShowLocationDialog(false);
        },
        (error) => {
          setLocationError("Could not get your location. Please try again.");
        }
      );
    } else {
      setLocationError("Location services are not supported by your browser.");
    }
  };

  const handleMaybeLater = () => {
    Cookies.set('locationDialogDismissed', 'true', { expires: 1 });
    setShowLocationDialog(false);
  };

  return (
    <div className="bg-pink-50 min-h-screen flex flex-col">
      {/* Hero Section: Always visible, loads instantly */}
      {loading ? (
        <SkeletonHero />
      ) : (
        <div className="relative w-full h-[50vh] md:h-[72vh]">
          <img src={dashboard_img} alt="Wedding" className="w-full h-full object-cover" />
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black to-transparent"></div>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 mt-32 md:mt-64">
            <h1 className="text-white text-3xl md:text-5xl font-bold mb-2 md:mb-4">Plan Your Dream Wedding</h1>
            <p className="text-white text-base md:text-lg mb-4 md:mb-6">Find the best vendors & artists for your special day.</p>
            <div className="w-full max-w-3xl">
              <SearchBar artistTypes={artistTypes} />
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 w-full px-0 md:px-0">
        {error ? (
          <Error message={error} onRetry={() => window.location.reload()} />
        ) : loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 px-4 md:px-8 py-8">
            {[...Array(6)].map((_, i) => (
              <SkeletonCategory key={i} />
            ))}
          </div>
        ) : (
          <>
            <CategorywiseArtist artistTypes={artistTypes} />
            <NearbyArtists />
            <Footer />
          </>
        )}
      </div>

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
              onClick={handleMaybeLater}
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
  );
};

export default Dashboard;
