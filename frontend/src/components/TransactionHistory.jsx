import { useState } from 'react';
import { FaHistory, FaArrowUp, FaArrowDown, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const TransactionHistory = ({ transactions }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const transactionsPerPage = 5;
    
    // Calculate pagination
    const indexOfLastTransaction = currentPage * transactionsPerPage;
    const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage;
    const currentTransactions = transactions.slice(indexOfFirstTransaction, indexOfLastTransaction);
    const totalPages = Math.ceil(transactions.length / transactionsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <div className="bg-white rounded-2xl shadow-lg p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center">
                    <FaHistory className="text-2xl text-pink-500 mr-3" />
                    <h2 className="text-2xl font-bold text-gray-900">Transaction History</h2>
                </div>
                <div className="bg-pink-50 px-4 py-2 rounded-full">
                    <span className="text-sm text-pink-600 font-medium">
                        {transactions.length} Transactions
                    </span>
                </div>
            </div>

            {/* Transactions List */}
            <div className="space-y-4 mb-6">
                {transactions.length === 0 ? (
                    <div className="text-center py-8">
                        <div className="text-gray-400 text-6xl mb-4">💰</div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No Transactions Yet</h3>
                        <p className="text-gray-600">Your transaction history will appear here</p>
                    </div>
                ) : (
                    currentTransactions.map((tx) => (
                        <div
                            key={tx.id}
                            className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:shadow-md transition-all duration-200"
                        >
                            {/* Left side - Transaction Info */}
                            <div className="flex items-center space-x-4">
                                <div className={`p-3 rounded-full ${
                                    tx.transactionType === "credit" 
                                        ? "bg-green-100 text-green-600" 
                                        : "bg-red-100 text-red-600"
                                }`}>
                                    {tx.transactionType === "credit" 
                                        ? <FaArrowUp className="text-lg" />
                                        : <FaArrowDown className="text-lg" />
                                    }
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-1">
                                        {tx.description}
                                    </h3>
                                    <p className="text-sm text-gray-500">
                                        {new Date(tx.createdAt).toLocaleString("en-US", {
                                            year: "numeric",
                                            month: "short",
                                            day: "numeric",
                                            hour: "2-digit",
                                            minute: "2-digit",
                                            hour12: true,
                                        })}
                                    </p>
                                </div>
                            </div>

                            {/* Right side - Amount */}
                            <div className={`flex items-center ${
                                tx.transactionType === "credit" 
                                    ? "text-green-600" 
                                    : "text-red-600"
                            }`}>
                                <span className="text-lg font-bold">
                                    {tx.transactionType === "credit" ? "+" : "-"}
                                    {tx.syncCoin}
                                </span>
                                <span className="text-sm ml-1 font-medium">
                                    Coins
                                </span>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Pagination */}
            {transactions.length > transactionsPerPage && (
                <div className="flex items-center justify-center space-x-2 pt-4 border-t border-gray-100">
                    {/* Previous Button */}
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={`p-2 rounded-lg ${
                            currentPage === 1
                                ? 'text-gray-300 cursor-not-allowed'
                                : 'text-gray-600 hover:bg-pink-50'
                        }`}
                    >
                        <FaChevronLeft className="text-lg" />
                    </button>

                    {/* Page Numbers */}
                    {[...Array(totalPages)].map((_, index) => (
                        <button
                            key={index + 1}
                            onClick={() => handlePageChange(index + 1)}
                            className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                                currentPage === index + 1
                                    ? 'bg-pink-500 text-white'
                                    : 'text-gray-600 hover:bg-pink-50'
                            }`}
                        >
                            {index + 1}
                        </button>
                    ))}

                    {/* Next Button */}
                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className={`p-2 rounded-lg ${
                            currentPage === totalPages
                                ? 'text-gray-300 cursor-not-allowed'
                                : 'text-gray-600 hover:bg-pink-50'
                        }`}
                    >
                        <FaChevronRight className="text-lg" />
                    </button>
                </div>
            )}
        </div>
    );
};

export default TransactionHistory;
