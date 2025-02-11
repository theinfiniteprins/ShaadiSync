import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiSearch, FiUser, FiLogOut, FiChevronDown } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import Dropdown1 from "./Dropdown1"; // ✅ Import reusable dropdown component
import logo from "../assets/ShaadiSync.png";
import config from "../configs/config";

const Navbar = () => {
  const { isSignin, logout } = useAuth();
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


        {/* User Profile Dropdown */}
        {isSignin ? (
          <Dropdown1
            label={
              <img
                src="https://lh3.googleusercontent.com/-WDZpHpG6mNM/AAAAAAAAAAI/AAAAAAAAAAA/ALKGfkmMXfatimyTR9vHPght4QuZFJe85Q/photo.jpg?sz=46"
                alt="User"
                className="w-10 h-10 rounded-full cursor-pointer"
              />
            }
            options={[
              { id: "profile", label: "Profile", icon: <FiUser className="text-xl" /> },
              { id: "logout", label: "Logout", icon: <FiLogOut className="text-xl" /> },
            ]}
            onSelect={(id) => {
              if (id === "logout") logout();
              else navigate(`/${id}`);
            }}
          />
        ) : (
          <>
            {/* Sign In Button */}
            <Link to="/login" className="text-gray-700 font-medium hover:text-gray-900">
              Sign In
            </Link>

            {/* Divider */}
            <div className="w-px h-6 bg-gray-400"></div>

            {/* Are you an Artist? */}
            <Link to="/artist-signup" className="text-gray-600 font-small hover:text-gray-900">
              Are you an Artist?
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
