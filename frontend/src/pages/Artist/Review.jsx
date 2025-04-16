import React, { useState, useEffect } from "react";
import config from "../../configs/config";
import { FaStar, FaSpinner, FaExclamationCircle } from "react-icons/fa";

const Review = () => {
  const [reviews, setReviews] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const reviewsPerPage = 6;

  // Fetch Reviews from API
  useEffect(() => {
    const token = localStorage.getItem("artistToken");
    console.log(token);

    const fetchReviews = async () => {
      try {
        const response = await fetch(`${config.baseUrl}/api/reviews/artistreview/get-rating`, {
          method: "GET",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        console.log(data);

        setReviews(data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load reviews.");
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = reviews.slice(indexOfFirstReview, indexOfLastReview);
  const totalPages = Math.ceil(reviews.length / reviewsPerPage);

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Customer Reviews</h2>

      {loading && (
        <div className="flex justify-center items-center py-6">
          <FaSpinner className="animate-spin text-4xl text-blue-500" />
        </div>
      )}
      {error && (
        <div className="flex items-center p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg" role="alert">
          <FaExclamationCircle className="inline mr-2" />
          <span>{error}</span>
        </div>
      )}

      {!loading && !error && (
        <>
          <div className="space-y-4">
            {currentReviews.map((review) => (
              <div
                key={review._id}
                className="p-6 border rounded-lg shadow-md bg-gray-50 hover:shadow-lg transition-shadow duration-300"
              >
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-700">
                    {review.userId?.name || 'Anonymous User'}
                  </span>
                  <span className="text-sm text-gray-500">
                    {new Date(review.createdAt).toLocaleDateString()} {" "}
                    {new Date(review.createdAt).toLocaleTimeString()}
                  </span>
                </div>
                <div className="flex items-center gap-1 mt-2">
                  {[...Array(5)].map((_, i) => (
                    <FaStar
                      key={i}
                      className={i < review.rating ? "text-yellow-500" : "text-gray-300"}
                    />
                  ))}
                </div>
                <p className="mt-2 text-gray-600">{review.reviewText || 'No review text provided'}</p>
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          <div className="flex justify-center mt-8">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 mr-2 text-white bg-blue-500 rounded hover:bg-blue-600 disabled:bg-gray-300 transition-colors duration-200"
            >
              Previous
            </button>
            <span className="px-4 py-2 text-gray-700">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 ml-2 text-white bg-blue-500 rounded hover:bg-blue-600 disabled:bg-gray-300 transition-colors duration-200"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Review;