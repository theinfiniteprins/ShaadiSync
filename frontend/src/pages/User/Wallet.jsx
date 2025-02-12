import { useState, useEffect } from "react";
import { FaWallet } from "react-icons/fa6";
import TransactionHistory from "../../components/TransactionHistory";
import config from "../../configs/config";

const Wallet = () => {
  const [syncCoins, setSyncCoins] = useState(0);
  const [amount, setAmount] = useState(0);
  const [transactions, setTransactions] = useState([]); // FIX: Declare state properly

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
        setTransactions(data); // FIX: Set transactions state properly
      } catch (error) {
        console.error(error.message);
      }
    };

    fetchSyncCoins();
    fetchTransactions();
  }, []);

  const handleAddCoins = () => {
    if (amount > 0) {
      setSyncCoins(syncCoins + amount);
      setAmount(0);
    }
  };

  return (
    <div className="px-60 py-8 min-h-screen bg-gray-50">
      <h1 className="text-4xl font-bold text-gray-800 mb-8 flex items-center justify-center">
        <FaWallet className="mr-3 text-blue-600" /> My Wallet
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Sync Coins Section */}
        <div className="bg-white shadow-lg rounded-lg p-8 text-center border border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-700">Your Sync Coins</h2>
          <p className="text-5xl font-bold text-blue-600 mt-4">{syncCoins}</p>
        </div>

        {/* Add Sync Coins Section */}
        <div className="bg-white shadow-lg rounded-lg p-8 text-center border border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-700">Add Sync Coins</h2>

          <div className="flex justify-center mt-4 space-x-4">
            {[10, 20, 50].map((value) => (
              <button
                key={value}
                className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition duration-300"
                onClick={() => setAmount(amount + value)}
              >
                +{value}
              </button>
            ))}
          </div>

          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="border border-gray-300 p-3 w-full rounded-lg mt-4 text-center text-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Enter amount"
          />

          <button
            className="bg-green-500 text-white px-6 py-3 mt-4 rounded-lg hover:bg-green-700 transition duration-300 w-full"
            onClick={handleAddCoins}
          >
            Add Coins
          </button>
        </div>
      </div>

      {/* Transaction History */}
      <TransactionHistory transactions={transactions} />
    </div>
  );
};

export default Wallet;
