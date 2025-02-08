import { Link } from "react-router-dom";
import { FiSearch } from "react-icons/fi"; // Search icon from react-icons
import logo from "../assets/logo.svg"; // Adjust the path to your logo

const Navbar = () => {
  return (
    <nav className="bg-pink-50 shadow-md py-4 px-60 flex justify-between items-center">
      {/* Left Side - Logo */}
      <Link to="/" className="flex-shrink-0">
        <img 
          src={logo} 
          alt="ShaadiSync Logo" 
          className="h-10 scale-[5]" 
        />
      </Link>

      {/* Right Side - Navigation */}
      <div className="flex items-center gap-6">
        {/* Vendors Link */}
        <Link to="/vendors" className="text-gray-700 font-medium hover:text-gray-900">
          Vendors
        </Link>

        {/* Search Icon */}
        <FiSearch className="text-gray-700 text-2xl cursor-pointer hover:text-gray-900" />

        {/* Sign In Button */}
        <Link to="/signin" className="text-gray-700 font-medium hover:text-gray-900">
          Sign In
        </Link>

        {/* Divider */}
        <div className="w-px h-6 bg-gray-400"></div>

        {/* Are you an Artist? */}
        <Link to="/artist-signup" className="text-gray-600 font-small hover:text-gray-900">
          Are you an Artist?
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
