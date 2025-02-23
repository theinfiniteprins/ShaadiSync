import { useState } from "react";

export default function BusinessInfo({ prevStep, nextStep, formData, handleChange }) {
    const [error, setError] = useState(""); // Error state

    const handleNext = () => {
        if (!formData.businessName.trim()) {
            setError("Business Name is required.");
            return;
        }
        setError(""); // Clear error if valid
        nextStep();
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#155dfc]/10 via-white to-[#155dfc]/5">
            <div className="max-w-md w-full m-4">
                <div className="bg-white p-8 rounded-2xl shadow-2xl space-y-6">
                    <h2 className="text-center text-3xl font-extrabold text-[#155dfc]">Enter Business Name</h2>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Business Name</label>
                        <input
                            type="text"
                            name="businessName"
                            value={formData.businessName}
                            onChange={(e) => {
                                handleChange(e);
                                setError(""); // Clear error on input change
                            }}
                            placeholder="Business Name"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#155dfc] transition"
                        />
                        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
                    </div>

                    <div className="flex justify-between">
                        <button
                            onClick={prevStep}
                            className="px-6 py-3 text-[#155dfc] border border-[#155dfc] rounded-lg font-medium transition hover:bg-[#155dfc]/10"
                        >
                            Back
                        </button>
                        <button
                            onClick={handleNext}
                            className="px-6 py-3 text-white bg-[#155dfc] hover:bg-[#1550e0] rounded-lg font-medium transition"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
