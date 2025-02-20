import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    FaStar, FaFileContract, FaShieldAlt, FaSignOutAlt
} from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";

const tabs = [
    { 
        name: "Reviews and Ratings", 
        icon: <FaStar className="text-yellow-500" />, 
        link: "/artist/reviews-ratings",
        description: "View your performance and feedback"
    },
    { 
        name: "Terms and conditions", 
        icon: <FaFileContract className="text-blue-500" />, 
        link: "/artist/terms&condition",
        description: "Read our terms of service"
    },
    { 
        name: "Privacy policy", 
        icon: <FaShieldAlt className="text-green-500" />, 
        link: "/artist/privacy-policy",
        description: "Learn about data protection"
    },
];

const Others = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        if (window.confirm('Are you sure you want to logout?')) {
            logout();
            navigate("/artist/login");
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-2xl font-bold text-gray-900 mb-6">Settings & More</h1>
                
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <div className="divide-y divide-gray-200">
                        {tabs.map((tab, index) => (
                            <Link
                                key={index}
                                to={tab.link}
                                className="block hover:bg-gray-50 transition-all duration-200 transform hover:scale-[0.995]"
                            >
                                <div className="p-6">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0">
                                            <div className="h-12 w-12 bg-gray-100 rounded-lg flex items-center justify-center">
                                                <span className="text-xl">{tab.icon}</span>
                                            </div>
                                        </div>
                                        <div className="ml-4 flex-1">
                                            <h2 className="text-lg font-medium text-gray-900">
                                                {tab.name}
                                            </h2>
                                            <p className="mt-1 text-sm text-gray-500">
                                                {tab.description}
                                            </p>
                                        </div>
                                        <div className="ml-4">
                                            <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Logout Button */}
                <button
                    onClick={handleLogout}
                    className="mt-6 w-full bg-white hover:bg-red-50 text-red-600 rounded-xl shadow-sm p-6 flex items-center justify-between transition-all duration-200 transform hover:scale-[0.995]"
                >
                    <div className="flex items-center">
                        <div className="h-12 w-12 bg-red-100 rounded-lg flex items-center justify-center">
                            <FaSignOutAlt className="text-xl" />
                        </div>
                        <div className="ml-4">
                            <h2 className="text-lg font-medium">Logout</h2>
                            <p className="mt-1 text-sm text-gray-500">
                                Sign out of your account
                            </p>
                        </div>
                    </div>
                    <svg className="h-6 w-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default Others;
