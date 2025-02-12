import React, { useState } from "react";
import { FaStar } from "react-icons/fa";
import config from "../configs/config"; // Ensure this file contains your Base_url

const ReviewForm = ({ artistId }) => {
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
  
    if (rating === 0) {
      setMessage("Please provide a rating.");
      return;
    }
  
    setLoading(true);
  
    try {
      const response = await fetch(`${config.baseUrl}/api/reviews/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Ensure user is authenticated
        },
        body: JSON.stringify({ artistId, rating, reviewText }),
      });
  
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to submit review");
      }
  
      setMessage("Review submitted successfully!");
      setRating(0);
      setReviewText("");
  
      // Refresh the page after submission
      setTimeout(() => {
        window.location.reload();
      }, 100); // Optional delay for better UX
    } catch (error) {
      setMessage(error.message);
    }
  
    setLoading(false);
  };
  

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 ">
      <h3 className="text-lg font-bold mb-2">Leave a Review</h3>

      {/* Star Rating */}
      <div className="flex mb-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <FaStar
            key={star}
            onClick={() => setRating(star)}
            className={`w-6 h-6 cursor-pointer ${
              star <= rating ? "text-yellow-400" : "text-gray-300"
            }`}
          />
        ))}
      </div>

      <textarea
        className="w-full p-2 border rounded-md"
        placeholder="Write your review..."
        value={reviewText}
        onChange={(e) => setReviewText(e.target.value)}
      />

      <button
        type="submit"
        className="mt-3 bg-pink-500 text-white px-4 py-2 rounded-lg hover:bg-pink-600"
        disabled={loading}
      >
        {loading ? "Submitting..." : "Submit Review"}
      </button>

      {message && <p className="mt-2 text-sm text-red-500">{message}</p>}
    </form>
  );
};

export default ReviewForm;
