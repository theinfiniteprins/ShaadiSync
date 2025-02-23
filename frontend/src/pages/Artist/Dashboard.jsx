import React from 'react';
import { Link } from 'react-router-dom';
import { FaBell, FaChartLine, FaCalendarAlt, FaUserCircle, FaStar } from 'react-icons/fa';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const Dashboard = () => {
    // Dummy data (replace with actual data fetching if needed)
    const services = [
        { name: 'Photography', link: '/services/photography' },
        { name: 'Makeup Artist', link: '/services/makeup' },
        { name: 'Decoration', link: '/services/decoration' },
        { name: 'Music Band', link: '/services/music' }
    ];

    const upcomingEvents = [
        { date: '2023-10-15', event: 'Wedding Photography', location: 'New York' },
        { date: '2023-10-20', event: 'Bridal Makeup', location: 'Los Angeles' }
    ];

    const recentActivity = [
        { type: 'Booking', details: 'New booking for Wedding Photography', time: '2 hours ago' },
        { type: 'Message', details: 'New message from John Doe', time: '5 hours ago' },
        { type: 'Review', details: 'New review received', time: '1 day ago' }
    ];

    const earningsData = [
        { month: 'Jan', earnings: 4000 },
        { month: 'Feb', earnings: 3000 },
        { month: 'Mar', earnings: 5000 },
        { month: 'Apr', earnings: 7000 },
        { month: 'May', earnings: 6000 },
        { month: 'Jun', earnings: 8000 }
    ];

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            {/* Navigation Bar */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-blue-600">Artist Dashboard</h1>
                <div className="flex items-center">
                    <FaBell className="text-xl text-gray-600 mr-4 cursor-pointer" />
                    <FaUserCircle className="text-xl text-gray-600 cursor-pointer" />
                </div>
            </div>

            {/* Profile Summary */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                <div className="flex items-center">
                    <img src="https://via.placeholder.com/150" alt="Profile" className="w-16 h-16 rounded-full" />
                    <div className="ml-4">
                        <h2 className="text-xl font-bold">John Doe</h2>
                        <div className="flex items-center">
                            <FaStar className="text-yellow-500" />
                            <span className="ml-2 text-gray-600">4.8 (120 reviews)</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="p-6 bg-white rounded-lg shadow-md">
                    <h2 className="text-lg font-semibold">Live Services</h2>
                    <p className="text-blue-600 text-2xl font-bold">5</p>
                </div>
                <div className="p-6 bg-white rounded-lg shadow-md">
                    <h2 className="text-lg font-semibold">Total Unlocks Today</h2>
                    <p className="text-blue-600 text-2xl font-bold">12</p>
                </div>
                <div className="p-6 bg-white rounded-lg shadow-md">
                    <h2 className="text-lg font-semibold">Total Earnings</h2>
                    <p className="text-blue-600 text-2xl font-bold">₹5000</p>
                </div>
            </div>

            {/* Analytics Section */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                <h2 className="text-xl font-bold text-blue-600 mb-4">Earnings Overview</h2>
                <BarChart width={600} height={300} data={earningsData}>
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
                    <Bar dataKey="earnings" fill="#3b82f6" />
                </BarChart>
            </div>

            {/* Upcoming Events */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                <h2 className="text-xl font-bold text-blue-600 mb-4">Upcoming Events</h2>
                <div className="space-y-4">
                    {upcomingEvents.map((event, index) => (
                        <div key={index} className="p-4 bg-gray-50 rounded-lg flex justify-between items-center">
                            <div>
                                <h3 className="font-semibold">{event.event}</h3>
                                <p className="text-sm text-gray-600">{event.date} | {event.location}</p>
                            </div>
                            <FaCalendarAlt className="text-gray-600" />
                        </div>
                    ))}
                </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                <h2 className="text-xl font-bold text-blue-600 mb-4">Recent Activity</h2>
                <div className="space-y-4">
                    {recentActivity.map((activity, index) => (
                        <div key={index} className="p-4 bg-gray-50 rounded-lg">
                            <h3 className="font-semibold">{activity.type}</h3>
                            <p className="text-sm text-gray-600">{activity.details}</p>
                            <p className="text-xs text-gray-500">{activity.time}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Available Services */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-bold text-blue-600 mb-4">Available Services</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {services.map((service, index) => (
                        <div key={index} className="p-4 bg-gray-50 rounded-lg flex justify-between items-center">
                            <span>{service.name}</span>
                            <Link to={service.link} className="text-blue-600 font-bold">&gt;</Link>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Dashboard;