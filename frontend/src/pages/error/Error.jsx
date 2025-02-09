import React from "react";

const Error = ({ message, onRetry }) => {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen px-6">
      <div className="text-red-700 px-6 py-4 rounded-lg  w-full text-center">
        <p className="text-lg font-semibold">{message || "Something went wrong!"}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="mt-4 bg-red-500 text-white px-5 py-2 rounded-lg hover:bg-red-700 transition"
          >
            Retry
          </button>
        )}
      </div>
    </div>
  );
};

export default Error;
