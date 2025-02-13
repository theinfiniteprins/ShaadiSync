import React, { useEffect, useState } from "react";
import { FaStar, FaEdit, FaTrash } from "react-icons/fa";
import config from "../configs/config";
import { useAuth } from "../context/AuthContext";

const ReviewList = ({ artistId }) => {
    const [reviews, setReviews] = useState([]);
    const [editReview, setEditReview] = useState(null);
    const { user } = useAuth();

    useEffect(() => {
        fetchReviews();
    }, []);

    const fetchReviews = async () => {
        try {
            const response = await fetch(`${config.baseUrl}/api/reviews/artist/${artistId._id}`);
            const data = await response.json();
            setReviews(data);
        } catch (error) {
            console.error("Failed to fetch reviews", error);
        }
    };

    const handleDelete = async (reviewId) => {
        if (!window.confirm("Are you sure you want to delete this review?")) return;
        try {
            await fetch(`${config.baseUrl}/api/reviews/${reviewId}`, { method: "DELETE" });
            setReviews(reviews.filter((review) => review._id !== reviewId));
            window.location.reload();
        } catch (error) {
            console.error("Failed to delete review", error);
        }
    };

    return (
        <div className="bg-white p-6 shadow-lg rounded-xl mt-6">
            <h3 className="text-xl font-bold mb-4 text-gray-900">User Reviews</h3>

            {reviews.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No reviews yet. Be the first to review!</p>
            ) : (
                <div className="space-y-6">

                    {reviews.map((review) => (
                        <div key={review._id} className="p-4 bg-gray-50 rounded-lg shadow-sm">
                            <div className="flex items-center mb-2">
                                <p className="text-gray-900 font-semibold">{review.userId?.name || "Anonymous"}</p>
                            </div>
                            <p className="text-gray-700 text-sm leading-relaxed">{review.reviewText}</p>

                            {/* Show delete button only if the logged-in user is the review owner */}
                            {user && review.userId && review.userId._id === user._id && (
                                <button onClick={() => handleDelete(review._id)} className="text-red-500">
                                    <FaTrash />
                                </button>
                            )}
                        </div>
                    ))}

                </div>
            )}
        </div>
    );
};

export default ReviewList;
