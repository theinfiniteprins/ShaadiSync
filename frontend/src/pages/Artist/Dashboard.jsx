import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaStar } from 'react-icons/fa';
// import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import config from './../../configs/config';
import { toast } from 'react-hot-toast';
import LeadsOverviewChart from '../../components/LeadsOverviewChats';
import QuickStats from '../../components/QuickStats';
import VerificationPrompt from '../../components/VerificationPrompt';
import VerificationPendingPrompt from '../../components/VerificationPendingPrompt';

const Dashboard = () => {
    const [services, setServices] = useState([]);
    const [liveservices, setLiveServices] = useState([]);
    const [latestService, setLatestService] = useState(null);
    const [latestLead, setLatestLead] = useState(null);
    const [LatestReview, setLatestReview] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [artist, setArtist] = useState(null);
    const [averageRating, setAverageRating] = useState(0);
    const [totalReviews, setTotalReviews] = useState(0);
    const [leadsData, setLeadsData] = useState([]);
    const navigate = useNavigate();
    console.log(artist);
    

    const timeAgo = (timestamp) => {
        const now = new Date();
        const past = new Date(timestamp);
        const diffInSeconds = Math.floor((now - past) / 1000);

        if (diffInSeconds < 60) return `${diffInSeconds} sec ago`;
        const diffInMinutes = Math.floor(diffInSeconds / 60);
        if (diffInMinutes < 60) return `${diffInMinutes} min ago`;
        const diffInHours = Math.floor(diffInMinutes / 60);
        if (diffInHours < 24) return `${diffInHours} hrs ago`;
        const diffInDays = Math.floor(diffInHours / 24);
        return `${diffInDays} days ago`;
    };
    useEffect(() => {
        const token = localStorage.getItem('artistToken');

        const fetchServices = async () => {
            try {
                setLoading(true);
                const response = await axios.get(
                    `${config.baseUrl}/api/services/artist/getbyid`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setServices(response.data)
                const liveServices = response.data.filter(service => service.isLive );
                setLiveServices(liveServices);
            } catch (err) {
                setError('Failed to fetch services');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        const fetchArtistProfile = async () => {
            try {
                const response = await axios.get(
                    `${config.baseUrl}/api/artists/me`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setArtist(response.data);
            } catch (error) {
                console.error('Error fetching profile:', error);
                if (error.response?.status === 401) {
                    localStorage.removeItem('artistToken');
                    toast.error('Session expired. Please login again');
                    navigate('/artist/login');
                } else {
                    toast.error('Failed to load profile');
                }
            } finally {
                setLoading(false);
            }
        };

        const fetchLatestService = async () => {
            try {
                const response = await axios.get(
                    `${config.baseUrl}/api/services/artist/latestService`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setLatestService(response.data);
            } catch (err) {
                setError(err.response?.data?.message || "Failed to fetch latest service");
            } finally {
                setLoading(false);
            }
        };
        const fetchLatestLead = async () => {
            try {
                const response = await axios.get(
                    `${config.baseUrl}/api/user-unlock-service/artist/getLatestLead`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setLatestLead(response.data);
            } catch (err) {
                setError(err.response?.data?.message || "Failed to fetch latest service");
            } finally {
                setLoading(false);
            }
        };
        
        const fetchLatestReview = async () => {
            try {
                const response = await axios.get(
                    `${config.baseUrl}/api/reviews/artistreview/get-rating`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setLatestReview(response.data[0]);
            } catch (err) {
                setError(err.response?.data?.message || "Failed to fetch latest service");
            } finally {
                setLoading(false);
            }
        };

        const fetchLeadsData = async () => {
            try {
                const response = await axios.get(
                    `${config.baseUrl}/api/user-unlock-service/artist/getLeadsGraph`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );

                // Transform API data to match chart structure
                const formattedData = response.data.map(item => ({
                    month: item.month,
                    leads: item.totalLeads
                }));
                

                setLeadsData(formattedData);
            } catch (err) {
                console.error("Error fetching leads data:", err);
                toast.error("Failed to fetch leads data");
            }
        };

        
        fetchServices();
        fetchArtistProfile();
        fetchLatestService();
        fetchLatestLead();
        fetchLatestReview();
        fetchLeadsData();
    }, []);

    useEffect(() => {
        if (artist?._id) {
            const fetchRatings = async () => {
                try {
                    const response = await axios.get(
                        `${config.baseUrl}/api/reviews/get-rating/${artist._id}`
                    );
                    setAverageRating(response.data.averageRating || 0);
                    setTotalReviews(response.data.totalReviews || 0);
                } catch (error) {
                    console.error('Error fetching ratings:', error);
                }
            };
            fetchRatings();
        }
    }, [artist]);

    if (artist && artist.verificationStatus === 'pending' && !artist.isVerified) {
        return <VerificationPendingPrompt />;
    }

    if (artist && !artist.isVerified) {
        return <VerificationPrompt />;
    }


    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            {/* Navigation Bar */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-blue-600">Artist Dashboard</h1>
            </div>

            {/* Profile Summary */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                <div className="flex items-center">
                    <img src={artist?.profilePic || "https://via.placeholder.com/150"} alt="Profile" className="w-16 h-16 rounded-full" />
                    <div className="ml-4">
                        <h2 className="text-xl font-bold">{artist?.name || "Loading..."}</h2>
                        <div className="flex items-center">
                            <FaStar className="text-yellow-500" />
                            <span className="ml-2 text-gray-600">{averageRating} ({totalReviews} reviews)</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Stats */}
            <QuickStats services={liveservices} />

            {/* Analytics Section */}
           <LeadsOverviewChart data={leadsData}/>

            {/* Recent Activity */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                <h2 className="text-xl font-bold text-blue-600 mb-4">Recent Activity</h2>
                <div className="space-y-4">
                    {/* Latest Service */}
                    {latestService && (
                        <Link to={`/artist/service/${latestService._id}`} className="block">
                            <div className="p-4 bg-gray-100 rounded-lg hover:bg-gray-200 transition">
                                <h3 className="text-lg font-semibold text-blue-700">Latest Service</h3>
                                <p className="text-sm">{latestService.name}</p>
                                <p className="text-sm">Price : {latestService.price}</p>
                                <p className="text-sm text-gray-500">Added {timeAgo(latestService.createdAt)}</p>
                            </div>
                        </Link>
                    )}
                    {/* Latest Lead (Static) */}
                    {latestLead && (
                        <Link to={`/artist/leads/${latestLead?.serviceId}`} className="block">
                            <div className="p-4 bg-gray-100 rounded-lg hover:bg-gray-200 transition">
                                <h3 className="text-lg font-semibold text-blue-700">Latest Lead</h3>
                                <p className="text-sm">
                                    New inquiry from <strong>{latestLead?.user?.name}</strong> for a service <strong>{latestLead?.service?.name}</strong>.
                                </p>
                                <p className="text-sm text-gray-500">
                                    Added {timeAgo(latestLead?.unlockedAt)}
                                </p>
                            </div>
                        </Link>
                    )}

                    {/* Latest Review (Static) */}
                    <div className="p-4 bg-gray-100 rounded-lg">
                        <h3 className="text-lg font-semibold text-blue-700">Latest Review</h3>
                        <p className="text-sm">{LatestReview?.userId?.name}</p>
                        <p className="text-sm">"{LatestReview?.reviewText}"</p>
                        <p className="text-sm text-gray-500">
                                    Added {timeAgo(LatestReview?.createdAt)}
                                </p>
                    </div>

                </div>
            </div>

            {/* Available Services */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-bold text-blue-600 mb-4">Available Services</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {services.map((service, index) => (
                        <Link
                            key={index}
                            to={`/artist/service/${service._id}`}
                            className="p-4 bg-gray-50 rounded-lg flex justify-between items-center hover:bg-gray-100 transition"
                        >
                            <span>{service.name}</span>
                        </Link>
                    ))}
                </div>
            </div>
        </div >
    );
}

export default Dashboard;
