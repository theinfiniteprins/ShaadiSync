import { useState, useEffect } from "react";
import { FaWallet, FaCoins, FaHistory } from "react-icons/fa";
import TransactionHistory from "../../components/TransactionHistory";
import config from "../../configs/config";

const Wallet = () => {
  const [syncCoins, setSyncCoins] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [amount, setAmount] = useState(0);

  // Predefined coin amounts
  const coinOptions = [5, 10, 50];

  useEffect(() => {
    const fetchSyncCoins = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const response = await fetch(`${config.baseUrl}/api/users/getBalance`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch sync coins");
        }
        const data = await response.json();
        setSyncCoins(data.SyncCoin);
      } catch (error) {
        console.error(error.message);
      }
    };

    const fetchTransactions = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const response = await fetch(`${config.baseUrl}/api/user-transaction-history/getHistory`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch transactions");
        }
        const data = await response.json();
        setTransactions(data);
      } catch (error) {
        console.error(error.message);
      }
    };

    fetchSyncCoins();
    fetchTransactions();
  }, []);

  const handleAddCoins = async () => {
    if (amount <= 0) return;
    
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('No token found');
            return;
        }

        // Calculate actual amount (each SyncCoin costs ₹10)
        const paymentAmount = amount * 10;

        const response = await fetch(`${config.baseUrl}/api/payment/create-checkout-session`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                amount: paymentAmount,
                paymentType: 'syncCoins' // Add payment type
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
        // TODO: Add error toast notification here
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-pink-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <FaWallet className="mx-auto h-12 w-12 text-pink-500 mb-4" />
            <h1 className="text-4xl font-bold text-gray-900 mb-2">My Wallet</h1>
            <p className="text-lg text-gray-600">
              Manage your SyncCoins and view transaction history
            </p>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Balance Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="mb-6 md:mb-0">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Current Balance</h2>
              <p className="text-gray-600">Your available SyncCoins</p>
            </div>
            <div className="flex items-center bg-gradient-to-r from-pink-100 to-pink-50 px-8 py-6 rounded-2xl shadow-sm">
              <FaCoins className="text-3xl text-yellow-500 mr-4" />
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Balance</p>
                <span className="text-4xl font-bold text-gray-900">{syncCoins}</span>
              </div>
            </div>
          </div>

          {/* Add Coins Section */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <label className="block text-sm font-medium text-gray-700 mb-4">
              Add SyncCoins
            </label>
            
            {/* Quick Select Options */}
            <div className="grid grid-cols-3 gap-4 mb-4">
              {coinOptions.map((option) => (
                <button
                  key={option}
                  onClick={() => setAmount(option)}
                  className={`p-4 rounded-xl border-2 transition-all duration-200 flex items-center justify-center gap-2
                    ${amount === option 
                      ? 'border-pink-500 bg-pink-50 text-pink-600' 
                      : 'border-gray-200 hover:border-pink-200 hover:bg-pink-50'}`}
                >
                  <FaCoins className="text-yellow-500" />
                  <span className="font-medium">+{option}</span>
                </button>
              ))}
            </div>

            {/* Custom Amount Input */}
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <div className="flex-grow">
                <input
                  type="number"
                  id="amount"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-pink-500 focus:border-pink-500"
                  placeholder="Or enter custom amount"
                  min="0"
                />
              </div>
              <button
                onClick={handleAddCoins}
                className="bg-pink-500 text-white px-6 py-2 rounded-lg hover:bg-pink-600 transition-colors flex items-center gap-2"
              >
                <FaCoins className="text-yellow-300" />
                Add Coins
              </button>
            </div>
          </div>
        </div>

        {/* Transaction History Component */}
        <TransactionHistory transactions={transactions} />
      </div>
    </div>
  );
};

export default Wallet;
