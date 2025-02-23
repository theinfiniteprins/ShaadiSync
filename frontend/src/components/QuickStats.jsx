import React, { useEffect, useState } from 'react';
import { ChevronDown, Package, Users, DollarSign } from 'lucide-react';
import config from '../configs/config';
import axios from 'axios';

const QuickStats = ({ services }) => {
    const [unlockPeriod, setUnlockPeriod] = useState('today');
    const [spendPeriod, setSpendPeriod] = useState('today');
    const [spendStats, setSpendStats] = useState();
    const [unlockStats, setUnlockStats] = useState();


    useEffect(() => {
        const token = localStorage.getItem('artistToken');
        const fetchSpendMoney = async () => {
            try {
                const response = await axios.get(
                    `${config.baseUrl}/api/artist-transactions/artist/list`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setSpendStats(response.data);

            } catch (error) {
                console.error('Error fetching ratings:', error);
            }
        };
        const fetchUnlock = async () => {
            try {
                const response = await axios.get(
                    `${config.baseUrl}/api/user-unlock-service/artist/getUnlockStats`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setUnlockStats(response.data);

            } catch (error) {
                console.error('Error fetching ratings:', error);
            }
        };
        fetchSpendMoney();
        fetchUnlock();

    }, []);

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {/* Live Services - No dropdown needed */}
            <div className="p-6 bg-white rounded-lg shadow-md">
                <div className="flex items-center justify-between mb-2">
                    <h2 className="text-lg font-semibold text-gray-800">Live Services</h2>
                    <Package className="w-5 h-5 text-blue-600" />
                </div>
                <p className="text-blue-600 text-2xl font-bold">{services.length}</p>
            </div>

            {/* Total Unlocks with Dropdown */}
            <div className="p-6 bg-white rounded-lg shadow-md">
                <div className="flex items-center justify-between mb-2">
                    <h2 className="text-lg font-semibold text-gray-800">Total Unlocks</h2>
                    <div className="relative">
                        <button
                            className="flex items-center text-sm text-gray-600 hover:text-gray-800 focus:outline-none"
                            onClick={() => {
                                const dropdown = document.getElementById('unlocks-dropdown');
                                dropdown.classList.toggle('hidden');
                            }}
                        >
                            <span className="capitalize">
                                {unlockPeriod === 'today' ? 'Today' :
                                    unlockPeriod === 'lastWeek' ? 'Last Week' :
                                        unlockPeriod === 'lastMonth' ? 'Last Month' : 'Last Year'}
                            </span>
                            <ChevronDown className="w-4 h-4 ml-1" />
                        </button>
                        <div
                            id="unlocks-dropdown"
                            className="hidden absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg py-2 z-10"
                        >
                            {['today', 'lastWeek', 'lastMonth', 'lastYear'].map((period) => (
                                <button
                                    key={period}
                                    className={`block w-full text-left px-4 py-2 text-sm ${unlockPeriod === period ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'
                                        }`}
                                    onClick={() => {
                                        setUnlockPeriod(period);
                                        document.getElementById('unlocks-dropdown').classList.add('hidden');
                                    }}
                                >
                                    {period === 'today' ? 'Today' :
                                        period === 'lastWeek' ? 'Last Week' :
                                            period === 'lastMonth' ? 'Last Month' : 'Last Year'}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="flex items-center">
                    <Users className="w-5 h-5 text-blue-600 mr-2" />
                    <p className="text-blue-600 text-2xl font-bold">{unlockStats?.[unlockPeriod] || 0}</p>
                </div>
            </div>

            {/* Total Earnings with Dropdown */}
            <div className="p-6 bg-white rounded-lg shadow-md">
                <div className="flex items-center justify-between mb-2">
                    <h2 className="text-lg font-semibold text-gray-800">Spend Money</h2>
                    <div className="relative">
                        <button
                            className="flex items-center text-sm text-gray-600 hover:text-gray-800 focus:outline-none"
                            onClick={() => {
                                const dropdown = document.getElementById('spend-dropdown');
                                dropdown.classList.toggle('hidden');
                            }}
                        >
                            <span className="capitalize">
                                {spendPeriod === 'today' ? 'Today' :
                                    spendPeriod === 'lastWeek' ? 'Last Week' :
                                        spendPeriod === 'lastMonth' ? 'Last Month' : 'Last Year'}
                            </span>
                            <ChevronDown className="w-4 h-4 ml-1" />
                        </button>
                        <div
                            id="spend-dropdown"
                            className="hidden absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg py-2 z-10"
                        >
                            {['today', 'lastWeek', 'lastMonth', 'lastYear'].map((period) => (
                                <button
                                    key={period}
                                    className={`block w-full text-left px-4 py-2 text-sm ${spendPeriod === period ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'
                                        }`}
                                    onClick={() => {
                                        setSpendPeriod(period);
                                        document.getElementById('spend-dropdown').classList.add('hidden');
                                    }}
                                >
                                    {period === 'today' ? 'Today' :
                                        period === 'lastWeek' ? 'Last Week' :
                                            period === 'lastMonth' ? 'Last Month' : 'Last Year'}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="flex items-center">
                    <p className="text-blue-600 text-2xl font-bold">
                        ₹ {spendStats?.[spendPeriod] || 0}
                    </p>

                </div>
            </div>
        </div>
    );
};

export default QuickStats;