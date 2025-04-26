import React, { useEffect, useState } from "react";
import { FaStar, FaTrash, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import config from "../configs/config";
import { useAuth } from "../context/AuthContext";

const ReviewList = ({ artistId }) => {
    const [reviews, setReviews] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const reviewsPerPage = 5;
    const { user, token } = useAuth();
    // console.log(artistId);
    

    useEffect(() => {
        fetchReviews();
    }, []);

    const fetchReviews = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${config.baseUrl}/api/reviews/artist/${artistId}`);
            
            const data = await response.json();
            setReviews(data.length ? data : []);
        } catch (error) {
            setError(error.message);
            setReviews([]);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (reviewId) => {
        if (!window.confirm("Are you sure you want to delete this review?")) return;
        try {
            await fetch(`${config.baseUrl}/api/reviews/${reviewId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setReviews(reviews.filter((review) => review._id !== reviewId));
        } catch (error) {
            console.error("Failed to delete review", error);
        }
    };

    const indexOfLastReview = currentPage * reviewsPerPage;
    const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
    const currentReviews = reviews.slice(indexOfFirstReview, indexOfLastReview);
    const totalPages = Math.ceil(reviews.length / reviewsPerPage);

    return (
        <div className="bg-white p-6 shadow-lg rounded-xl mt-6">
            <h3 className="text-xl font-bold mb-4 text-gray-900">User Reviews</h3>

            {loading ? (
                <p className="text-gray-500 text-center py-4">Loading reviews...</p>
            ) : error ? (
                <p className="text-red-500 text-center py-4">{error}</p>
            ) : reviews.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No reviews yet. Be the first to review!</p>
            ) : (
                <div className="space-y-6">
                    {currentReviews.map((review) => (
                        <div key={review._id} className="p-4 bg-gray-50 rounded-lg shadow-sm">
                            <div className="flex items-center justify-between">
                                <p className="text-gray-900 font-semibold">{review.userId?.name || "Anonymous"}</p>
                                {user && review.userId && review.userId._id === user._id && (
                                    <button onClick={() => handleDelete(review._id)} className="text-red-500">
                                        <FaTrash />
                                    </button>
                                )}
                            </div>

                            <div className="flex items-center my-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <FaStar
                                        key={star}
                                        className={`w-4 h-4 ${star <= review.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                                    />
                                ))}
                                <span className="ml-2 text-gray-600 text-sm">({review.rating || "No Rating"})</span>
                            </div>

                            <p className="text-gray-700 text-sm leading-relaxed">{review.reviewText || "No review text provided."}</p>
                        </div>
                    ))}
                </div>
            )}

            {reviews.length > reviewsPerPage && (
                <div className="flex items-center justify-center space-x-2 pt-4 border-t border-gray-100 mt-4">
                    <button
                        onClick={() => setCurrentPage(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={`p-2 rounded-lg ${currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-pink-50'}`}
                    >
                        <FaChevronLeft className="text-lg" />
                    </button>

                    {[...Array(totalPages)].map((_, index) => (
                        <button
                            key={index + 1}
                            onClick={() => setCurrentPage(index + 1)}
                            className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${currentPage === index + 1 ? 'bg-pink-500 text-white' : 'text-gray-600 hover:bg-pink-50'}`}
                        >
                            {index + 1}
                        </button>
                    ))}

                    <button
                        onClick={() => setCurrentPage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className={`p-2 rounded-lg ${currentPage === totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-pink-50'}`}
                    >
                        <FaChevronRight className="text-lg" />
                    </button>
                </div>
            )}
        </div>
    );
};

export default ReviewList;