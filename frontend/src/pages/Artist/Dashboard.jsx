import React from 'react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    return (
        <div className="p-6 bg-white rounded-lg ">
            <h1 className="text-2xl font-bold text-blue-600 mb-4">Dashboard</h1>
            
            <div className="grid grid-cols-3 gap-6">
                {/* Live Services Card */}
                <div className="p-4 bg-blue-100 rounded-lg shadow">
                    <h2 className="text-lg font-semibold">Live Services</h2>
                    <p className="text-blue-600 text-xl font-bold">5</p>
                </div>
                
                {/* Total Unlocks Today */}
                <div className="p-4 bg-blue-100 rounded-lg shadow">
                    <h2 className="text-lg font-semibold">Total Unlocks Today</h2>
                    <p className="text-blue-600 text-xl font-bold">12</p>
                </div>

                {/* Earnings */}
                <div className="p-4 bg-blue-100 rounded-lg shadow">
                    <h2 className="text-lg font-semibold">Total Earnings</h2>
                    <p className="text-blue-600 text-xl font-bold">₹5000</p>
                </div>
            </div>

            <h2 className="text-xl font-bold text-blue-600 mt-6 mb-4">Available Services</h2>
            <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-100 rounded-lg flex justify-between items-center">
                    <span>Photography</span>
                    <Link to="/services/photography" className="text-blue-600 font-bold">&gt;</Link>
                </div>
                <div className="p-4 bg-gray-100 rounded-lg flex justify-between items-center">
                    <span>Makeup Artist</span>
                    <Link to="/services/makeup" className="text-blue-600 font-bold">&gt;</Link>
                </div>
                <div className="p-4 bg-gray-100 rounded-lg flex justify-between items-center">
                    <span>Decoration</span>
                    <Link to="/services/decoration" className="text-blue-600 font-bold">&gt;</Link>
                </div>
                <div className="p-4 bg-gray-100 rounded-lg flex justify-between items-center">
                    <span>Music Band</span>
                    <Link to="/services/music" className="text-blue-600 font-bold">&gt;</Link>
                </div>
            </div>
            <h1 className="text-2xl font-bold text-blue-600 mb-4">Dashboard</h1>
            
            <div className="grid grid-cols-3 gap-6">
                {/* Live Services Card */}
                <div className="p-4 bg-blue-100 rounded-lg shadow">
                    <h2 className="text-lg font-semibold">Live Services</h2>
                    <p className="text-blue-600 text-xl font-bold">5</p>
                </div>
                
                {/* Total Unlocks Today */}
                <div className="p-4 bg-blue-100 rounded-lg shadow">
                    <h2 className="text-lg font-semibold">Total Unlocks Today</h2>
                    <p className="text-blue-600 text-xl font-bold">12</p>
                </div>

                {/* Earnings */}
                <div className="p-4 bg-blue-100 rounded-lg shadow">
                    <h2 className="text-lg font-semibold">Total Earnings</h2>
                    <p className="text-blue-600 text-xl font-bold">₹5000</p>
                </div>
            </div>

            <h2 className="text-xl font-bold text-blue-600 mt-6 mb-4">Available Services</h2>
            <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-100 rounded-lg flex justify-between items-center">
                    <span>Photography</span>
                    <Link to="/services/photography" className="text-blue-600 font-bold">&gt;</Link>
                </div>
                <div className="p-4 bg-gray-100 rounded-lg flex justify-between items-center">
                    <span>Makeup Artist</span>
                    <Link to="/services/makeup" className="text-blue-600 font-bold">&gt;</Link>
                </div>
                <div className="p-4 bg-gray-100 rounded-lg flex justify-between items-center">
                    <span>Decoration</span>
                    <Link to="/services/decoration" className="text-blue-600 font-bold">&gt;</Link>
                </div>
                <div className="p-4 bg-gray-100 rounded-lg flex justify-between items-center">
                    <span>Music Band</span>
                    <Link to="/services/music" className="text-blue-600 font-bold">&gt;</Link>
                </div>
            </div>
            <h1 className="text-2xl font-bold text-blue-600 mb-4">Dashboard</h1>
            
            <div className="grid grid-cols-3 gap-6">
                {/* Live Services Card */}
                <div className="p-4 bg-blue-100 rounded-lg shadow">
                    <h2 className="text-lg font-semibold">Live Services</h2>
                    <p className="text-blue-600 text-xl font-bold">5</p>
                </div>
                
                {/* Total Unlocks Today */}
                <div className="p-4 bg-blue-100 rounded-lg shadow">
                    <h2 className="text-lg font-semibold">Total Unlocks Today</h2>
                    <p className="text-blue-600 text-xl font-bold">12</p>
                </div>

                {/* Earnings */}
                <div className="p-4 bg-blue-100 rounded-lg shadow">
                    <h2 className="text-lg font-semibold">Total Earnings</h2>
                    <p className="text-blue-600 text-xl font-bold">₹5000</p>
                </div>
            </div>

            <h2 className="text-xl font-bold text-blue-600 mt-6 mb-4">Available Services</h2>
            <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-100 rounded-lg flex justify-between items-center">
                    <span>Photography</span>
                    <Link to="/services/photography" className="text-blue-600 font-bold">&gt;</Link>
                </div>
                <div className="p-4 bg-gray-100 rounded-lg flex justify-between items-center">
                    <span>Makeup Artist</span>
                    <Link to="/services/makeup" className="text-blue-600 font-bold">&gt;</Link>
                </div>
                <div className="p-4 bg-gray-100 rounded-lg flex justify-between items-center">
                    <span>Decoration</span>
                    <Link to="/services/decoration" className="text-blue-600 font-bold">&gt;</Link>
                </div>
                <div className="p-4 bg-gray-100 rounded-lg flex justify-between items-center">
                    <span>Music Band</span>
                    <Link to="/services/music" className="text-blue-600 font-bold">&gt;</Link>
                </div>
            </div>
            <h1 className="text-2xl font-bold text-blue-600 mb-4">Dashboard</h1>
            
            <div className="grid grid-cols-3 gap-6">
                {/* Live Services Card */}
                <div className="p-4 bg-blue-100 rounded-lg shadow">
                    <h2 className="text-lg font-semibold">Live Services</h2>
                    <p className="text-blue-600 text-xl font-bold">5</p>
                </div>
                
                {/* Total Unlocks Today */}
                <div className="p-4 bg-blue-100 rounded-lg shadow">
                    <h2 className="text-lg font-semibold">Total Unlocks Today</h2>
                    <p className="text-blue-600 text-xl font-bold">12</p>
                </div>

                {/* Earnings */}
                <div className="p-4 bg-blue-100 rounded-lg shadow">
                    <h2 className="text-lg font-semibold">Total Earnings</h2>
                    <p className="text-blue-600 text-xl font-bold">₹5000</p>
                </div>
            </div>

            <h2 className="text-xl font-bold text-blue-600 mt-6 mb-4">Available Services</h2>
            <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-100 rounded-lg flex justify-between items-center">
                    <span>Photography</span>
                    <Link to="/services/photography" className="text-blue-600 font-bold">&gt;</Link>
                </div>
                <div className="p-4 bg-gray-100 rounded-lg flex justify-between items-center">
                    <span>Makeup Artist</span>
                    <Link to="/services/makeup" className="text-blue-600 font-bold">&gt;</Link>
                </div>
                <div className="p-4 bg-gray-100 rounded-lg flex justify-between items-center">
                    <span>Decoration</span>
                    <Link to="/services/decoration" className="text-blue-600 font-bold">&gt;</Link>
                </div>
                <div className="p-4 bg-gray-100 rounded-lg flex justify-between items-center">
                    <span>Music Band</span>
                    <Link to="/services/music" className="text-blue-600 font-bold">&gt;</Link>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
