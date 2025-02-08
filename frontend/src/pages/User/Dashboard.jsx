import React from "react";
import dashboard_img from "../../assets/delhi_bg.webp";
import SearchBar from "../../components/SearchBar"; // Importing the SearchBar component

const Dashboard = () => {
  return (
    <div>
      <div className="relative w-full h-[72vh]">
        {/* Background Image */}
        <img
          src={dashboard_img}
          alt="Wedding"
          className="w-full h-full object-cover"
        />

        {/* Gradient Overlay (Black fade at the bottom) */}
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black to-transparent"></div>

        {/* Overlay Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 mt-64">
          <h1 className="text-white text-5xl font-bold mb-4">
            Plan Your Dream Wedding
          </h1>
          <p className="text-white text-lg mb-6">
            Find the best vendors & artists for your special day.
          </p>

          {/* Search Bar */}
          <div className="w-full max-w-3xl">
            <SearchBar /> {/* Reusing the SearchBar component */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
