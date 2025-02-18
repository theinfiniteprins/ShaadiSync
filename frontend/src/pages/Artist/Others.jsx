import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    FaUserCog, FaFlask, FaImage, FaCrown, FaStar, FaClipboardCheck,
    FaQuestionCircle, FaFileContract, FaShieldAlt, FaTrashAlt, FaSignOutAlt
} from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";

const tabs = [
    { name: "Reviews and Ratings", icon: <FaStar />, link: "/artist/reviews-ratings" },
    { name: "Customer review policy", icon: <FaClipboardCheck />, link: "/review-policy" },
    { name: "FAQ", icon: <FaQuestionCircle />, link: "/faq" },
    { name: "Terms and conditions", icon: <FaFileContract />, link: "/terms" },
    { name: "Privacy policy", icon: <FaShieldAlt />, link: "/privacy" },
    { name: "Delete Account", icon: <FaTrashAlt />, link: "/delete-account" },
];

const Others = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout(); // Call logout function from AuthContext
        navigate("/artist/login"); // Redirect user to login page after logout
    };

    return (
        <div className="p-6 bg-white rounded-lg">
            <div className="space-y-3">
                {tabs.map((tab, index) => (
                    <Link
                        key={index}
                        to={tab.link}
                        className="flex items-center justify-between p-4 bg-gray-100 rounded-lg shadow hover:bg-gray-200 transition"
                    >
                        <div className="flex items-center gap-3">
                            <span className="text-gray-600 text-lg">{tab.icon}</span>
                            <span className="text-gray-800 font-medium">{tab.name}</span>
                        </div>
                        <span className="text-gray-500">&gt;</span>
                    </Link>
                ))}
                {/* Logout Button */}
                <button
                    onClick={handleLogout}
                    className="flex items-center justify-between w-full p-4 bg-gray-100 text-red-600 rounded-lg shadow hover:bg-gray-200 transition"
                >
                    <div className="flex items-center gap-3">
                        <FaSignOutAlt className="text-lg" />
                        <span className="font-medium">Logout</span>
                    </div>
                    <span>&gt;</span>
                </button>
            </div>
        </div>
    );
};

export default Others;
