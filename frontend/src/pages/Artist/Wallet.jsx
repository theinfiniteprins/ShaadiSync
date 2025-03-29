import React, { useEffect, useState } from 'react';
import { FaPlus, FaWallet, FaArrowDown, FaHistory, FaArrowUp, FaChevronLeft, FaChevronRight, FaSpinner, FaPalette, FaBrush } from 'react-icons/fa';
import config from './../../configs/config';
import toast from 'react-hot-toast';

const Wallet = () => {
    const [balance, setBalance] = useState(0);
    const [totalSpend, setTotalSpend] = useState(0);
    const [transactions, setTransactions] = useState([]);
    const [showHistory, setShowHistory] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true); // Added loading state
    const transactionsPerPage = 5;

    const fetchData = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("artistToken");
            await Promise.all([
                // Fetch balance
                fetch(`${config.baseUrl}/api/artists/viewbalance/balance`, {
                    headers: { Authorization: `Bearer ${token}` }
                }).then(res => res.json())
                    .then(data => setBalance(data?.balance || 0)),
                
                // Fetch total spend
                fetch(`${config.baseUrl}/api/artist-transactions/total-debited-amount/amount`, {
                    headers: { Authorization: `Bearer ${token}` }
                }).then(res => res.json())
                    .then(data => setTotalSpend(data?.totalDebited || 0)),
                
                // Fetch transactions
                fetch(`${config.baseUrl}/api/artist-transactions/artist/myTransaction`, {
                    headers: { Authorization: `Bearer ${token}` }
                }).then(res => res.json())
                    .then(data => setTransactions(data || []))
            ]);
        } catch (error) {
            console.error("Error fetching data:", error);
            toast.error("Failed to update wallet information");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
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
    const [showAddMoneyModal, setShowAddMoneyModal] = useState(false);
    const [showWithdrawModal, setShowWithdrawModal] = useState(false);
    const [amount, setAmount] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('stripe');

    const handleAddMoney = async () => {
        if (!amount || amount <= 0) return;

        try {
            const token = localStorage.getItem('artistToken');
            if (!token) {
                console.error('No token found');
                return;
            }

            const response = await fetch(`${config.baseUrl}/api/payment/create-checkout-session`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    amount: Number(amount),
                    paymentType: 'artistDeposit'
                })
            });

            if (!response.ok) {
                throw new Error('Failed to create checkout session');
            }

            const { url } = await response.json();
            
            // Redirect to Stripe checkout
            window.location.href = url;
            
        } catch (error) {
            console.error('Payment error:', error);
            // TODO: Add error notification here
        }
    };

    // Add this new handler function
    const handleWithdraw = async () => {
        if (!amount || amount <= 0 || amount > balance) return;

        const loadingToast = toast.loading('Processing withdrawal...');

        try {
            const token = localStorage.getItem('artistToken');
            if (!token) {
                toast.error('Authentication required', { id: loadingToast });
                return;
            }

            const response = await fetch(`${config.baseUrl}/api/payment/withdraw`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    amount: Number(amount),
                    paymentMethod
                })
            });

            if (!response.ok) {
                throw new Error('Failed to process withdrawal');
            }

            await response.json();
            
            // Close modal and reset form
            setShowWithdrawModal(false);
            setAmount('');
            setPaymentMethod('bank');

            // Refresh wallet data immediately
            await fetchData();

            toast.success('Withdrawal processed successfully', { id: loadingToast });
            
        } catch (error) {
            console.error('Withdrawal error:', error);
            toast.error(error.message || 'Failed to process withdrawal', { id: loadingToast });
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-purple-50 to-blue-50 p-6">
            {/* Artistic Header */}
            <div className="max-w-3xl mx-auto mb-8">
                <div className="flex items-center gap-4 mb-6">
                    <FaPalette className="text-4xl text-purple-600" />
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
                        Artist Wallet
                    </h1>
                </div>

                {/* Balance Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    {[{ title: "Wallet Balance", amount: balance, icon: <FaWallet className="text-3xl" /> },
                    { title: "Total Spent", amount: totalSpend, icon: <FaBrush className="text-3xl" /> }].map((item, index) => (
                        <div key={index} className="bg-white p-6 rounded-2xl shadow-artistic hover:shadow-lg transition-all duration-300">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-600 text-sm">{item.title}</p>
                                    <p className="text-3xl font-bold text-gray-900 mt-2">₹{item.amount}</p>
                                </div>
                                <div className="p-4 bg-purple-100 rounded-xl">
                                    {item.icon}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Action Buttons */}
                <div className="bg-white p-6 rounded-2xl shadow-artistic mb-8">
                    <h2 className="text-xl font-semibold mb-6 text-gray-800">Quick Actions</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <button 
                            onClick={() => setShowAddMoneyModal(true)}
                            className="p-4 bg-gradient-to-r from-purple-600 to-blue-500 text-white rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-all"
                        >
                            <FaPlus /> Add Funds
                        </button>
                        <button
                            onClick={() => setShowWithdrawModal(true)}
                            className="p-4 bg-gradient-to-r from-green-600 to-teal-500 text-white rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-all"
                        >
                            <FaArrowUp /> Withdraw
                        </button>
                    </div>
                </div>
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
                                <FaHistory className="text-2xl text-blue-500 mr-3" />
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
                                            <span className="text-lg ml-1 font-medium"> </span>
                                            <span className="text-lg font-bold">{`₹${tx.amount}`}</span>
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

            {/* Add Money Modal */}
            {showAddMoneyModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl p-6 max-w-md w-full">
                        <h3 className="text-xl font-bold mb-4">Add Funds</h3>
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="Enter amount"
                            className="w-full p-3 mb-4 border rounded-lg focus:ring-2 focus:ring-purple-500"
                            min="1"
                        />
                        <div className="flex gap-4">
                            <button
                                onClick={handleAddMoney}
                                className="flex-1 bg-purple-600 text-white p-3 rounded-lg hover:bg-purple-700 flex items-center justify-center gap-2"
                                disabled={!amount || amount <= 0}
                            >
                                <FaPlus /> Add Funds via Stripe
                            </button>
                            <button
                                onClick={() => setShowAddMoneyModal(false)}
                                className="flex-1 bg-gray-200 text-gray-800 p-3 rounded-lg hover:bg-gray-300"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Withdraw Modal */}
            {showWithdrawModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl p-6 max-w-md w-full">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold">Withdraw Funds</h3>
                            <div className="text-sm text-gray-500">
                                Available: ₹{balance}
                            </div>
                        </div>
                        
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="Enter amount"
                            className="w-full p-3 mb-4 border rounded-lg focus:ring-2 focus:ring-green-500"
                            max={balance}
                            min="1"
                        />
                        
                        <select
                            value={paymentMethod}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                            className="w-full p-3 mb-6 border rounded-lg focus:ring-2 focus:ring-green-500"
                        >
                            <option value="bank">Bank Transfer</option>
                            <option value="upi">UPI</option>
                        </select>

                        {amount > balance && (
                            <div className="text-red-500 text-sm mb-4">
                                Amount exceeds available balance
                            </div>
                        )}
                        
                        <div className="flex gap-4">
                            <button
                                onClick={handleWithdraw}
                                className="flex-1 bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                                disabled={!amount || amount <= 0 || amount > balance}
                            >
                                <FaArrowUp /> 
                                Withdraw
                            </button>
                            <button
                                onClick={() => {
                                    setShowWithdrawModal(false);
                                    setAmount('');
                                }}
                                className="flex-1 bg-gray-200 text-gray-800 p-3 rounded-lg hover:bg-gray-300 transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// Add this CSS to your stylesheet
const styles = `
.shadow-artistic {
box-shadow: 0 4px 24px -2px rgba(128, 0, 255, 0.1);
}
.hover\:shadow-lg:hover {
box-shadow: 0 8px 32px -4px rgba(128, 0, 255, 0.15);
}
`;


export default Wallet;
