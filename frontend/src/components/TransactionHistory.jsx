const TransactionHistory = ({ transactions }) => {
    return (
        <div className="bg-white bg-opacity-90 backdrop-blur-md shadow-lg rounded-lg p-8 mt-8">
            <h2 className="text-2xl font-semibold text-gray-700 text-center mb-6">
                Transaction History
            </h2>

            <div className="flex flex-col space-y-4">
                {transactions.map((tx) => (
                    <div
                        key={tx.id}
                        className={`flex justify-between items-center p-4 rounded-lg shadow-md ${tx.transactionType === "credit" ? "bg-green-100" : "bg-red-100"
                            }`}
                    >
                        <div className="text-gray-600">
                            <p className="text-lg font-semibold">{tx.description}</p>
                            <p className="text-sm text-gray-500">
                                {new Date(tx.createdAt).toLocaleString("en-US", {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    second: "2-digit",
                                    hour12: true,
                                })}
                            </p>
                        </div>
                        <div className="text-lg font-semibold">
                            {tx.transactionType === "credit" ? (
                                <span className="text-green-600">+{tx.syncCoin} Sync Coins</span>
                            ) : (
                                <span className="text-red-600">-{tx.syncCoin} Sync Coins</span>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TransactionHistory;
