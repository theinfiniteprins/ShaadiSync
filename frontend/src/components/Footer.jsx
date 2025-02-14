import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import logo from "../assets/ShaadiSync.png";
import { useNavigate } from 'react-router-dom';

export default function Footer() {
  const navigate = useNavigate();
  return (
    <footer className="bg-pink-100 text-gray-900 py-10">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          {/* Logo Section */}
          <div className="flex flex-col items-center md:items-start">
            <div className="flex flex-col">
              <img 
                src={logo} 
                alt="ShaadiSync Logo" 
                className="w-80 h-80 object-contain" 
              />
              <p className="text-gray-700 text-sm leading-relaxed max-w-sm text-center md:text-left -mt-24">
                Syncing your wedding journey with ease. Find verified wedding professionals effortlessly.
              </p>
            </div>
          </div>
          
          {/* Quick Links */}
          <div className="flex flex-col items-center md:items-start md:mt-28">
            <h3 className="text-xl font-bold text-gray-800 mb-6">Quick Links</h3>
            <ul className="space-y-4 text-center md:text-left">
              <li>
                <Link 
                // onClick={() => {
                //   navigate("./AboutUs");
                // }}
                  to="./AboutUs" 
                  className="text-gray-700 hover:text-pink-600 transition-colors duration-200"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link 
                  to="./Terms&Condition" 
                  className="text-gray-700 hover:text-pink-600 transition-colors duration-200"
                >
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link 
                  to="./PrivacyPolicy" 
                  className="text-gray-700 hover:text-pink-600 transition-colors duration-200"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Social Links */}
          <div className="flex flex-col items-center md:items-start md:mt-28">
            <h3 className="text-xl font-bold text-gray-800 mb-6">Follow Us</h3>
            <div className="flex space-x-8">
              <a 
                href="#" 
                className="text-gray-700 hover:text-pink-600 transition-colors duration-200"
                aria-label="Facebook"
              >
                <FaFacebook className="w-7 h-7" />
              </a>
              <a 
                href="#" 
                className="text-gray-700 hover:text-pink-600 transition-colors duration-200"
                aria-label="Instagram"
              >
                <FaInstagram className="w-7 h-7" />
              </a>
              <a 
                href="#" 
                className="text-gray-700 hover:text-pink-600 transition-colors duration-200"
                aria-label="Twitter"
              >
                <FaTwitter className="w-7 h-7" />
              </a>
            </div>
          </div>
        </div>
        
        {/* Copyright Section */}
        <div className="text-center mt-16 pt-8 border-t border-gray-200">
          <p className="text-gray-600 text-sm">© Copyright 2025 ShaadiSync - All Rights Reserved</p>
        </div>
      </div>
    </footer>
  );
}