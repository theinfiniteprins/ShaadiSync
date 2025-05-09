import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiSearch, FiUser, FiLogOut, FiChevronDown, FiLock } from "react-icons/fi";
import { FaWallet, FaCoins } from "react-icons/fa6";
import { useAuth } from "../context/AuthContext";
import Dropdown1 from "./Dropdown1"; // ✅ Import reusable dropdown component
import logo from "../assets/ShaadiSync.png";
import config from "../configs/config";

const generateAvatarUrl = (email) => {
  if (!email) return 'https://ui-avatars.com/api/?name=U&background=0D8ABC&color=fff';
  
  const name = email.split('@')[0]
    .replace(/[^a-zA-Z0-9]/g, '+')
    .replace(/\+{2,}/g, '+')
    .trim();
  
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0D8ABC&color=fff`;
};

const Navbar = () => {
  const { isSignin, logout, user } = useAuth();
  const [artistTypes, setArtistTypes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchArtistTypes = async () => {
      try {
        const response = await fetch(`${config.baseUrl}/api/artist-types/`);
        if (!response.ok) throw new Error("Failed to fetch artist types");
        const data = await response.json();
        setArtistTypes(
          data.map((type) => ({
            id: type._id,
            label: type.type,
            image: type.typeimg || "https://via.placeholder.com/40",
          }))
        );
      } catch (error) {
        console.error("Error fetching artist types:", error);
      }
    };
    fetchArtistTypes();
  }, []);

  return (
    <nav className="bg-pink-100 shadow-md py-4 px-60 flex justify-between items-center relative z-50">
      {/* Left Side - Logo */}
      <Link to="/" className="flex-shrink-0">
        <img src={logo} alt="ShaadiSync Logo" className="h-10 scale-[5]" />
      </Link>

      {/* Right Side - Navigation */}
      <div className="flex items-center gap-12 relative">
        {/* Artist Dropdown */}
        <Dropdown1
          label="Artist"
          options={artistTypes}
          icon={<FiChevronDown />}
          onSelect={(id) => navigate(`/${id}`)}
        />

        {/* Search Icon */}
        <FiSearch
          className="text-gray-700 text-2xl cursor-pointer hover:text-gray-900"
          onClick={() => navigate("/search")} // ✅ Redirects to search page
        />

        {/* User Profile Section */}
        {isSignin ? (
          <div className="flex items-center gap-7">
            {/* SyncCoins Display */}
            <div className="flex items-center gap-2 bg-pink-200 px-3 py-1 rounded-full">
              <FaCoins className="text-yellow-500" />
              <span className="font-medium text-gray-700">{user?.SyncCoin || 0}</span>
            </div>

            {/* User Profile Dropdown */}
            <Dropdown1
              label={
                <img
                  src={user?.profilePic}
                  alt={user?.name || 'User'}
                  className="w-10 h-10 rounded-full cursor-pointer"
                />
              }
              options={[
                { id: "profile", label: "Profile", icon: <FiUser className="text-xl" /> },
                {id: "wallet", label: "Wallet", icon: <FaWallet className="text-xl" />},           
                { id: "unlocked-services", label: "Unlocked Services", icon: <FiLock className="text-xl" /> },
                { id: "logout", label: "Logout", icon: <FiLogOut className="text-xl" /> },
              ]}
              onSelect={(id) => {
                if (id === "logout") logout();
                else if (id === "wallet") navigate("/wallet");
                else navigate(`/${id}`);
              }}
            />
          </div>
        ) : (
          <>
            {/* Sign In Button */}
            <Link to="/login" className="text-gray-700 font-medium hover:text-gray-900">
              Sign In
            </Link>

            {/* Divider */}
            <div className="w-px h-6 bg-gray-400"></div>

            {/* Are you an Artist? */}
            <Link to="/artist/login" className="text-gray-600 font-small hover:text-gray-900">
              Are you an Artist?
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
