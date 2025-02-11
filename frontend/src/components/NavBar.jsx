import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { FiSearch, FiUser, FiLogOut } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/ShaadiSync.png";
// import defaultProfile from "../assets/default-profile.jpg"; // Default profile pic

const Navbar = () => {
  const { isSignin, logout, user } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="bg-pink-100 shadow-md py-4 px-60 flex justify-between items-center relative z-50">
      {/* Left Side - Logo */}
      <Link to="/" className="flex-shrink-0">
        <img src={logo} alt="ShaadiSync Logo" className="h-10 scale-[5]" />
      </Link>

      {/* Right Side - Navigation */}
      <div className="flex items-center gap-6 relative">
        {/* Vendors Link */}
        <Link to="/vendors" className="text-gray-700 font-medium hover:text-gray-900">
          Vendors
        </Link>

        {/* Search Icon */}
        <FiSearch className="text-gray-700 text-2xl cursor-pointer hover:text-gray-900" />

        {/* If user is signed in, show profile picture */}
        {isSignin ? (
          <div className="relative" ref={dropdownRef}>
            <img
              src={user?.profilePic || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQMggZhOIH1vXmnv0bCyBu8iEuYQO-Dw1kpp7_v2mwhw_SKksetiK0e4VWUak3pm-v-Moc&usqp=CAU"}
              alt="User"
              className="w-10 h-10 rounded-full cursor-pointer object-cover"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            />

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-40 bg-white shadow-lg rounded-lg border border-gray-200 z-50">
                <Link
                  to="/profile"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center"
                  onClick={() => setDropdownOpen(false)} // Close on click
                >
                  <FiUser className="mr-2" /> Profile
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setDropdownOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center"
                >
                  <FiLogOut className="mr-2" /> Logout
                </button>
              </div>
            )}
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
