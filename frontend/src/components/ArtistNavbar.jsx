import React from 'react';
import logo from "../assets/ShaadiSync.png";
const ArtistNavbar = () => {
  return (
    <nav className="w-full h-22 fixed bg-white shadow-md flex items-center px-6">
  
        <img src={logo} alt="ShaadiSync Logo" className="h-10 scale-[5] ml-50" />
    </nav>
  );
};

export default ArtistNavbar;
