import React, { useEffect, useState } from 'react';
import { FaPlus, FaWallet, FaArrowDown, FaHistory, FaArrowUp, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import config from './../../configs/config';

const Wallet = () => {
    const [balance, setBalance] = useState(0);
    const [totalSpend, setTotalSpend] = useState(0);
    const [transactions, setTransactions] = useState([]);
    const [showHistory, setShowHistory] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const transactionsPerPage = 5;

    useEffect(() => {
        const token = localStorage.getItem("artistToken");

        const fetchBalance = async () => {
            try {
                const response = await fetch(`${config.baseUrl}/api/artists/viewbalance/balance`, {
                    method: "GET",
                    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }
                });
                const data = await response.json();
                setBalance(data?.balance || 0);
            } catch (error) {
                console.error("Error fetching balance:", error);
                setBalance(0);
            }
        };

        const fetchTotalSpend = async () => {
            try {
                const response = await fetch(`${config.baseUrl}/api/artist-transactions/total-debited-amount/amount`, {
                    method: "GET",
                    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }
                });
                const data = await response.json();
                setTotalSpend(data?.totalDebited || 0);
            } catch (error) {
                console.error("Error fetching total spend:", error);
                setTotalSpend(0);
            }
        };

        const fetchTransactions = async () => {
            try {
                const response = await fetch(`${config.baseUrl}/api/artist-transactions/artist/getbyId`, {
                    method: "GET",
                    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }
                });
                const data = await response.json();
                setTransactions(data.transactions || []);
            } catch (error) {
                console.error("Error fetching transactions:", error);
            }
        };

        fetchBalance();
        fetchTotalSpend();
        fetchTransactions();
    }, []);

    const handleToggleHistory = () => {
        setShowHistory(!showHistory);
    };

    const totalPages = Math.ceil(transactions.length / transactionsPerPage);
    const currentTransactions = transactions.slice((currentPage - 1) * transactionsPerPage, currentPage * transactionsPerPage);

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    return (
        <div className="p-6 min-h-screen flex flex-col items-center">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 w-full max-w-3xl">
                {[{ title: "Wallet Balance", amount: balance, color: "bg-blue-500", icon: <FaWallet /> },
                { title: "Total Spent", amount: totalSpend, color: "bg-red-500", icon: <FaArrowDown /> }]
                .map((item, index) => (
                    <div key={index} className={`${item.color} text-white p-6 rounded-xl shadow-lg flex flex-col items-center`}>
                        <div className="text-4xl opacity-90">{item.icon}</div>
                        <h2 className="text-lg font-medium mt-2">{item.title}</h2>
                        <p className="text-3xl font-bold mt-1">{item.amount}</p>
                    </div>
                ))}
            </div>
            <div className="bg-white p-6 rounded-xl w-full">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">Transactions</h2>

                {[
                    { text: "Add Money", color: "bg-blue-600", icon: <FaPlus /> },
                    { text: "Withdraw Money", color: "bg-green-600", icon: <FaArrowDown /> }
                ].map((item, index) => (
                    <div
                        key={index}
                        className="flex justify-between items-center p-4 bg-gray-100 rounded-lg shadow-sm mb-3 hover:shadow-md transition duration-200"
                    >
                        <span className="text-gray-800 text-lg">{item.text}</span>
                        <button className={`${item.color} text-white px-5 py-2 rounded-lg flex items-center gap-2 hover:opacity-90 transition`}>
                            {item.icon} {item.text.split(" ")[0]}
                        </button>
                    </div>
                ))}
                </div>

            <div className="bg-white p-6 rounded-xl w-full">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">Transactions</h2>
                <div className="flex justify-between items-center p-4 bg-gray-200 rounded-lg shadow-sm cursor-pointer hover:bg-gray-300 transition duration-200" onClick={handleToggleHistory}>
                    <span className="text-gray-800 text-lg">See Transaction History</span>
                    <FaHistory className="text-gray-600 text-xl" />
                </div>

                {showHistory && (
                    <div className="bg-white rounded-2xl shadow-lg p-8 mt-4">
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center">
                                <FaHistory className="text-2xl text-pink-500 mr-3" />
                                <h2 className="text-2xl font-bold text-gray-900">Transaction History</h2>
                            </div>
                        </div>

                        <div className="space-y-4 mb-6">
                            {currentTransactions.length === 0 ? (
                                <div className="text-center py-8">
                                    <div className="text-gray-400 text-6xl mb-4">💰</div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Transactions Yet</h3>
                                    <p className="text-gray-600">Your transaction history will appear here</p>
                                </div>
                            ) : (
                                currentTransactions.map((tx) => (
                                    <div key={tx._id} className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:shadow-md transition-all duration-200">
                                        <div className="flex items-center space-x-4">
                                            <div className={`p-3 rounded-full ${tx.type === "credit" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}>
                                                {tx.type === "credit" ? <FaArrowUp className="text-lg" /> : <FaArrowDown className="text-lg" />}
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-gray-900 mb-1">{tx.description}</h3>
                                                <p className="text-sm text-gray-500">{new Date(tx.createdAt).toLocaleString()}</p>
                                            </div>
                                        </div>
                                        <div className={`${tx.type === "credit" ? "text-green-600" : "text-red-600"}`}>
                                            <span className="text-lg font-bold">{tx.type === "credit" ? "+" : "-"}{tx.amount}</span>
                                            <span className="text-sm ml-1 font-medium">Coins</span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {transactions.length > transactionsPerPage && (
                            <div className="flex items-center justify-center space-x-2 pt-4 border-t border-gray-100">
                                <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className="p-2 rounded-lg text-gray-600 hover:bg-pink-50 disabled:text-gray-300">
                                    <FaChevronLeft className="text-lg" />
                                </button>
                                <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className="p-2 rounded-lg text-gray-600 hover:bg-pink-50 disabled:text-gray-300">
                                    <FaChevronRight className="text-lg" />
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Wallet;