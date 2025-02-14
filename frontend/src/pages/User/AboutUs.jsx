import React, { useState, useEffect } from 'react';
import { 
  FaUsers, FaHandshake, FaStar, FaEnvelope, FaHeart, 
  FaShieldAlt, FaAward, FaGem, FaChartLine, FaUserTie 
} from 'react-icons/fa';

export default function AboutUs() {
  const [activeTab, setActiveTab] = useState('overview');

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const tabs = {
    overview: {
      icon: <FaHeart />,
      title: "Overview",
      content: {
        main: "India's premier wedding planning platform, connecting couples with trusted vendors.",
        points: [
          "Established in 2024",
          "Pan-India presence",
          "10,000+ vendors",
          "50,000+ couples"
        ]
      }
    },
    mission: {
      icon: <FaGem />,
      title: "Mission",
      content: {
        main: "Making wedding planning stress-free, enjoyable, and memorable for every couple.",
        points: [
          "Vendor discovery",
          "Price transparency",
          "Quality assurance",
          "24/7 support"
        ]
      }
    },
    services: {
      icon: <FaAward />,
      title: "Services",
      content: {
        main: "Comprehensive wedding planning solutions for modern couples.",
        points: [
          "Vendor booking",
          "Budget planning",
          "Checklists",
          "Inspiration"
        ]
      }
    },
    team: {
      icon: <FaUserTie />,
      title: "Team",
      content: {
        main: "Industry experts with decades of wedding planning experience.",
        points: [
          "Expert planners",
          "Tech innovators",
          "Support team",
          "Quality control"
        ]
      }
    },
    growth: {
      icon: <FaChartLine />,
      title: "Growth",
      content: {
        main: "Rapidly expanding across India with focus on satisfaction.",
        points: [
          "20+ cities",
          "95% satisfied",
          "4.8/5 rating",
          "25% monthly"
        ]
      }
    }
  };

  return (
    <div className="h-screen bg-gradient-to-b from-pink-50 to-white py-5 px-4 select-none">
      <div className="container mx-auto max-w-6xl h-full flex flex-col">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900">About Us</h1>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap justify-center gap-3 mb-5">
          {Object.entries(tabs).map(([key, { icon, title }]) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex items-center px-4 py-2 rounded-lg text-base font-medium transition-colors cursor-pointer
                ${activeTab === key 
                  ? 'bg-pink-600 text-white' 
                  : 'bg-white text-gray-600 hover:bg-gray-50'}`}
            >
              <span className="mr-2 text-lg">{icon}</span>
              {title}
            </button>
          ))}
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 flex-grow">
          {/* Left Column - Main Content */}
          <div className="bg-white rounded-xl shadow-md p-5 cursor-default flex flex-col">
            <div className="flex items-center mb-3">
              <span className="text-2xl text-pink-600 mr-3">
                {tabs[activeTab].icon}
              </span>
              <h2 className="text-2xl font-bold text-gray-800">
                {tabs[activeTab].title}
              </h2>
            </div>
            <p className="text-lg text-gray-700 mb-4 leading-relaxed">
              {tabs[activeTab].content.main}
            </p>
            <ul className="space-y-2.5">
              {tabs[activeTab].content.points.map((point, idx) => (
                <li key={idx} className="flex items-center text-base text-gray-600">
                  <span className="w-2 h-2 bg-pink-600 rounded-full mr-3"></span>
                  {point}
                </li>
              ))}
            </ul>
          </div>

          {/* Right Column - Stats & Highlights */}
          <div className="grid grid-cols-2 gap-5">
            <div className="bg-white rounded-xl shadow-md p-4 flex flex-col justify-center items-center cursor-default">
              <FaUsers className="text-2xl text-pink-600 mb-2" />
              <h3 className="text-xl font-bold text-gray-800">50,000+</h3>
              <p className="text-base text-gray-600">Happy Couples</p>
            </div>
            <div className="bg-white rounded-xl shadow-md p-4 flex flex-col justify-center items-center cursor-default">
              <FaHandshake className="text-2xl text-pink-600 mb-2" />
              <h3 className="text-xl font-bold text-gray-800">10,000+</h3>
              <p className="text-base text-gray-600">Verified Vendors</p>
            </div>
            <div className="bg-white rounded-xl shadow-md p-4 flex flex-col justify-center items-center cursor-default">
              <FaStar className="text-2xl text-pink-600 mb-2" />
              <h3 className="text-xl font-bold text-gray-800">4.8/5</h3>
              <p className="text-base text-gray-600">Average Rating</p>
            </div>
            <div className="bg-white rounded-xl shadow-md p-4 flex flex-col justify-center items-center cursor-default">
              <FaShieldAlt className="text-2xl text-pink-600 mb-2" />
              <h3 className="text-xl font-bold text-gray-800">100%</h3>
              <p className="text-base text-gray-600">Secure Platform</p>
            </div>
          </div>
        </div>

        {/* Contact Footer */}
        <div className="flex justify-center items-center mt-4">
          <div className="inline-flex items-center text-base text-gray-600 cursor-default">
            <FaEnvelope className="text-pink-600 mr-2" />
            Contact us at{' '}
            <a href="mailto:hello@shaadisync.com" className="text-pink-600 hover:underline ml-1 cursor-pointer">
              hello@shaadisync.com
            </a>
          </div>
        </div>
      </div>
    </div>
  );
} 